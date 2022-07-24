const path = require("path")
const htmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    target: "web",
    // mode: 'production',
    entry: {
        filename: path.resolve(__dirname, "./src/index.js"),
    },
    output: {
        path: path.resolve(__dirname, "./public/"),
        filename: 'index.js',
        // assetModuleFilename: './[name][ext]',
        // clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "./public/")
        },
        port: 9000,
        compress: true,
        // inline: true,
        hot: true,
        liveReload: true,
        watchFiles: ["./public/*", "./static/*", "./src/*"],
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            exclude:path.resolve(__dirname, "node_modules")
        }]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: "3D Constructor",
            filename: "test.html",
        }),

        new CopyWebpackPlugin({
            patterns: [
                { from: "static", to: "./" },
            ]
        })
    ],
}
