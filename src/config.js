const _ = require('lodash')
const fs = require('fs-extra')
const UseConfig = require('use-config')
const parseEntry = require('./parse-entry')
const parseFormat = require('./parse-format')
const realPath = require('./real-path')

const pkgPath = realPath('package.json')
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {}
const pkgName = pkg.name || 'app'

const defaultConfig = {
  entry: {
    [pkgName]: ['src/index.js', pkgName]
  },
  dest: 'dist',
  format: ['es', 'cjs', 'umd', 'umd-min'],
  banner: true,
  postcss: {},
  alias: {
    '@': 'src'
  },
  filename: '[name][suffix].[type]',
  babel: {},
  resolve: ['.js', '.json'],
  sideEffects: false,
  sourceMap: false,
  clear: true,
  inline: false,
  replace: false,
  external: false,
  typescript: require('typescript'),
  globals: {}
}

module.exports = configName => {
  const config = {}

  const hasConfigPath = fs.existsSync(realPath(configName))

  const loadedConfig = new UseConfig(
    Object.assign(
      { name: configName },
      hasConfigPath ? { files: [configName] } : {}
    )
  ).loadSync()

  Object.assign(
    config,
    _.cloneDeep(defaultConfig),
    (loadedConfig && loadedConfig.config) || {},
    { pkg }
  )

  config.entry = config.entry ? parseEntry(config.entry) : {}
  config.format = config.format ? parseFormat(config.format) : {}
  config.dest = realPath(config.dest)

  // Normalize alias
  if (_.isPlainObject(config.alias)) {
    config.alias = _.mapValues(
      config.alias,
      src => realPath(src)
    )
  }

  // Normalize filename
  if (!_.isFunction(config.filename)) {
    const filename = String(config.filename)
    config.filename = args => {
      return _.reduce(args, (filename, value, key) => {
        return filename.replace(
          new RegExp(`\\[${key}\\]`, 'g'),
          value
        )
      }, filename)
    }
  }

  // Normalize external
  if (_.isPlainObject(config.external)) {
    config.globals = {
      ...config.globals,
      ...config.external
    }
    config.external = Object.keys(config.external)
  }

  return config
}
