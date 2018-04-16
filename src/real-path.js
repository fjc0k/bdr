const path = require('path')

module.exports = path.resolve.bind(
  path,
  process.cwd()
)
