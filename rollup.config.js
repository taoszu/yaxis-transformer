import commonjs from 'rollup-plugin-commonjs'

const config = {
    input: 'dist/index.js',
    output: {
        format: 'umd',
        globals: {
            yaxisTransformer: 'yaxisTransformer'
        },
        name: 'yaxisTransformer'
    },
    plugins: [commonjs()]
}

export default config