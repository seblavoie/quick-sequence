# Quick Stitch - Image to Video Slideshow Creator

Transform your image collections into professional video slideshows with drag & drop simplicity! Quick Stitch is a modern web application that lets you create both MP4 videos and animated GIFs from your images with real-time preview and extensive customization options.

## ✨ Features

### 🖼️ Image Management

- **Drag & Drop Upload**: Intuitive file upload with support for JPEG, PNG, GIF, WebP, and BMP formats
- **Visual Organization**: Sortable image list with drag & drop reordering
- **Smart Thumbnails**: Preview thumbnails with file size and format information
- **Easy Removal**: One-click image deletion with confirmation

### 🎬 Real-Time Preview

- **Live Slideshow Preview**: See your slideshow playing in real-time as you build it
- **Playback Controls**: Play, pause, and reset functionality
- **Progress Tracking**: Visual progress bar showing current position and timing
- **Current Image Info**: Display of active image with timing details

### ⚙️ Advanced Export Options

- **Dual Format Support**:
  - **MP4 (H.264)**: Professional video output using MediaRecorder API
  - **Animated GIF**: Lightweight animated format using gif.js
- **Quality Presets**: Low, Medium, and Full quality options
- **Scale Options**: 25%, 50%, 75%, and 100% resolution scaling
- **Custom Timing**: Adjustable image duration from 0.1 to 5.0 seconds per image
- **Smart FPS Calculation**: Automatic frame rate optimization based on timing

### 🎛️ Intelligent Controls

- **Duration Slider**: Fine-tune how long each image displays
- **Export Preview**: See exactly what will be exported before rendering
- **Progress Tracking**: Real-time export progress with detailed feedback
- **Success Reporting**: Comprehensive export statistics and file information

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd quick-stitch

# Install dependencies
pnpm install
```

### Development

```bash
# Start the web application (port 3001)
pnpm run web

# Start Remotion Studio for advanced preview and rendering
pnpm run dev
```

### Building and Deployment

```bash
# Build the Remotion bundle
pnpm run build

# Render video from command line
pnpm run render

# Lint and type check
pnpm run lint
```

## 📖 How to Use

### 1. Upload Images

- Drag and drop images onto the upload area, or click to browse
- Supports JPEG, PNG, GIF, WebP, and BMP formats
- Upload multiple images at once

### 2. Organize Your Slideshow

- Images appear in a sortable list with thumbnails
- Drag the grip handle (⋮⋮) to reorder images
- Click the trash icon to remove unwanted images
- The sequence order determines your final slideshow

### 3. Configure Settings

- **Image Duration**: Adjust how long each image displays (0.1-5.0 seconds)
- **Quality**: Choose from Low, Medium, or Full quality
- **Scale**: Select output resolution (25%-100% of 1920×1080)
- **Format**: Pick MP4 for videos or GIF for animated images

### 4. Preview Your Creation

- Use the preview panel to see your slideshow in action
- Play/pause controls let you review timing and sequence
- Progress bar shows current position in the slideshow

### 5. Export Your Slideshow

- Click "Export to MP4" or "Export to GIF" based on your format choice
- Watch real-time progress during rendering
- Download automatically starts when complete
- Get detailed export statistics (file size, duration, format)

## 🛠 Tech Stack

### Frontend

- **React 19** - Latest React with modern features and optimizations
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Lightning-fast development server and build tool

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS framework with modern features
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Comprehensive icon set

### State Management & Interactions

- **Zustand** - Lightweight, fast state management
- **@dnd-kit** - Modern drag and drop with accessibility support
- **react-dropzone** - Robust file upload handling

### Video & Export

- **Remotion** - Programmatic video creation framework
- **MediaRecorder API** - Browser-native video recording
- **gif.js** - Client-side animated GIF generation
- **Canvas API** - Image processing and frame rendering

## 🏗️ Project Architecture

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   └── slider.tsx
│   ├── Controls.tsx     # Export settings and controls
│   ├── ImageList.tsx    # Sortable image management
│   ├── ImageUpload.tsx  # Drag & drop file upload
│   └── VideoPreview.tsx # Real-time slideshow preview
├── lib/
│   ├── utils.ts         # Utility functions
│   └── videoExport.ts   # Export engine (MP4/GIF)
├── store/
│   └── useImageStore.ts # Zustand state management
├── App.tsx              # Main application component
├── Composition.tsx      # Remotion video composition
├── Root.tsx            # Remotion root configuration
└── main.tsx            # Application entry point
```

## 🎥 Export Capabilities

### MP4 Video Export

- **Format**: H.264 MP4 (with fallback to WebM)
- **Resolution**: Up to 1920×1080 (scalable)
- **Quality**: Configurable bitrate and CRF settings
- **Compatibility**: Works in Chrome, Firefox, Edge, Safari

### Animated GIF Export

- **Format**: Standard GIF with animation
- **Optimization**: Smart quality settings for file size control
- **Worker Support**: Multi-threaded rendering for performance
- **Frame Control**: Precise timing control per image

### Technical Details

- **Canvas Rendering**: High-quality image processing
- **Aspect Ratio**: Automatic letterboxing for mixed ratios
- **Memory Management**: Efficient cleanup and resource handling
- **Progress Tracking**: Real-time feedback during export

## 🎨 Customization Options

### Timing Control

- **Image Duration**: 0.1-5.0 seconds per image
- **FPS Calculation**: Automatic based on duration (FPS = 1/duration)
- **Smooth Playback**: Optimized frame timing for smooth video

### Quality Settings

- **Low**: Smaller files, faster export, good for web sharing
- **Medium**: Balanced quality and file size (recommended)
- **Full**: Maximum quality for professional use

### Scale Options

- **25%**: 480×270 - Ultra-compressed for web
- **50%**: 960×540 - Good balance for social media
- **75%**: 1440×810 - High quality for most uses
- **100%**: 1920×1080 - Full HD for professional output

## 🔧 Development

### Available Scripts

- `pnpm run web` - Start web app development server
- `pnpm run dev` - Start Remotion Studio
- `pnpm run build` - Build Remotion bundle
- `pnpm run render` - Command-line video rendering
- `pnpm run upgrade` - Upgrade Remotion dependencies
- `pnpm run lint` - ESLint and TypeScript checks

### Key Dependencies

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@remotion/cli": "4.0.325",
  "gif.js": "^0.2.0",
  "react": "19.0.0",
  "remotion": "4.0.325",
  "tailwindcss": "4.0.0",
  "zustand": "^5.0.6"
}
```

## 🤝 Contributing

Contributions are welcome! Here are some areas for enhancement:

### Potential Features

- **Transition Effects**: Fade, slide, zoom between images
- **Audio Support**: Add background music or narration
- **Text Overlays**: Captions, titles, and custom text
- **Templates**: Pre-made slideshow styles and themes
- **Batch Processing**: Multiple slideshow creation
- **Cloud Export**: Direct upload to video platforms

### Development Guidelines

- Follow existing code patterns and TypeScript conventions
- Use shadcn/ui components for consistent UI
- Maintain responsive design principles
- Add proper error handling and user feedback
- Test across different browsers and file formats

## 📄 License

Note that for some entities a company license is needed for Remotion. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

---

**Made with ❤️ using Remotion, React 19, and modern web technologies**
