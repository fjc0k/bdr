#!/usr/bin/env node
const cac = require('cac')

const cli = cac()

cli
  .command('*', {
    alias: 'build',
    desc: 'Bundle all assets'
  }, (input, { config }) => {
    config = config || input[0] || 'bdr'
    require('./bundle')({ config })
  })
  .option('config', {
    desc: 'Config name',
    default: ''
  })

cli
  .command('transform', 'Transform javascript files', (_, { src, to }) => {
    require('./babel')(src, to)
  })
  .option('src', {
    desc: 'Source path',
    default: 'src/**/*.js'
  })
  .option('to', {
    desc: 'Target path',
    default: 'lib'
  })

cli
  .command('dev', 'Dev mode', ([entry], flags) => {
    require('./poi')('develop', {
      ...flags,
      entry,
      hotReload: true
    })
  })

cli.parse()
