require('dotenv').config();
require('./package.json');

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env;
const ESLintPlugin = require('eslint-webpack-plugin');
const pkg = require('./package.json');

const libName = 'js_test';

let outputFile;
let mode;

if (env === 'build') {
    mode = 'production';
    outputFile = `${libName}.min.js`;
} else {
    mode = 'development';
    outputFile = `${libName}.js`;
}
const config = {
    mode: mode,
    entry: __dirname + '/js_exec_test.js',
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    target: 'node',
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.ts', '.tsx', '.js'],
    },
};
module.exports = config;
