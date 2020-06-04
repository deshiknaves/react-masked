import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

export default {
  input: 'src/main.ts',
  external: ['react', 'react-dom', 'prop-types'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      presets: ['@babel/preset-react'],
      babelHelpers: 'bundled',
    }),
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
}
