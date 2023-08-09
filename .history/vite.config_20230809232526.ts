
import { defineConfig,ConfigEnv, loadEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from "vite-plugin-style-import"
import postCssPxToRem from "postcss-pxtorem"
import { resolve } from 'path' // 编辑器提示 path 模块找不到，可以yarn add @types/node --dev
import fs from 'fs'
import htmlPlugin from 'vite-plugin-html'

function getPages() {
  const pages = {}
  const pageDir = resolve(__dirname, 'src/pages')

  // 读取 src/pages 目录下的所有文件夹，作为各个页面
  const pageFolders = fs.readdirSync(pageDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const folder of pageFolders) {
    const entry = resolve(pageDir, folder, 'main.ts')
    const template = resolve(__dirname, 'index.html') // 使用共享的 HTML 模板

    if (fs.existsSync(entry)) {
      pages[folder] = {
        entry,
        template,
        filename: `${folder}.html`,
      }
    }
  }

  return pages
}

// 获取 app1 页面的注入配置
function getApp1Tags() {
  return [
    { tag: 'script', attrs: { src: '/app1-script.js' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/app1-style.css' } },
  ]
}

// 获取 app2 页面的注入配置
function getApp2Tags() {
  return [
    { tag: 'script', attrs: { src: '/app2-script.js' } },
    { tag: 'link', attrs: { rel: 'stylesheet', href: '/app2-style.css' } },
  ]
}
console.log('getPages:',getPages())
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): any => {
  const root = process.cwd(),
    env = loadEnv(mode, root),
    port = env.VITE_PORT ? Number(env.VITE_PORT) : 3366;

  return {
    base: "./",
    plugins: [
      vue(),
      htmlPlugin({
        inject: {
          // 这里定义不同页面的注入配置
          include: ['app1', 'app2'], // 需要注入的页面
          exclude: [], // 不需要注入的页面
          tags() {
            // 根据页面名称进行注入
            if (this.html.includes('<!-- APP1 -->')) {
              return getApp1Tags()
            } else if (this.html.includes('<!-- APP2 -->')) {
              return getApp2Tags()
            }

            return []
          },
        },
      }),
      // styleImport({
      //   libs: [
      //     {
      //       libraryName: "vant",
      //       esModule: true,
      //       resolveStyle: (name) => `vant/es/${name}/style`,
      //     },
      //   ],
      // }),
    ],
    build: {
      rollupOptions: {
        input: getPages(),
      },
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue({ file }) {
              return 37.5
              // return file.indexOf('vant') !== -1 ? 37.5 : 108;
            },
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
            selectorBlackList: ['.ig-'], // 忽略的选择器   .ig-  表示 .ig- 开头的都不会转换
          })
        ]
      }
  },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
      }
    },
    server: {
      port: 3000, // 设置服务启动端口号
      open: true, // 设置服务启动时是否自动打开浏览器
      // 代理
      proxy: {
        '/api': {
          target: 'http://API网关所在域名',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      }
    }
  }
})
