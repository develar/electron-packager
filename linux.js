'use strict'

const common = require('./common')
const fs = require('fs-extra-p')
const path = require('path')
const Promise = require('bluebird')

module.exports = {
  createApp: (opts, buildDir) => Promise.all([
    common.initializeApp(opts, buildDir, path.join('resources', 'app')),
    fs.rename(path.join(buildDir, 'electron'), path.join(buildDir, opts.name))
  ])
}
