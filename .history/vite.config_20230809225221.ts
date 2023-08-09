/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2023-08-09 21:57:57
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2023-08-09 22:50:48
 * @FilePath: \vite-mult-vue\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig,ConfigEnv, loadEnv, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from "vite-plugin-style-import"
import { resolve } from 'path' // 编辑器提示 path 模块找不到，可以yarn add @types/node --dev

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
