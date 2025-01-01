import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        server: {
            port: 3000,
            proxy: {
                "/certs" :{
                    target : "http://localhost:8080",
                    changeOrigin: true
                },
                "/enums" :{
                    target : "http://localhost:8080",
                    changeOrigin: true
                }
            }
        },
        build: {
            outDir: 'build',
        },
        plugins: [react()],
        test: {
            environment: 'jsdom',
            setupFiles: 'src/setupTests.js'
        },
    };
});
