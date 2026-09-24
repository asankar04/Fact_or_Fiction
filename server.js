import dotenv from 'dotenv';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import OpenAI from 'openai';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: '.env.local', quiet: true });

const app = express();
const client = process.env.OPENAI_API_KEY ? new OpenAI() : null;
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');

app.disable('x-powered-by');

app.get('/api/prompt', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }), async (_request, response) => {
  response.set('Cache-Control', 'no-store');

  if (!client) {
    return response.status(503).json({ error: 'Question service is not configured.' });
  }

  try {
    const result = await client.responses.create({
      model: 'gpt-4o-mini',
      input: 'Write one short, family-friendly trivia statement for a Fact or Fiction game. Choose a clear, checkable claim and vary the topic. Label the statement fact or fiction.',
      text: {
        format: {
          type: 'json_schema',
          name: 'question',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              statement: { type: 'string' },
              type: { type: 'string', enum: ['fact', 'fiction'] },
            },
            required: ['statement', 'type'],
            additionalProperties: false,
          },
        },
      },
      max_output_tokens: 180,
      store: false,
    });

    const question = JSON.parse(result.output_text);
    if (!question.statement?.trim() || !['fact', 'fiction'].includes(question.type)) {
      throw new Error('Invalid question');
    }

    return response.json({ statement: question.statement.trim(), type: question.type });
  } catch {
    return response.status(502).json({ error: 'Could not generate a question.' });
  }
});

app.use(express.static(dist));
app.listen(process.env.PORT || 3001);
