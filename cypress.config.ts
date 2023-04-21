import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
      baseUrl: 'https://127.0.0.1:10888',
      setupNodeEvents(on, config) {
        // implement node event listeners here
      },
    },
    env: {
       "API_BASE_URL": 'vkfiles.usetech.com'
    }
});
