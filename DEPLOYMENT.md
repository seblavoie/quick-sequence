# Cloudflare Pages Deployment Guide

## Quick Setup

### 1. Cloudflare Pages Settings

- **Framework preset**: None (or Vite if available)
- **Build command**: `pnpm run build`
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

- All settings and controls

## Limitations

- Large exports are processed client-side, so performance depends on the user's device.
- Browser codec support can vary across platforms.

## Performance Considerations

- **Large files**: Processing happens client-side, so performance depends on user's device
- **Memory usage**: Large images or many images may require more RAM

## Troubleshooting

### Build Issues

```bash
# Local build test
pnpm run build

# Check output
ls -la dist/
```

### CORS Issues

The `_headers` file includes proper CORS configuration for:

- MediaRecorder API

- File downloads

### Performance Issues

- Recommend users to use smaller images or lower quality settings
- Consider adding file size warnings in the UI

## Alternative Deployment Options

- **Vercel**: Static hosting for the Vite build
- **Netlify**: Similar static deployment
- **Traditional hosting**: Any static host (GitHub Pages, etc.)
