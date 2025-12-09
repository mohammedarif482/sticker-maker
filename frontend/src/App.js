import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stickerUrl, setStickerUrl] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setStickerUrl(null); // Reset previous sticker

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create sticker
  const createSticker = async () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post(
        '/create-sticker',
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Create download URL
      const url = URL.createObjectURL(response.data);
      setStickerUrl(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create sticker. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Download sticker
  const downloadSticker = () => {
    if (stickerUrl) {
      const a = document.createElement('a');
      a.href = stickerUrl;
      a.download = 'sticker.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreview(null);
    setStickerUrl(null);
    setShowModal(false);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo">
          <img src="/stick-yours-logo.png" alt="Stick Yours" className="logo-img" />
        </div>
      </nav>

      <section className="hero-section">
        <div className="container">
          {/* Left Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Make Stickers from Photos Automatically
            </h1>
            <p className="hero-subtitle">
              Remove backgrounds and add white borders to your photos in seconds.
              100% automatic and free.
            </p>
          </div>

          {/* Right Card */}
          <div className="upload-container">
            <div className="upload-card">

              {/* State 1: Upload (Initial) */}
              {!preview && !loading && !stickerUrl && (
                <>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-input" className="upload-btn-label">
                    Upload Image
                  </label>
                  <p className="drop-text">or drop a file</p>
                </>
              )}

              {/* State 2: Preview & Processing */}
              {preview && !stickerUrl && (
                <div className="preview-container">
                  <div className="image-wrapper">
                    <img src={preview} alt="Preview" className="preview-img" />
                  </div>

                  {loading ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>Processing Image...</p>
                    </div>
                  ) : (
                    <button onClick={createSticker} className="action-btn">
                      ✨ Create Sticker
                    </button>
                  )}

                  {!loading && (
                    <button onClick={resetState} className="reset-btn">
                      Choose different image
                    </button>
                  )}
                </div>
              )}

              {/* State 3: Result */}
              {stickerUrl && (
                <div className="result-container">
                  <div className="image-wrapper transparency-bg">
                    <img
                      src={stickerUrl}
                      alt="Sticker"
                      className="sticker-img clickable"
                      onClick={() => setShowModal(true)}
                      title="Click to view full screen"
                    />
                  </div>

                  <button onClick={downloadSticker} className="action-btn download-btn">
                    Download Sticker
                  </button>

                  <button onClick={resetState} className="reset-btn">
                    Upload new image
                  </button>
                </div>
              )}

            </div>
            <p className="helper-text">
              By uploading an image you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </section>

      {/* Full Screen Modal */}
      {showModal && stickerUrl && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <img src={stickerUrl} alt="Full Screen Sticker" className="full-screen-img transparency-bg" />
            <div className="modal-actions">
              <button onClick={downloadSticker} className="action-btn download-btn">
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;