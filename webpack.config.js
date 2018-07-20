const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    mode: "development",
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            "es2015",
                            "react"
                        ]
                    }
                }
            }, {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }, {
                test: /\.(ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    outputPath: 'images/'
                }
            }
        ]
    },
    resolve:{
        extensions:[
            '.js',
            '.jsx'
        ]
    },
    plugins:[
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            title:'title',
            template:'index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
            algorithm: 'gzip',//算法
            test: new RegExp(
                '\\.(js|css)$'  //压缩 js 与 css
            ),
            threshold: 10240,//只处理比这个值大的资源。按字节计算
            minRatio: 0.8//只有压缩率比这个值小的资源才会被处理
        })
    ],
    optimization:{
        runtimeChunk:{
            name:"mainfest"
        },
        splitChunks:{
            cacheGroups:{
                common: {
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                //第三方组件
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    }
};