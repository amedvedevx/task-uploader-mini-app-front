import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ssl from '@vitejs/plugin-basic-ssl';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    base: './',
    build: {
        target: 'esnext',
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        sourcemap: false,
        rollupOptions: {
            inlineDynamicImports: true,
        },
    },
    plugins: [react(), tsconfigPaths(), ssl(), viteSingleFile()],
    server: {
        port: 10888,
    },
});
