from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from rembg import remove
from PIL import Image, ImageDraw, ImageFilter
import io
import os

app = Flask(__name__)

# Fix CORS - allow all origins for development
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Backend is running!"})

@app.route('/create-sticker', methods=['POST', 'OPTIONS'])
def create_sticker():
    # Handle preflight request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        # Get uploaded file
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        file = request.files['image']
        
        # Open image
        img = Image.open(file.stream).convert('RGBA')
        
        # Remove background
        print("🔄 Removing background...")
        no_bg = remove(img)
        
        # Ensure RGBA mode
        if no_bg.mode != 'RGBA':
            no_bg = no_bg.convert('RGBA')
        
        print("🎨 Creating sticker effect...")
        
        # DON'T crop - keep full image size
        orig_width, orig_height = no_bg.size
        
        # Settings
        border_width = 12  # White border thickness
        padding = 20  # Extra space around edges
        
        new_width = orig_width + (padding * 2)
        new_height = orig_height + (padding * 2)
        
        # Create base transparent image
        sticker = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
        
        # Paste the full image in center
        sticker.paste(no_bg, (padding, padding), no_bg)
        
        # Get alpha channel (transparency info)
        alpha = sticker.split()[3]
        
        # Dilate (expand) the alpha to create border
        border_alpha = alpha.filter(ImageFilter.MaxFilter(border_width * 2 + 1))
        
        # Create white border image
        white_border = Image.new('RGBA', (new_width, new_height), (255, 255, 255, 255))
        white_border.putalpha(border_alpha)
        
        # Create final image: white border + original object
        final = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
        final.paste(white_border, (0, 0), white_border)
        final.paste(sticker, (0, 0), sticker)
        
        # Optional: Add rounded corners
        mask = Image.new('L', (new_width, new_height), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle([(0, 0), (new_width-1, new_height-1)], radius=25, fill=255)
        
        # Apply rounded mask
        output = Image.new('RGBA', (new_width, new_height), (0, 0, 0, 0))
        output.paste(final, (0, 0))
        output.putalpha(Image.composite(output.split()[3], Image.new('L', output.size, 0), mask))
        
        # Convert to PNG bytes
        img_io = io.BytesIO()
        output.save(img_io, 'PNG', quality=95)
        img_io.seek(0)
        
        print("✅ Sticker created successfully!")
        
        response = send_file(
            img_io,
            mimetype='image/png',
            as_attachment=True,
            download_name='sticker.png'
        )
        
        # Add CORS headers to response
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 AI Sticker Maker Backend Starting...")
    print("=" * 50)
    port = int(os.environ.get('PORT', 5001))
    print(f"📍 Server: http://localhost:{port}")
    print("✅ CORS: Enabled")
    print("=" * 50)
    app.run(host='0.0.0.0', port=port)