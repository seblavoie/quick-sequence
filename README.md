# Quick Sequence - Image Sequences to Featherweight Videos

Transform image sequences into MP4 or QuickTime ProRes video files locally in your browser with minimal necessary fps for dramatically small file sizes.

## ✨ Key Benefits

- **Remotion-Powered**: Uses remotion and react for live previews and fast react-based rendering.
- **Intelligent FPS Calculation**: Minimal frame rates with no redundant frames for dramatically smaller files.
- **Adjustable format, encoding and scale**: Control your export settings to fine-tune your output.
- **No Software Required**: Fast, browser-based, local and private.

## 🚀 Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd quick-sequence
pnpm install

# Start developing
pnpm run web
```

## 📖 Simple Workflow

1. **Add Images** - Upload your image collection
2. **Set Timing** - Choose how long each image displays (affects file size)
3. **Pick Format** - MP4 for sharing, QuickTime for professional editing
4. **Export** - Get optimized video files in seconds

## 🎯 File Size Advantages

### **Smart FPS Optimization**

- **1/60 second per image** = 60 FPS encoding (ultra-fast transitions, minimal files)
- **0.25 second per image** = 4 FPS encoding (fast transitions, tiny files)
- **1 second per image** = 1 FPS encoding (standard pace, very small files)
- **Traditional video** = 30 FPS encoding (massive unnecessary file sizes)

### **Intelligent Compression**

- **Automatic Quality Selection**: Chooses optimal settings for your content
- **No Wasted Frames**: Only renders frames that are actually seen
- **Professional Results**: Broadcast quality at web-friendly file sizes
- **Format Optimization**: Each export format uses best-in-class compression

## 🎥 Export Formats

| Format               | Best For                            | File Size | Quality   |
| -------------------- | ----------------------------------- | --------- | --------- |
| **MP4**              | Web, Social Media, General Sharing  | Smallest  | Excellent |
| **QuickTime ProRes** | Professional Editing, Color Grading | Larger    | Maximum   |

### **ProRes Quality Levels**

- **Low (45 Mbps)**: ProRes Proxy equivalent - perfect for editing proxies
- **Medium (147 Mbps)**: ProRes 422 equivalent - professional standard
- **Full (220 Mbps)**: ProRes 422 HQ equivalent - maximum quality for finishing

## 🛠 Technical Stack

Built with modern web technologies for maximum performance:

- **Remotion** - Professional video composition framework
- **React 19** - Latest React with optimized rendering
- **Browser APIs** - Native video encoding without external dependencies

## 🎨 Professional Output

### **Why File Sizes Stay Small**

- **Frame-Perfect Encoding**: Only generates frames when images change
- **Smart Bitrate Allocation**: Higher quality where it matters, optimized elsewhere
- **Temporal Compression**: Leverages video codecs' efficiency for static content
- **Resolution Scaling**: Choose output size that matches your delivery needs

### **Professional Features**

- **Broadcast Quality**: Full HD output suitable for television and streaming
- **Edit-Ready**: Direct import into Final Cut Pro, Premiere Pro, DaVinci Resolve
- **Color Preservation**: High bitrate encoding preserves image quality for post-production
- **Archival Quality**: Professional formats ensure long-term compatibility

## 📄 License

Note that for some entities a company license is needed for Remotion. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

---

**Professional video creation in the browser - optimized for quality and efficiency.**
