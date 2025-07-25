# Cloudflare Pages Deployment Guide

## Quick Setup

### 1. Cloudflare Pages Settings

- **Framework preset**: None (or Vite if available)
- **Build command**: `pnpm run build:web`
- **Build output directory**: `dist`
- **Node.js version**: `18` or `20`

### 2. Environment Variables

No environment variables are required for basic functionality.

### 3. Build Configuration

The project is configured for static deployment with:

- Vite build optimization
- Code splitting for better performance
- Proper headers for media recording

## Features That Work on Cloudflare Pages

✅ **Full functionality available:**

- Drag & drop image upload
- Image reordering and management
- Real-time preview
- MP4 video export (using MediaRecorder API)
- Animated GIF export (using gif.js web worker)
- All settings and controls

## Limitations

❌ **Server-side Remotion features not available:**

- Command-line rendering (`pnpm run render`)
- Remotion Studio (`pnpm run dev`)
- Server-side video processing

## Performance Considerations

- **Large files**: Processing happens client-side, so performance depends on user's device
- **Memory usage**: Large images or many images may require more RAM
- **Export time**: GIF generation can be slow for long videos with many frames

## Troubleshooting

### Build Issues

```bash
# Local build test
pnpm run build:web

# Check output
ls -la dist/
```

### CORS Issues

The `_headers` file includes proper CORS configuration for:

- MediaRecorder API
- Web Worker (gif.js)
- File downloads

### Performance Issues

- Recommend users to use smaller images or lower quality settings
- Consider adding file size warnings in the UI

## Alternative Deployment Options

If you need server-side rendering capabilities:

- **Vercel**: Supports Remotion server-side rendering
- **Netlify**: Similar to Cloudflare Pages
- **Traditional hosting**: Any static host (GitHub Pages, etc.)
