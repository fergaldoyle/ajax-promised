import babel from 'rollup-plugin-babel';
import { argv } from 'yargs';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/ajax.js',
  dest: 'dist/ajax-promised.js',
  format: 'umd',
  moduleName: 'ajax',
  sourceMap: argv.w,
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    })
  ]
};
