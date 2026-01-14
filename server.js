const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Keep-Alive Configuration
const KEEP_ALIVE_URL = 'https://curriculab-tyi9.onrender.com/';
const KEEP_ALIVE_INTERVAL = 600000; // 10 minutes

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Server running on http://localhost:${port}`);

        // Implement the Keep-Alive Script
        // We strictly follow the logic requested to prevent Render cold starts
        console.log(`> Keep-Alive system initialized for: ${KEEP_ALIVE_URL}`);

        const reloadWebsite = () => {
            fetch(KEEP_ALIVE_URL)
                .then(response => {
                    console.log(`Website reloaded to prevent cold start: ${response.status}`);
                })
                .catch(error => {
                    console.error(`Keep-alive Error: ${error.message}`);
                });
        };

        // Initial ping (optional, but good for verification)
        // reloadWebsite();

        // Set interval loop
        setInterval(reloadWebsite, KEEP_ALIVE_INTERVAL);
    });
});
