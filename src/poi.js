const path = require('path')
const Poi = require('poi')
const realPath = require('./real-path')

module.exports = (command, options) => {
  if (options.entry) {
    options.entry = realPath(options.entry)
  }

  const app = new Poi(command, {
    ...options,
    cwd: path.join(__dirname, '..')
  })

  app.run().catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
}
