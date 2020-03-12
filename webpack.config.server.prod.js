var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TerserJSPlugin = require("terser-webpack-plugin");
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var glob = require('glob');
var autoprefixer = require('autoprefixer');
var PurgecssPlugin = require('purgecss-webpack-plugin');
var mode = process.env.NODE_ENV;
var target = "node";

module.exports = {
	entry: {
		app: [
			'./src/server/index.js',
		]
	},

	output: {
		path: path.resolve(__dirname, './dist/server'),
		filename: "server.bundle.js",
		chunkFilename: '[name].chunk.js',
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
					}
				}
			}
		}, {
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
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
				name: "[hash:10].[ext]"
			}
		}, {
			test: /\.(ttf|eot)(\?[a-z0-9]+)?$/,
			loader: "url-loader",
			options: {
				limit: 11000,
				fallback: 'file-loader',
				name: "[hash:10].[ext]"
			}
		}, {
			test: /\.(jpe?g|gif|png)$/i,
			loader: 'url-loader',
			options: {
				limit: 11000,
				fallback: 'file-loader',
				name: "[hash:10].[ext]"
			}
		}, {
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'url-loader',
			options: {
				limit: 11000,
				fallback: 'file-loader',
				name: "[hash:10].[ext]"
			}
		}]
	},

	target: target,
	mode: mode,
	externals: [nodeExternals()],

	node: {
		__filename: true,
		__dirname: true,
	},

	resolve: {
		extensions: ['.js', '.jsx', ".json"],
		modules: [
			"src/client/",
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
		new MiniCssExtractPlugin({
			filename: "[contenthash:10].css"
		}),
		new PurgecssPlugin({
			paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
		})
	],

	optimization: {
		minimizer: [
			new TerserJSPlugin({
				terserOptions: {
					warnings: false,
					output: {
						comments: /@license/i,
					},
					compress: {
						// Drop console statements
						drop_console: true
					},
				}
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorPluginOptions: {
					preset: ['default', { discardComments: { removeAll: true } }],
				}
			})
		]
	}

}