import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/portfolyo/', // Set base for GitHub Pages deployment
    resolve: {
        extensions: ['.js', '.jsx']
    }
})