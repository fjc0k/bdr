const { transformFileSync } = require('@babel/core')
const { assert } = require('chai')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const preset = require('../src')

glob
  .sync(path.join(__dirname, 'fixtures/*/'))
  .forEach(testPath => {
    it(path.parse(testPath).name, () => {
      const inputPath = path.join(testPath, 'input.js')
      const outputPath = path.join(testPath, 'output.js')
      const optionsPath = path.join(testPath, 'options.js')

      const expected = fs.readFileSync(outputPath, 'utf8')
      const options = fs.existsSync(optionsPath) ? require(optionsPath) : {}

      const actual = transformFileSync(inputPath, {
        presets: [[preset, options]]
      }).code

      fs.writeFileSync(
        path.join(testPath, 'actual.js'),
        actual,
        'utf8'
      )

      assert.strictEqual(
        actual.replace(/^\s+|\r|\n|\s+$/g, ''),
        expected.replace(/^\s+|\r|\n|\s+$/g, '')
      )
    })
  })
