var path = require('path');
var nodeExternals = require('webpack-node-externals');
var mode = process.env.NODE_ENV;
var target = "node";

module.exports = {
	entry: {
		app: [
			'./src/server/index.js',
		]
	},

	output: {
		path: path.resolve(__dirname, './dist'),
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
			test: /\.woff(2)?(\?[a-z0-9]+)?$/,
			loader: "url-loader",
			options: {
				limit: 10000,
				mimetype: 'application/font-woff',
				fallback: 'file-loader',
				name: "[hash:10].[ext]"
			}
		}, {
			test: /\.(ttf|eot)(\?[a-z0-9]+)?$/,
			loader: "url-loader",
			options: {
				limit: 10000,
				fallback: 'file-loader',
				name: "[hash:10].[ext]"
			}
		}, {
			test: /\.(jpe?g|gif|png)$/i,
			loader: 'url-loader',
			options: {
				limit: 10000,
				fallback: 'file-loader',
				name: "[hash:10].[ext]"
			}
		}, {
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'url-loader',
			options: {
				limit: 10000,
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

}