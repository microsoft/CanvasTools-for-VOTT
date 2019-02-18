const path = require('path');
const webpack = require('webpack');
const yargs = require('yargs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

var libraryName = "CanvasTools";
var libraryEntry = "./src/canvastools/ts/ct.ts"
var libraryFileName = "ct";

var webpackSettings = {
    'prod': {
        minimize: false,
        mode: 'production',
        path: path.resolve(__dirname, './dist'),
        filename: `${libraryFileName}.js`,
        devtool: "source-map",
        tsconfig: "tsconfig.json"
    },
    'prod-min': {
        minimize: true,
        mode: 'production',
        path: path.resolve(__dirname, './dist'),
        filename: `${libraryFileName}.min.js`,
        devtool: "source-map",
        tsconfig: "tsconfig.json"
    },
    'dev': {
        minimize: false,
        mode: 'development',
        path: path.resolve(__dirname, './dist'),
        filename: `${libraryFileName}.dev.js`,
        devtool: "inline-source-map",
        tsconfig: "tsconfig.test.json"
    },
    'test': {
        minimize: false,
        mode: 'development',
        path: path.resolve(__dirname, './samples/shared/js'),
        filename: `${libraryFileName}.js`,
        devtool: "inline-source-map",
        tsconfig: "tsconfig.test.json"
    },
}

var settings = webpackSettings[yargs.argv.set];
if (settings == undefined) {
    settings = webpackSettings['dev'];
}

module.exports = function (env) {
    var settings = webpackSettings[env.mode];
    if (settings == undefined) {
        settings = webpackSettings['dev'];
    }

    var config = {
        entry: libraryEntry,
        output: {
            filename: settings.filename,
            path: settings.path,
            libraryTarget: 'umd',
            library: '',
            umdNamedDefine: true
        },

        mode: settings.mode,
        devtool: settings.devtool,
        optimization: {
            minimize: settings.minimize
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: settings.tsconfig
                            }
                        }
                    ],
                    exclude: /node_modules/                    
                },
                /* {
                    test: require.resolve('snapsvg'),
                    loader: 'imports-loader?this=>window,fix=>module.exports=0'
                }, */
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
            plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })]
        }
    };
    return config;
};