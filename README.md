# Stick Yours - AI Sticker Maker

![Stick Yours](frontend/public/stick-yours-logo.png)

Transform any image into a custom sticker with AI-powered background removal and automatic white borders.

## 🌟 Features

- **AI Background Removal** - Powered by rembg ML model
- **Automatic White Borders** - Professional sticker effect
- **Instant Preview** - See results before downloading
- **Full-Screen View** - Click to zoom and inspect details
- **PNG Export** - High-quality transparent stickers
- **Modern UI** - Clean, professional interface inspired by remove.bg

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Axios** - API communication
- **Modern CSS** - Custom styling with animations

### Backend
- **Flask** - Python web framework
- **rembg** - ML-based background removal
- **Pillow** - Image processing
- **Gunicorn** - Production WSGI server

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.11+
- pip

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohammedarif482/sticker-maker.git
   cd sticker-maker
   ```

2. **Start Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   # Server runs on http://localhost:5001
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   # App opens on http://localhost:3000
   ```

## 📦 Deployment

### Backend (Render.com)
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect your repository
5. Render auto-detects `render.yaml` and deploys

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy `build/` folder to Vercel or Netlify
3. Update API URL in production config

## 📖 API Documentation

### `POST /create-sticker`
Upload an image and receive a sticker with removed background and white border.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
- Content-Type: `image/png`
- Returns PNG with transparency

### `GET /health`
Health check endpoint

## 🎨 How It Works

1. **Upload** - User selects an image
2. **Process** - Backend removes background using AI
3. **Enhance** - Adds white border and rounded corners
4. **Download** - User gets high-quality PNG sticker

## 📝 License

MIT License - Feel free to use this project!

## 👤 Author

Mohammed Arif
- GitHub: [@mohammedarif482](https://github.com/mohammedarif482)

## 🙏 Acknowledgments

- [rembg](https://github.com/danielgatis/rembg) - Background removal
- [remove.bg](https://remove.bg) - Design inspiration
