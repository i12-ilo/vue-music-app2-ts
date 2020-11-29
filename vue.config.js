const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
// 项目的主要配置文件
module.exports = {
    lintOnSave: false,
    // webpack 配置进行更细粒度的修改  https://cli.vuejs.org/zh/config/#chainwebpack
    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set('components', resolve('src/components'))
            .set('api',resolve('src/api'))
            .set('common', resolve('src/common'))
            .set('assets', resolve('src/assets'))
            .set('base', resolve('src/base'))
            
    },
    configureWebpack: {
        devtool: '#eval-source-map'
    }
    // },
    // devServer:{
    //     host:'10.101.1.227',
    //     port:8080
    // }
}