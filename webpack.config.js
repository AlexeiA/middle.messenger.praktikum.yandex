const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.bundle.js',
		assetModuleFilename: "static/[name][ext]"
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
		alias: {'handlebars' : 'handlebars/dist/handlebars.js'}
	},
	plugins: [new HtmlWebpackPlugin({
		template: "./src/index.html",
		favicon: "./src/static/favicon.png"
	})],
	devServer: {
		compress: false,
		port: 1234,
		hot: true,
		historyApiFallback: true
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /(node_modules)/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: path.resolve(__dirname, 'tsconfig.json'),
						},
					},
				]
			},
			{
				test: /\.p?css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource',
			},
		]
	}
};
