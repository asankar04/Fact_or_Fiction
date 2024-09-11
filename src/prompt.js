import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

export const getFactOrFiction = async () => {
    const prompt = `
        Generate a statement and specify if it is a fact or fiction, and try your best to not be repetitive. 
        Respond in the following JSON format:
        {
          "statement": "<Generated statement here>",
          "type": "<fact or fiction>"
        }
    `;

    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
    };

    const GPTdata = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
        temperature: 1.5
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', GPTdata, {headers});
        const output = response.data.choices[0].message.content;
        const jsonResponse = JSON.parse(output);
        return jsonResponse;
    } catch (error) {
        console.error('Error generating prompt:', error);
        return null;
    }
};
