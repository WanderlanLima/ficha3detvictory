import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    base: './',
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: '3D&T Victory Builder',
                short_name: 'VictoryCards',
                description: 'Crie e compartilhe fichas de 3D&T Victory em formato de cards',
                theme_color: '#1a1a1a',
                background_color: '#1a1a1a',
                display: 'standalone',
                icons: [
                    {
                        src: 'favicon.ico',
                        sizes: '64x64 32x32 24x24 16x16',
                        type: 'image/x-icon'
                    }
                ]
            }
        })
    ]
})
