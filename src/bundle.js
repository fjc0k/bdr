const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const consola = require('consola')
const gzipSize = require('gzip-size')
const fileSize = require('filesize')
const minimatch = require('minimatch')
const uglify = require('rollup-plugin-uglify')
const babel = require('rollup-plugin-babel')
const postcss = require('rollup-plugin-postcss')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')
const json = require('rollup-plugin-json')
const re = require('rollup-plugin-re')
const preset = require('@fir-ui/babel-preset-library')
const createBanner = require('./create-banner')
const rollup = require('./rollup')

module.exports = ({ config: configName = 'firb' } = {}) => {
  consola.start('Building...')

  const config = require('./config')(configName)

  const cssProcessed = {}

  config.clear && fs.emptyDirSync(config.dest)

  _.forOwn(config.entry, ([filePath, moduleName], name) => {
    _.forOwn(config.format, (suffix, format) => {
      const compress = format.endsWith('-min')
      format = format.split('-')[0]
      const banner = createBanner(config.banner, config.pkg) || ''
      const inline = format === 'umd' ? true : config.inline
      rollup({
        onwarn(err) {
          if (_.isString(err)) {
            return consola.warn(err)
          }
          const { loc, frame, message, code, source } = err
          if (
            code === 'UNUSED_EXTERNAL_IMPORT' ||
            code === 'THIS_IS_UNDEFINED' ||
            (!inline && code === 'UNRESOLVED_IMPORT' && source)
          ) return // eslint-disable-line
          if (loc) {
            consola.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`)
            if (frame) consola.warn(frame)
          } else {
            consola.warn(code, message)
          }
        },
        input: filePath,
        treeshake: {
          pureExternalModules: !config.sideEffects
        },
        external: config.external && (id => {
          return id !== filePath && _.castArray(config.external).some(pattern => {
            return minimatch(id, pattern)
          })
        }),
        plugins: [
          config.replace && re(config.replace),
          config.alias && alias({
            ...config.alias,
            resolve: ['', '/index.js', ...config.resolve]
          }),
          inline && resolve({
            module: true,
            preferBuiltIns: true,
            extensions: config.resolve
          }),
          commonjs(),
          json(),
          postcss({
            extract: true,
            minimize: compress && {
              discardUnused: false,
              mergeLonghand: false
            },
            sourceMap: config.sourceMap,
            ...config.postcss,
            plugins: [
              ...(config.postcss.plugins || []),
              require('postcss-url')(config.postcss.url || { url: 'inline' }),
              require('autoprefixer')
            ],
            use: [
              ['stylus', {
                paths: config.postcss.paths
              }],
              ['sass', {
                includePaths: config.postcss.paths
              }],
              ['less', {
                paths: config.postcss.paths
              }]
            ],
            onExtract(getExtracted) {
              const id = `${filePath}-${compress ? '-min' : ''}`
              if (!cssProcessed[id]) {
                const cssFilePath = path.join(
                  config.dest,
                  config.filename
                    .replace(/\[name\]/g, name)
                    .replace(/\[suffix\]/g, compress ? '.min' : '')
                    .replace(/\[type\]/g, 'css')
                )
                let { code, map } = getExtracted()
                code = compress ? String(code).replace(/\r|\n/g, '') : code
                fs.writeFile(cssFilePath, banner + code, 'utf8')
                consola.success(`Built: ${path.basename(cssFilePath)}`)
                config.sourceMap && fs.writeFile(`${cssFilePath}.map`, map, 'utf8')
                cssProcessed[id] = true
              }
              return false
            }
          }),
          babel({
            include: '**/*.js',
            exclude: 'node_modules/**',
            babelrc: false,
            presets: [
              [preset, {
                ...config.babel,
                env: { modules: false }
              }]
            ]
          }),
          compress && uglify({
            output: {
              preamble: banner
            }
          })
        ]
      }, {
        format: format,
        name: moduleName,
        sourcemap: config.sourceMap,
        banner: banner,
        file: path.join(
          config.dest,
          config.filename
            .replace(/\[name\]/g, name)
            .replace(/\[suffix\]/g, suffix)
            .replace(/\[type\]/g, 'js')
        )
      }, config.afterBundle, (_, { file }) => {
        // getUmdMinSize
        if (config.getUmdMinSize && format === 'umd' && compress) {
          const umdContent = fs.readFileSync(file)
          const rawSize = fileSize(Buffer.byteLength(umdContent))
          const gzippedSize = fileSize(gzipSize.sync(umdContent))
          config.getUmdMinSize(rawSize, gzippedSize)
        }

        consola.success(`Built: ${path.basename(file)}`)
      })
    })
  })
}
