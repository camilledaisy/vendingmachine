# The Emotional Vending Machine

> "Some things you need aren't sold in stores."

React + TypeScript + Tailwind + Motion. No backend, no accounts; the shelf lives in `localStorage`.

```
npm install
npm run dev     # local
npm run build   # outputs dist/ (Netlify: build command + publish dir are in netlify.toml)
```

**Adding objects:** append to `ITEMS` in `src/data/items.ts` (unique `id` and `inv`), then add a drawing under the same id in `src/art/art.ts`. Machine chatter and the maintenance log are in `src/data/text.ts`.

**Secrets:** a wrench on the machine's side, a small hatch on the panel, a sleeping cat, and the occasional fake error. Add `?party` for the birthday hat (the real one is Oct 12) or `?glitch` to force the error.
