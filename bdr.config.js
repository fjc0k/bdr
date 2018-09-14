module.exports = {
  entry: 'test/index.ts',
  format: 'es,cjs,umd-min',
  alias: {
    '@': 'test'
  },
  dest: 'test/dist',
  postcss: {
    modules: true
  },
  getUmdMinSize: console.log
}
