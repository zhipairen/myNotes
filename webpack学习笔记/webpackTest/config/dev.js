// 默认开发环境配置
/*config.devServer.proxy用来配置后端api的反向代理,
 ajax /api/auth/!*的请求会被转发到http://api.example.dev/auth/!*,
 /api/pay/!*的请求会被转发到http://api.example.dev/pay/!*.
 changeOrigin会修改HTTP请求头中的Host为target的域名, 这里会被改为api.example.dev
 pathRewrite用来改写URL, 这里我们把/api前缀去掉.*/
module.exports = {
  publicPath: '/assets/',
  devServer: {
    port: 8100,
    proxy: {
      '/api/auth': {
        target:'http://api.example.dev',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/api/pay/': {
        target: 'http://pay.example.dev',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
};