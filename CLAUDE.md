# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Responsible** is an educational React application demonstrating OpenAI's Response API through interactive examples. It's built as a Cloudflare Worker with a React frontend, showcasing three distinct API interaction patterns.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare Worker type definitions

## Architecture

### Cloudflare Worker Backend (`worker/index.ts`)
The backend is built with Hono framework and provides three OpenAI Response API endpoints:

1. **`/api/examples/create`** - Basic text generation with full response
2. **`/api/examples/create/streaming`** - Real-time streaming text generation using `streamText`
3. **`/api/examples/create/stored`** - Interactive word game using `previous_response_id` for conversation continuity

All endpoints use OpenAI's Response API with `gpt-4.1` model and require `OPENAI_API_KEY` environment variable.

### React Frontend (`src/App.tsx`)
Single-file React app with three main components demonstrating different interaction patterns:

- **BasicExample** - Standard form submission with JSON response viewer
- **StreamingExample** - Real-time token-by-token display using ReadableStream
- **WordGameExample** - Turn-based word game with sentence building and response ID tracking

### UI Architecture
- **Tailwind CSS** for styling with custom gradient themes per example
- **Full viewport layout** with responsive grid (side-by-side on xl+ screens)
- **Collapsible JSON viewers** using `react-json-pretty` with dark Monokai theme
- **Sticky footer** with attribution links

### Key Design Patterns
- **Color-coded examples**: Green/blue for basic, orange/pink for streaming, purple/indigo for word game
- **Loading states**: Spinners and disabled inputs during API calls
- **Error boundaries**: Try-catch blocks with console error logging
- **State management**: React hooks for component-level state (no external state library)

## Special Files

### `truth-window/` Directory
Contains session documentation tracking the development process and feature requests. Each session file documents what was requested and what was implemented, serving as a development audit trail.

### CSS Color Management (`src/App.css`)
Global overrides to fix Tailwind/component library conflicts:
- Buttons: `background-color: transparent` to prevent black backgrounds
- Inputs/textareas: `background-color: white; color: #111827` for proper contrast

## Environment Requirements

- **`OPENAI_API_KEY`** - Required for all API endpoints
- Cloudflare Workers environment with Wrangler CLI for deployment
- Node.js environment for local development

## Development Notes

- Frontend and backend are tightly coupled through the `/api/` routes
- All API responses include both the full OpenAI Response object and extracted `output_text`
- Streaming implementation uses Hono's `streamText` helper with manual chunk processing
- JSON syntax highlighting requires the `react-json-pretty` theme import in the main component