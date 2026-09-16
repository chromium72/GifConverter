// --- PWAダミーService Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swCode = `
            self.addEventListener('install', (e) => self.skipWaiting());
            self.addEventListener('activate', (e) => self.clients.claim());
            self.addEventListener('fetch', (e) => {});
        `;
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl).then(() => {
            console.log('PWA Ready');
        }).catch(err => console.log('SW Error:', err));
    });
}
