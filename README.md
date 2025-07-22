# Quick Stitch - Image to Video Slideshow Creator

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Create beautiful video slideshows from your images with drag & drop simplicity! Built with React, Remotion, Tailwind CSS, and shadcn/ui.

## ✨ Features

- **Drag & Drop Interface**: Simply drag images to upload and reorder them
- **Real-time Preview**: See your slideshow as you build it
- **Customizable FPS**: Adjust frame rate from 1-120 FPS to control video speed
- **H.264 Export**: Professional video output ready for sharing
- **Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **Remotion Powered**: Leverages Remotion for high-quality video rendering

## 🚀 Quick Start

**Install Dependencies**

```console
pnpm i
```

**Start the Web App**

```console
pnpm run web
```

**Start Remotion Studio** (for advanced preview and rendering)

```console
pnpm run dev
```

## 📖 How to Use

1. **Add Images**: Drag and drop images or click to select them (supports JPEG, PNG, GIF, WebP)
2. **Reorder**: Drag the grip handle to rearrange your image sequence
3. **Adjust Settings**: Use the FPS slider to control video speed (higher FPS = faster transitions)
4. **Preview**: See a basic preview in the web app or use Remotion Studio for full preview
5. **Export**: Click "Export to H.264" to render your final video

## 🎬 Available Scripts

- `pnpm run web` - Start the web interface (port 3001)
- `pnpm run dev` - Start Remotion Studio for advanced editing
- `pnpm run render` - Render video from command line
- `pnpm run build` - Build the Remotion bundle
- `pnpm run upgrade` - Upgrade Remotion to latest version

## 🛠 Tech Stack

- **React 19** - Modern React with latest features
- **Remotion** - Programmatic video creation
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Zustand** - Lightweight state management
- **@dnd-kit** - Smooth drag and drop interactions
- **react-dropzone** - File upload handling
- **Vite** - Fast development server

## 💡 Tips

- **Image Quality**: Use high-resolution images for best video output
- **Performance**: The app handles dozens of images smoothly
- **Formats**: Supports all major image formats (JPEG, PNG, GIF, WebP)
- **Duration**: Each image displays for `1/FPS` seconds (e.g., 30 FPS = ~0.033s per image)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ImageUpload.tsx # Drag & drop upload
│   ├── ImageList.tsx   # Sortable image list
│   └── Controls.tsx    # FPS and export controls
├── store/              # Zustand state management
├── lib/                # Utilities and helpers
├── Composition.tsx     # Remotion video composition
├── App.tsx            # Main web application
└── Root.tsx           # Remotion root configuration
```

## 🎥 Remotion Integration

This project uses Remotion for professional video rendering. The `Slideshow` composition automatically:

- Calculates frame timing based on your FPS setting
- Handles image transitions and display duration
- Adds professional overlays (image counter)
- Outputs broadcast-quality H.264 video

## 🤝 Contributing

This is a template project! Feel free to:

- Add transitions between images
- Implement custom timing per image
- Add text overlays and captions
- Create different slideshow styles
- Add audio support

## 📄 License

Note that for some entities a company license is needed for Remotion. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

---

**Made with ❤️ using Remotion, React, and modern web technologies**
