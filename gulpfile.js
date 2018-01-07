const $ = require('gulp')
const changed = require('gulp-changed')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const plumber = require('gulp-plumber')
const responsive = require('gulp-responsive')

const dest = 'static'

const iconWidths = [
  310, 192, 180, 160, 152, 150, 144, 120, 114, 96, 76, 72, 70, 64, 60, 57, 48, 32, 16
]

$.task('default', ['images'])

$.task('images', ['images:raster', 'images:vector'])

$.task('images:raster', () => $
  .src('media/**/*.{gif,jpeg,jpg,png}')
  .pipe(plumber())
  .pipe(changed(dest))
  .pipe(responsive({
    'icon/*.png': iconWidths
      .map(width => ({ width, rename: { suffix: `-${width}` } }))
      .concat({ width: 512 })
  }, {
    errorOnEnlargement: false,
    errorOnUnusedConfig: false,
    errorOnUnusedImage: false,
    passThroughUnused: true,
    withoutEnlargement: false,
    status: true,
    withMetadata: false
  }))
  .pipe(imagemin([
    imageminPngquant()
  ]))
  .pipe($.dest(dest))
)

$.task('images:vector', () => $
  .src('media/**/*.svg')
  .pipe(plumber())
  .pipe(changed(dest))
  .pipe(imagemin())
  .pipe($.dest(dest))
)
