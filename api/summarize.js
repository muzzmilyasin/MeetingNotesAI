const HF_API_TOKEN = process.env.HF_API_TOKEN || '';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!HF_API_TOKEN) {
            return res.status(401).json({ error: 'API key not configured' });
        }

        const { text } = req.body;
        
        const response = await fetch('https://router.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: text.substring(0, 1000)
            })
        });

        const result = await response.json();
        return res.status(response.ok ? 200 : response.status).json(result);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
