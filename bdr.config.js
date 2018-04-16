module.exports = {
  entry: 'test/index.js',
  format: 'cjs,umd-min',
  alias: {
    '@': 'test'
  },
  dest: 'test/dist',
  postcss: {
    modules: true
  },
  getUmdMinSize: console.log
}
