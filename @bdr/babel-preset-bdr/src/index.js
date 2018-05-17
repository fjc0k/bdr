const { declare } = require('@babel/helper-plugin-utils')
const presetEnv = require('@babel/preset-env')

const transformOptionalChaining = require('@babel/plugin-proposal-optional-chaining')
const transformClassProperties = require('@babel/plugin-proposal-class-properties')
const transformObjectSpread = require('@babel/plugin-proposal-object-rest-spread')
const transformLodash = require('babel-plugin-lodash')
const transformAsync = require('fast-async')

module.exports = declare(
  (api, options = {}) => {
    api.assertVersion(7)

    const {
      loose = true,
      polyfill = false,
      lodash = true,
      objectAssign = false,
      env = {}
    } = options

    // 适配 vue-cli
    if (process.env.VUE_CLI_BABEL_TRANSPILE_MODULES) {
      env.modules = 'commonjs'
    }
    if (process.env.VUE_CLI_BABEL_TARGET_NODE) {
      env.targets = { node: 'current' }
    }

    const presets = [
      // Env
      [presetEnv, {
        loose,
        useBuiltIns: polyfill ? 'usage' : false,
        // For fast-async
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
        ...env
      }]
    ]

    const plugins = [
      // Async/Await
      [transformAsync, {
        spec: true
      }],
      // Optional chaining
      [transformOptionalChaining, {
        loose,
        useBuiltIns: !polyfill
      }],
      // Object spread
      [transformObjectSpread, {
        loose,
        useBuiltIns: objectAssign
      }],
      // Class properties
      [transformClassProperties, {
        loose,
        useBuiltIns: !polyfill
      }]
    ]

    // Lodash
    if (lodash) plugins.push(transformLodash)

    return { presets, plugins }
  }
)
