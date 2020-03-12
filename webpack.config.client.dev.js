var path = require('path');
var webpack = require('webpack');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var autoprefixer = require('autoprefixer');
var LoadablePlugin = require('@loadable/webpack-plugin');
var mode = process.env.NODE_ENV;
var target = "web";

module.exports = {

	devtool: 'cheap-module-eval-source-map',

	entry: {
		app: [
			'webpack-hot-middleware/client',
			'./src/client/index.js',
		]
	},
	output: {
		path: path.resolve(__dirname, './dist/client'),
		filename: "client.bundle.js",
		chunkFilename: '[name].chunk.js',
		libraryTarget: 'umd',
		publicPath: "/public/",
	},
	module: {
		rules: [{
			test: /\.jsx*$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					caller: {
						target
					},
					plugins: ["react-hot-loader/babel"]
				}
			}
		}, {
			test: /\.css$/,
			use: [
				"style-loader",
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1
					}
				},
				{
					loader: 'postcss-loader',
					options: {
						plugins: () => [autoprefixer()],
					}
				},
			],
		}, {
			test: /\.woff(2)?(\?[a-z0-9]+)?$/,
			loader: "url-loader",
			options: {
				limit: 11000,
				mimetype: 'application/font-woff',
				fallback: 'file-loader',
				name: "[name].[ext]"
			}
		}, {
			test: /\.(ttf|eot)(\?[a-z0-9]+)?$/,
			loader: "url-loader",
			options: {
				limit: 11000,
				fallback: 'file-loader',
				name: "[name].[ext]"
			}
		}, {
			test: /\.(jpe?g|gif|png)$/i,
			loader: 'url-loader',
			options: {
				limit: 11000,
				fallback: 'file-loader',
				name: "[name].[ext]"
			}
		}, {
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'url-loader',
			options: {
				limit: 11000,
				fallback: 'file-loader',
				name: "[name].[ext]"
			}
		}]
	},

	target: target,
	mode: mode,

	resolve: {
		extensions: ['.js', '.jsx', ".json"],
		modules: [
			'node_modules',
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				'APP_ENV': JSON.stringify(process.env.APP_ENV)
			}
		}),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new LoadablePlugin({
			filename: 'loadable-stats.json',
			writeToDisk: true
		}),
		new MiniCssExtractPlugin({
			filename: 'app.css'
		})
	],

	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					chunks: "initial",
				}
			}
		}
	}
}