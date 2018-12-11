const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: './src/canvastools/ts/CanvasTools.ts',
    output: {
        filename: 'ct.min.js',
        path: path.resolve(__dirname, './lib/js'),
        libraryTarget: 'umd',
        library: 'CanvasTools',
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: require.resolve('snapsvg'),
                loader: 'imports-loader?this=>window,fix=>module.exports=0'
            },
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