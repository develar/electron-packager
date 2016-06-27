'use strict'

const common = require('./common')
const fs = require('fs-extra-p')
const path = require('path')
const Promise = require('bluebird')
const sanitize = require('sanitize-filename')

module.exports = {
  createApp: (opts, buildDir) => {
    const newExePath = path.join(buildDir, `${sanitize(opts.name)}.exe`)
    return Promise.all([
      common.initializeApp(opts, buildDir, path.join('resources', 'app')),
      fs.rename(path.join(buildDir, 'electron.exe'), newExePath)
    ])
      .then(() => {
        const rcOpts = {'version-string': opts['version-string'] || {}}

        if (opts['build-version']) {
          rcOpts['file-version'] = opts['build-version']
        }

        if (opts['app-version']) {
          rcOpts['product-version'] = opts['app-version']
        }

        if (opts['app-copyright']) {
          rcOpts['version-string'].LegalCopyright = opts['app-copyright']
        }

        if (opts.icon || opts['version-string'] || opts['app-copyright'] || opts['app-version'] || opts['build-version']) {
          return common.normalizeExt(opts.icon, '.ico')
            .then((icon) => {
              // Icon might be omitted or only exist in one OS's format, so skip it if normalizeExt reports an error
              if (icon != null) {
                rcOpts.icon = icon
              }
              return Promise.promisify(require('rcedit'))(newExePath, rcOpts)
            })
        }
      })
  }
}
