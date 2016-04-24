'use strict'

const common = require('./common')
const fs = require('fs-extra-p')
const path = require('path')
const Promise = require('bluebird')

module.exports = {
  createApp: function createApp (opts, templatePath, callback) {
    common.initializeApp(opts, templatePath, path.join('resources', 'app'), function buildWinApp (err, tempPath) {
      if (err) return callback(err)

      const newExePath = path.join(tempPath, `${common.sanitizeExecutableFilename(opts.name)}.exe`)
      fs.move(path.join(tempPath, 'electron.exe'), newExePath)
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
        .then(() => common.moveApp(opts, tempPath, callback))
        .catch((e) => callback(e))
    })
  }
}
