# AI Fact Checker

A Next.js app that uses Google's Gemini AI to fact-check claims with real-time web search.

## Features

- Real-time fact-checking using Google Gemini AI
- Secure server-side API key handling
- Modern UI with Tailwind CSS and dark mode
- Source verification with web search integration

## Setup

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Copy `.env.example` to `.env.local`
4. Add your Gemini API key to `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
5. Run the development server: `npm run dev`

## Security

⚠️ **Important**: The API key is handled securely on the server-side only. Do NOT use the `NEXT_PUBLIC_` prefix for the API key as it would expose it to the client-side code and make it visible in browser developer tools.

## API Key Setup

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) and add it to your `.env.local` file as shown above.
