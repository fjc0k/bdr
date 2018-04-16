const _ = require('lodash')
const { rollup } = require('rollup')
const fs = require('fs-extra')

module.exports = async (inputOptions, outputOptions, afterBundle = {}, done) => {
  const bundle = await rollup(inputOptions)
  const result = await bundle.write(outputOptions)

  let content = String(fs.readFileSync(outputOptions.file))
  if (afterBundle.replace) {
    _.forOwn(afterBundle.replace, (value, key) => {
      content = content.replace(new RegExp(key, 'g'), value)
    })
  }
  fs.writeFileSync(outputOptions.file, content)

  done && done(inputOptions, outputOptions, result)
}
