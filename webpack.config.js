const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  watchOptions: {
    ignored: '**/node_modules',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'templates', 'index.html'),
    }),
  ],
  resolve: {
    extensions: ['.*', '.js', '.jsx', '.tsx', '.ts'],
    alias: {
      Templates: path.resolve(__dirname, 'templates'),
      Styles: path.resolve(__dirname, 'styles'),
      App: path.resolve(__dirname, 'src'),
      Lib: path.resolve(__dirname, 'lib'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
}
