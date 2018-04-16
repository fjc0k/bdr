const _ = require('lodash')

const availableFormats = {
  cjs: '.cjs',
  umd: '',
  es: '.es',
  'cjs-min': '.cjs.min',
  'umd-min': '.min',
  'es-min': '.es.min'
}

module.exports = formats => {
  if (formats === 'all') {
    formats = _.keys(availableFormats)
  }
  if (_.isString(formats)) {
    formats = formats.split(',')
  }
  if (_.isArray(formats)) {
    formats = formats.filter(
      format => format && _.has(availableFormats, format)
    ).reduce((result, format) => {
      result[format] = availableFormats[format]
      return result
    }, {})
  }
  if (_.isPlainObject(formats)) {
    formats = _.pickBy(
      formats,
      (suffix, format) => _.has(availableFormats, format)
    )
  }
  return formats
}
