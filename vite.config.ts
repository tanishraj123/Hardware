import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          info: path.resolve(__dirname, 'info.html'),
          signin: path.resolve(__dirname, 'signin.html'),
          register: path.resolve(__dirname, 'register-user.html'),
          profile: path.resolve(__dirname, 'profile.html'),
          location: path.resolve(__dirname, 'location.html'),
          register_company: path.resolve(__dirname, 'register-company.html'),
          my_partners: path.resolve(__dirname, 'my-partners.html'),
          supplier_standards: path.resolve(__dirname, 'supplier-standards.html'),
          terms_of_service: path.resolve(__dirname, 'terms-of-service.html'),
          privacy_policy: path.resolve(__dirname, 'privacy-policy.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
