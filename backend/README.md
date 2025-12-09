# Stick Yours - Backend API

AI-powered sticker maker backend that removes backgrounds and adds white borders to images.

## Features
- Background removal using AI (rembg)
- Automatic white border generation
- PNG output with transparency
- CORS enabled for frontend integration

## Stack
- **Flask** - Web framework
- **rembg** - ML-based background removal
- **Pillow** - Image processing

## Local Development

### Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Server will run on `http://localhost:5001`

### API Endpoints

#### `POST /create-sticker`
Upload an image and receive a sticker with background removed and white border added.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
- Content-Type: `image/png`
- PNG file with transparency

#### `GET /health`
Health check endpoint.

## Deployment

### Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Render will auto-detect `render.yaml` and deploy

### Environment Variables
- `PYTHON_VERSION`: 3.11.0 (set in render.yaml)

### Notes
- First request may be slow (model loading)
- Subsequent requests are faster
- Image processing timeout: 120s

## License
MIT
