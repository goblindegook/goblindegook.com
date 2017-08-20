const $ = require('gulp')
const changed = require('gulp-changed')
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const plumber = require('gulp-plumber')
const responsive = require('gulp-responsive')

const dest = 'static'

const iconWidths = [
  310, 192, 180, 160, 152, 150, 144, 120, 114, 96, 76, 72, 70, 64, 60, 57, 32, 16
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
      .concat({ width: 512 }),
    'images/*': [
      { width: '50%' },
      { width: '100%', rename: { suffix: '@2x' } },
      { width: 768, rename: { suffix: '-768w' } },
      { width: 1536, rename: { suffix: '-1536w@2x' } }
    ],
    'images/featured/*': [
      { width: '50%' },
      { width: '100%', rename: { suffix: '@2x' } },
      { width: 768, rename: { suffix: '-768w' } },
      { width: 1536, rename: { suffix: '-768w@2x' } },
      { width: 340, height: 160, rename: { suffix: '-340w' } },
      { width: 680, height: 320, rename: { suffix: '-340w@2x' } }
    ]
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
    imagemin.gifsicle({ interlaced: true }),
    imagemin.jpegtran({ progressive: true }),
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
