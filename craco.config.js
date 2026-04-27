const path = require('path')
const postcssRtl = require('postcss-rtl')

const addRtlToPostcssLoaders = webpackConfig => {
  const oneOfRule = webpackConfig.module.rules.find(rule => Array.isArray(rule.oneOf))

  if (!oneOfRule) return webpackConfig

  oneOfRule.oneOf.forEach(rule => {
    if (!Array.isArray(rule.use)) return

    rule.use.forEach(loader => {
      if (!loader?.loader?.includes('postcss-loader')) return

      const plugins = loader.options?.postcssOptions?.plugins

      if (!Array.isArray(plugins)) return

      const hasRtlPlugin = plugins.some(plugin => {
        if (Array.isArray(plugin)) return plugin[0] === 'postcss-rtl'
        return plugin?.postcssPlugin === 'postcss-rtl'
      })

      if (!hasRtlPlugin) {
        plugins.push(postcssRtl())
      }
    })
  })

  return webpackConfig
}

module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    }
  },
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks')
    },
    configure: addRtlToPostcssLoaders
  }
}
