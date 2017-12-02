require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const backConfig = require('../config/back.prod.config')
const serverConfig = require('../config/server.prod.config')
const frontConfig = require('../config/front.prod.config')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), (err) => {
  if (err) throw err
  webpack(backConfig, (backErr, backStats) => {
    if (backErr) throw backErr
    process.stdout.write(`${backStats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`)

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    webpack(frontConfig, (frontErr, frontStats) => {
      if (frontErr) throw frontErr;
      process.stdout.write(`${frontStats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      })}\n\n`);

      rm('server', (rmServerErr) => {
        if (rmServerErr) throw rmServerErr
        webpack(serverConfig, (serverErr, serverStats) => {
          spinner.stop()
          if (serverErr) throw serverErr
          process.stdout.write(`${serverStats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
          })}\n\n`);

          console.log(chalk.cyan('  Build complete.\n'))
        })
      })
    })
  })
})
