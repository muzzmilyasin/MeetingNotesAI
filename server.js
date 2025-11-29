const HF_API_TOKEN = process.env.HF_API_TOKEN || '';

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Check API key endpoint
    if (req.url === '/api/check-key' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ hasKey: !!HF_API_TOKEN }));
        return;
    }

    // Save API key endpoint
    if (req.url === '/api/save-key' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { apiKey } = JSON.parse(body);
                HF_API_TOKEN = apiKey;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }

    // API proxy endpoint
    if (req.url === '/api/summarize' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                if (!HF_API_TOKEN) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'API key not configured' }));
                    return;
                }

                const { text } = JSON.parse(body);
                
                const response = await fetch('https://router.huggingface.co/models/sshleifer/distilbart-cnn-12-6', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${HF_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: text.substring(0, 1000),
                        parameters: {
                            max_length: 130,
                            min_length: 30,
                            do_sample: false
                        },
                        options: { wait_for_model: true }
                    })
                });

                const result = await response.json();
                res.writeHead(response.ok ? 200 : response.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
};
