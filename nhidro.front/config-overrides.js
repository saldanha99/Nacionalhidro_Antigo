const SassRuleRewire = require('react-app-rewire-sass-rule')
const path = require('path')
const rewireAliases = require('react-app-rewire-aliases')
const  UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function override(config, env) {
  require('react-app-rewire-postcss')(config, {
    plugins: loader => [require('postcss-rtl')()]
  })

  config = rewireAliases.aliasesOptions({
    '@src': path.resolve(__dirname, 'src'),
    '@assets': path.resolve(__dirname, 'src/@core/assets'),
    '@components': path.resolve(__dirname, 'src/@core/components'),
    '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
    '@store': path.resolve(__dirname, 'src/redux'),
    '@styles': path.resolve(__dirname, 'src/@core/scss'),
    '@configs': path.resolve(__dirname, 'src/configs'),
    '@utils': path.resolve(__dirname, 'src/utility/Utils'),
    '@hooks': path.resolve(__dirname, 'src/utility/hooks')
  })(config, env)

  config = new SassRuleRewire()
    .withRuleOptions({
      test: /\.s[ac]ss$/i,
      use: [
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: ['node_modules', 'src/assets']
            }
          }
        }
      ]
    })
    .rewire(config, env)

    if (process.env.NODE_ENV === "production") {
        config.optimization.minimizer = [
          new UglifyJsPlugin(
            {
              // Enable packaging cache
              cache: true,
              // Start multi thread packaging
              parallel: true,
              uglifyOptions: {
                // Remove warning
                warnings: false,
                // compress
                compress: {
                  // Remove console
                  drop_console: true,
                  // debugger removal
                  drop_debugger: true
                }
              }
            }
          )
        ];
    }
  return config
}
