import babel from 'rollup-plugin-babel';
import { argv } from 'yargs';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import istanbul from 'rollup-plugin-istanbul';

const isDev = argv.w;
const isTest = argv.test;

let file = 'dist/ajax-promised.js';
let sourcemap = isDev;
const plugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**'
  })
]

if (isTest) {
  file = 'tests/ajax-promised-bundled.js'
  sourcemap = 'inline';
  plugins.push(istanbul({
    exclude: ['tests/**/*.js']
  }))
}

export default {
  input: 'src/ajax.js',
  output: {
    file,
    format: 'umd',
    name: 'ajax',
    sourcemap
  },
  plugins
};
