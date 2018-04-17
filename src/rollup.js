const { rollup } = require('rollup')

module.exports = async (inputOptions, outputOptions, afterBundle) => {
  await (
    await rollup(inputOptions)
  ).write(outputOptions)

  afterBundle && afterBundle(inputOptions, outputOptions)
}
