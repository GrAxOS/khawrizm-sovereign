const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const MAX_BODY_BYTES = process.env.MAX_BODY_BYTES || '1mb';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://ollama:11434/api/generate';
const DEFAULT_MODEL = process.env.AI_MODEL || 'llama3.1:8b';

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('Invalid PORT configuration');
}

let ollamaUrl;
try {
  ollamaUrl = new URL(OLLAMA_URL);
  if (ollamaUrl.protocol !== 'http:' && ollamaUrl.protocol !== 'https:') {
    throw new Error('OLLAMA_URL must use HTTP or HTTPS');
  }
} catch {
  throw new Error('Invalid OLLAMA_URL configuration');
}

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: false }));
app.use(morgan('combined'));
app.use(express.json({ limit: MAX_BODY_BYTES, strict: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/api', (_req, res) => {
  res.status(200).json({
    name: 'Khawrizm Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      info: '/api',
      generate: '/api/ai/generate',
    },
  });
});

app.post('/api/ai/generate', async (req, res, next) => {
  try {
    const { prompt, model = DEFAULT_MODEL, temperature, stream = false } = req.body || {};

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'prompt must be a non-empty string' });
    }
    if (prompt.length > 100_000) {
      return res.status(413).json({ error: 'prompt exceeds maximum length' });
    }
    if (typeof model !== 'string' || model.trim().length === 0 || model.length > 256) {
      return res.status(400).json({ error: 'model must be a non-empty string' });
    }
    if (stream !== false) {
      return res.status(400).json({ error: 'streaming is not supported by this endpoint' });
    }

    const payload = {
      model: model.trim(),
      prompt,
      stream: false,
    };

    if (temperature !== undefined) {
      const parsedTemperature = Number(temperature);
      if (!Number.isFinite(parsedTemperature) || parsedTemperature < 0 || parsedTemperature > 2) {
        return res.status(400).json({ error: 'temperature must be between 0 and 2' });
      }
      payload.options = { temperature: parsedTemperature };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    let response;
    try {
      response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const text = await response.text();
    if (!response.ok) {
      return res.status(502).json({ error: 'AI provider request failed' });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'AI provider returned malformed JSON' });
    }

    if (typeof data.response !== 'string' || data.response.length === 0) {
      return res.status(502).json({ error: 'AI provider returned an empty response' });
    }

    return res.status(200).json({
      model: data.model || model.trim(),
      response: data.response,
      done: data.done === true,
      createdAt: data.created_at || null,
    });
  } catch (error) {
    if (error && error.name === 'AbortError') {
      return res.status(504).json({ error: 'AI provider request timed out' });
    }
    return next(error);
  }
});

app.get('/api/config', (_req, res) => {
  res.status(200).json({
    ai_engine: 'Ollama',
    model: DEFAULT_MODEL,
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, _req, res, _next) => {
  const status = err && err.type === 'entity.too.large' ? 413 : 500;
  if (status === 413) {
    return res.status(413).json({ error: 'Request body too large' });
  }
  console.error(err instanceof Error ? err.message : 'Internal server error');
  return res.status(500).json({ error: 'Internal Server Error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on port ${PORT}`);
});

const shutdown = (signal) => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
  console.log(`Received ${signal}; shutting down`);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = { app, server };