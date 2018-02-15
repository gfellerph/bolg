'use strict'
const utils = require('./utils')
const isProduction = process.env.NODE_ENV === 'production'
console.log(isProduction, process.env.NODE_ENV)
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: true ? '#source-map' : 'cheap-module-eval-source-map',
    extract: true
  }),
  cssSourceMap: true,
  cacheBusting: true,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
