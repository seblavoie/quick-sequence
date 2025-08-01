# Quick Sequence

Transform image sequences into featherweight videos locally in your browser. Just add your images, set timings, choose an output formant, and export. That's it.

Use it for free: quicksequence.com

## Features

- **Featherweight exports**: The dynamic frame rate output renders no redundant frames and produces tiny files.
- **Fast, local and private**: The export happens in your browser. The images are not sent or saved. No install or account necessary.
- **Remotion-Powered**: Uses remotion and react for live previews and fast react-based rendering.
- **Smart codec detection**: Automatically uses the best available codec (H.264 MP4 or VP9 WebM) for your browser.
- **Adjustable format, encoding and scale**: Control your export settings to fine-tune your output.

## Development

1. Install dependencies

```bash
pnpm i
```

2. Run locally

```bash
pnpm run web
```

## Technical Stack

Built with modern web technologies for maximum performance:

- **Remotion** - Professional video composition framework
- **React 19** - Latest React with optimized rendering
- **Browser APIs** - Native video encoding without external dependencies
