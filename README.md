# JARVIS Anime AI — Cloudflare Ready

This project is a JARVIS-style AI assistant with selectable original anime-inspired personas.

## Important
The personas are original anime-inspired styles. They are not copies of specific copyrighted anime characters.

## Deploy with Cloudflare Workers
Cloudflare Workers Static Assets can deploy the Worker and the `public/` website together.

1. Put this project in a GitHub repository, or deploy it with Wrangler.
2. Create/deploy the Worker using `wrangler.toml`.
3. In Cloudflare Worker → Settings → Variables and Secrets, add an encrypted Secret:
   `OPENAI_API_KEY`
4. Deploy again.
5. Open the generated `*.workers.dev` URL.

Do NOT put your OpenAI API key in `public/script.js`, `index.html`, or any public file.

## Local/CLI
Install Wrangler and run:
`npx wrangler deploy`

The frontend sends messages to `/api/chat`; the Worker calls the OpenAI Responses API.

## Persona system
The selector contains:
- JARVIS — futuristic assistant
- Pirate Captain — energetic shonen pirate style
- Ninja Shinobi — calm tactical ninja style
- Hero Academy — optimistic superhero-anime style
- Swordsman — disciplined swordsman style
- Mage — clever fantasy mage style

You can add more original personas by adding buttons in `public/index.html`.
