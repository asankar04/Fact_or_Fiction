# Fact or Fiction

A React quiz with a small Node server that keeps the OpenAI API key out of the browser.

## Run locally

Use Node.js 22.12 or newer. After rotating the old key, put the replacement in an ignored `.env.local` file:

```text
OPENAI_API_KEY=your_new_key
```

Run `npm install` and `npm run dev`. Open the local URL printed by Vite. Remove the old `REACT_APP_API_KEY` from local and hosting settings after rotation.

## Deploy

Run `npm run build`, then `npm start`. Set `OPENAI_API_KEY` in the server's environment. The app needs a Node host because `/api/prompt` runs on the server.
