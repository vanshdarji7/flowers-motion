# 🌸 Flower Motion - Interactive Air Garden

**Flower Motion** is an interactive, browser-based web experience built with **React**, **Vite**, **TypeScript**, **MediaPipe AI Hand Landmarker**, and **HTML Canvas**. Users move their finger(s) in front of their webcam to paint and grow a living floral garden in real time.

![Flower Motion Preview](src/assets/hero.png)

## ✨ Features

- **👐 Dual-Hand Simultaneous Air Drawing**: Move your index finger(s) to grow continuous flower trails in real time.
- **🤌 Pinch Cluster Burst**: Pinch your thumb and index finger together to trigger a floral explosion.
- **🖐️ Open Palm BOOM Blast**: Push your open palm forward to scatter and blast active flowers into floating petals and sparkles across your screen.
- **🎨 6 Procedural Flower Species**: Daisy, Pink Blossom, Sunflower, White Wildflower, Purple Cosmos, and Blue Hydrangea rendered dynamically on HTML Canvas.
- **🦋 Living Atmosphere**: Animated butterflies that flutter around mature gardens and floating sparkle dust.
- **⚙️ Customization**: Adjust spawn density, maximum flower limits (up to 1,000 flowers), visibility duration (up to 5 minutes), smoothing filters, and camera opacity/blur.

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **AI Hand Tracking**: `@mediapipe/tasks-vision` (MediaPipe HandLandmarker running GPU inference)
- **Graphics**: HTML5 Canvas (procedural vector shapes, spring physics, LERP position smoothing)
- **Styling**: Tailwind CSS + Lucide Icons + Glassmorphism aesthetic

## 🛠️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vanshdarji7/flowers-motion.git
   cd flowers-motion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔒 Privacy

Webcam streams are processed **100% locally** on your device using WebGL/WASM MediaPipe inference. Zero video data is stored, recorded, or sent to external servers.

## 📜 License

MIT License © 2026 Vanshdarji7
