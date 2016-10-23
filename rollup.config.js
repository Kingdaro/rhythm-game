import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/main.js',
  dest: 'bundle.js',
  plugins: [
    buble({
      transforms: {
        dangerousForOf: true
      },
      objectAssign: 'Object.assign'
    })
  ],
  format: 'iife',
  exports: 'none',
  sourceMap: 'inline'
}
