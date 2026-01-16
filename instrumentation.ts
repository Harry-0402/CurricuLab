export function register() {
    // Only run in Node.js runtime (server-side)
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const TARGET_URL = 'https://curriculab-tyi9.onrender.com/';
        const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

        // Use a global variable to prevent multiple intervals during hot-reloads in development
        if (!(global as any).__KEEP_ALIVE_ACTIVE__) {
            (global as any).__KEEP_ALIVE_ACTIVE__ = true;

            console.log(`[KeepAlive] System initialized. Target: ${TARGET_URL}`);

            // Initial ping after a short delay to allow server startup
            setTimeout(() => {
                pingServer(TARGET_URL);

                // Start periodic pings
                setInterval(() => {
                    pingServer(TARGET_URL);
                }, PING_INTERVAL);
            }, 5000);
        }
    }
}

async function pingServer(url: string) {
    try {
        console.log(`[KeepAlive] Pinging ${url}...`);
        const res = await fetch(url);
        if (res.ok) {
            console.log(`[KeepAlive] Success! Status: ${res.status}`);
        } else {
            console.warn(`[KeepAlive] Failed. Status: ${res.status}`);
        }
    } catch (error) {
        console.error(`[KeepAlive] Network Error:`, error);
    }
}
