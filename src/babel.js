const glob = require('glob')
const fs = require('fs-extra')
const path = require('path')
const depth = require('path-depth')
const { transformFileSync } = require('@babel/core')
const preset = require('@bdr/babel-preset-bdr')
const realPath = require('./real-path')

const cwd = realPath('.')

module.exports = (src, to) => {
  to = realPath(to)

  const files = (
    glob
      .sync(src, { cwd })
      .map(filePath => realPath(filePath))
      .filter(
        filePath => fs.statSync(filePath).isFile()
      )
  )

  if (files.length === 0) return

  const { root } = files.reduce((root, filePath) => {
    let tmpDepth
    if ((tmpDepth = depth(filePath)) < root.depth) {
      root = {
        root: filePath,
        depth: tmpDepth
      }
    }
    return root
  }, {
    root: files[0],
    depth: depth(files[0])
  })

  const srcRoot = path.parse(root).dir

  files.forEach(filePath => {
    if (!fs.statSync(filePath).isFile()) return

    const { code } = transformFileSync(filePath, {
      babelrc: false,
      presets: [[preset]]
    })

    const targetPath = path.join(to, path.relative(srcRoot, filePath))

    fs.outputFileSync(targetPath, code, 'utf8')
  })
}
