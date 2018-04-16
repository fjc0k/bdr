const _ = require('lodash')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const realPath = require('./real-path')

const cwd = realPath('.')

const parseEntry = entry => {
  if (_.isString(entry)) {
    entry = { '': entry }
  }
  if (!_.isPlainObject(entry)) {
    throw new Error('[fir-bundler]: entry must be an object.')
  }

  let finalEntry = {}

  _.forOwn(entry, (filePath, name) => {
    name = _.kebabCase(name)

    if (_.isArray(filePath)) { // [entry, moduleName]
      filePath[0] = realPath(filePath[0])
      filePath[1] = filePath[1] || _.camelCase(name)
      finalEntry[name] = filePath
    } else if (_.isString(filePath)) {
      glob.sync(filePath, { cwd })
        .map(filePath => realPath(filePath))
        .reduce((finalEntry, filePath) => {
          filePath = realPath(filePath)
          let fileName = path.parse(filePath).name
          fileName = (name ? `${name}-` : '') + _.kebabCase(fileName)
          finalEntry[fileName] = [
            filePath,
            _.camelCase(fileName)
          ]
          return finalEntry
        }, finalEntry)
    }
  })

  finalEntry = _.pickBy(finalEntry, entry => {
    try {
      return fs.statSync(entry[0]).isFile()
    } catch (e) {
      return false
    }
  })

  return finalEntry
}

module.exports = parseEntry
