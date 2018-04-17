const fs = require('fs-extra')

module.exports = (handler, payload = {}) => {
  if (handler && payload.file) {
    payload.content = String(fs.readFileSync(payload.file))
    const result = handler(payload)
    if (result != null) { // eslint-disable-line
      fs.writeFileSync(payload.file, result)
    }
  }
}
