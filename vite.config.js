import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import postcssPrefixSelector from 'postcss-prefix-selector';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        copyPublicDir: false,
        lib: {
            entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
            name: 'IntonationChecker',
            fileName: 'intonation-checker',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [
                postcssPrefixSelector({
                    prefix: '.intonation-checker',
                    transform: function (prefix, selector, prefixedSelector, filepath) {
                        return prefixedSelector;
                    },
                }),
            ],
        },
    },
});
