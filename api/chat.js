export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `You are a helpful recycling assistant. Answer questions about what can be recycled, how to recycle items, and general recycling practices. Keep answers clear and concise.\n\nUser question: ${question}` 
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      res.status(200).json({ 
        answer: data.candidates[0].content.parts[0].text 
      });
    } else if (data.error) {
      res.status(500).json({ error: data.error.message });
    } else {
      res.status(500).json({ error: 'No response generated' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
