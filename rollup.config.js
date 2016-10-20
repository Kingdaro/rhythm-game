import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/main.js',
  dest: 'bundle.js',
  plugins: [ babel() ],
  format: 'iife',
  exports: 'none',
  sourceMap: 'inline'
}
