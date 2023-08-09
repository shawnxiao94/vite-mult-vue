/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2023-08-09 21:57:57
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2023-08-09 22:55:36
 * @FilePath: \vite-mult-vue\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig,ConfigEnv, loadEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from "vite-plugin-style-import"
import postCssPxToRem from "postcss-pxtorem"
import { resolve } from 'path' // 编辑器提示 path 模块找不到，可以yarn add @types/node --dev

function getPages() {
  const pages = {}
  const pageDir = resolve(__dirname, 'src/pages')

  // 读取 src/pages 目录下的所有文件夹，作为各个页面
  const pageFolders = fs.readdirSync(pageDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const folder of pageFolders) {
    const entry = resolve(pageDir, folder, 'main.ts')
    const template = resolve(__dirname, `a.html`) // 使用共享的 HTML 模板

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

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): UserConfigExport => {
  const root = process.cwd(),
    env = loadEnv(mode, root),
    port = env.VITE_PORT ? Number(env.VITE_PORT) : 3366;

  return {
    base: "./",
    plugins: [
      vue(),
      styleImport({
        libs: [
          {
            libraryName: "vant",
            esModule: true,
            resolveStyle: (name) => `vant/es/${name}/style`,
          },
        ],
      }),
    ],
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
