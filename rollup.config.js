import typescript from 'rollup-plugin-typescript'

export default {
  entry: 'src/main.ts',
  dest: 'bundle.js',
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ],
  format: 'iife',
  exports: 'none',
  sourceMap: 'inline'
}
