import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 900,
  e2e: {
    baseUrl: 'http://localhost:3000/algososh',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
