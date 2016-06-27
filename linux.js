'use strict'

const common = require('./common')
const fs = require('fs-extra-p')
const path = require('path')
const Promise = require('bluebird')
const sanitize = require('sanitize-filename')

module.exports = {
  createApp: (opts, buildDir) => Promise.all([
    common.initializeApp(opts, buildDir, path.join('resources', 'app')),
    fs.rename(path.join(buildDir, 'electron'), path.join(buildDir, sanitize(opts.name)))
  ])
}
