// @ts-check
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import path from 'path'
import vercel from '@astrojs/vercel';
import './src/components/NotifcationSystem/cron';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
    base: '/',
    vite: {
      define: {
        'import.meta.env.COLOR_WHITE': JSON.stringify('white'),
        'import.meta.env.LIGHT_PURPLE': JSON.stringify('#8c57ff'),
        'import.meta.env.LIGHT_BLUE': JSON.stringify('#16b1ff'),
        'import.meta.env.LIGHT_ORANGE': JSON.stringify('#ffb400'),
        'import.meta.env.LIGHT_RED': JSON.stringify('#ff4c51'),
        'import.meta.env.LIGHT_GREEN': JSON.stringify('#56ca00'),
        'import.meta.env.GLSAPIKEY': JSON.stringify(process.env.GLSAPIKEY),
        'import.meta.env.OPENCAGEAPIKEY': JSON.stringify(process.env.OPENCAGEAPIKEY),
        'import.meta.env.CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME),
        'import.meta.env.PUBLICKEY': JSON.stringify(process.env.PUBLICKEY),
        'import.meta.env.COMPANYNAME': JSON.stringify(process.env.COMPANYNAME),
        'import.meta.env.STORENAME': JSON.stringify(process.env.STORENAME),
        'import.meta.env.STOREADDRESS': JSON.stringify(process.env.STOREADDRESS),
        'import.meta.env.STORECVR': JSON.stringify(process.env.STORECVR),
        'import.meta.env.STOREEMAIL': JSON.stringify(process.env.STOREEMAIL),
        'import.meta.env.STOREPHONE': JSON.stringify(process.env.STOREPHONE),
        'import.meta.env.FACEBOOK': JSON.stringify(process.env.FACEBOOK),
        'import.meta.env.X_TWITTER': JSON.stringify(process.env.X_TWITTER),
        'import.meta.env.INSTAGRAM': JSON.stringify(process.env.INSTAGRAM),
        'import.meta.env.LINKEDIN': JSON.stringify(process.env.LINKEDIN)
      },
      resolve: {
        alias: {
          lodash: path.resolve('./node_modules/lodash'),
        },
      },
    },
    server: {
      host: true, // Bind to 0.0.0.0
      port: Number(process.env.PORT) || 3000, // Use Render's dynamic PORT environment variable or default to 3000
    },
    output: 'server',
    adapter: vercel(),
});
