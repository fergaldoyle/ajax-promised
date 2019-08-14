import babel from 'rollup-plugin-babel';
import { argv } from 'yargs';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/ajax.js',
  output: {
    file: 'dist/ajax-promised.js',
    format: 'umd',
    name: 'ajax',
    sourcemap: argv.w,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
