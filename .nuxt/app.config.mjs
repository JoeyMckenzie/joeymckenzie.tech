
import { updateAppConfig } from '#app'
import { defuFn } from '/Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/defu/dist/defu.mjs'

const inlineConfig = {
  "nuxt": {
    "buildId": "f4d8f183-2d30-4ae4-bffd-6c9f9cca4f37"
  }
}

// Vite - webpack is handled directly in #app/config
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    updateAppConfig(newModule.default)
  })
}



export default /* #__PURE__ */ defuFn(inlineConfig)
