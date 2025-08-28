import { useState, useRef } from 'react';
import './UploadPreview.css';

const UploadPreview = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_WIDTH = 1920;
  const MAX_HEIGHT = 1920;

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = MAX_WIDTH;
            height = width / aspectRatio;
          } else {
            height = MAX_HEIGHT;
            width = height * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and resize
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    setError(null);
    setIsProcessing(true);

    try {
      // Validate file type
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        throw new Error('Please upload a PNG or JPG image');
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be ≤10MB');
      }

      let processedFile = file;
      
      // Resize if needed
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });

      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        processedFile = await resizeImage(file);
      }

      // Create preview
      const previewUrl = URL.createObjectURL(processedFile);
      setUploadedImage({
        file: processedFile,
        preview: previewUrl,
        originalSize: file.size,
        processedSize: processedFile.size,
        dimensions: { width: img.width, height: img.height },
        name: file.name
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const clearImage = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="upload-preview">
      <div className="upload-header">
        <h2 className="upload-title">Upload & Preview</h2>
        <p className="upload-subtitle">Upload a PNG/JPG image (≤10MB) for preview and processing</p>
      </div>

      {!uploadedImage ? (
        <div 
          className={`upload-zone ${isProcessing ? 'processing' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          
          {isProcessing ? (
            <div className="processing-state">
              <div className="spinner"></div>
              <p className="processing-text">Processing image...</p>
            </div>
          ) : (
            <div className="upload-content">
              <div className="upload-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h3 className="upload-title-text">Drop your image here</h3>
              <p className="upload-subtitle-text">or click to browse</p>
              <div className="file-specs">
                <span className="file-spec">PNG, JPG up to 10MB</span>
                <span className="file-spec">Auto-resize to ≤1920px if needed</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-header">
            <h3 className="preview-title">Preview</h3>
            <button onClick={clearImage} className="clear-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              <span>Clear</span>
            </button>
          </div>
          
          <div className="preview-content">
            <div className="image-container">
              <img 
                src={uploadedImage.preview} 
                alt="Preview" 
                className="preview-image"
              />
            </div>

            <div className="image-details">
              <div className="detail-item">
                <span className="detail-label">Filename:</span>
                <span className="detail-value">{uploadedImage.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dimensions:</span>
                <span className="detail-value">{uploadedImage.dimensions.width} × {uploadedImage.dimensions.height}px</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Original Size:</span>
                <span className="detail-value">{formatFileSize(uploadedImage.originalSize)}</span>
              </div>
              {uploadedImage.originalSize !== uploadedImage.processedSize && (
                <div className="detail-item">
                  <span className="detail-label">Processed Size:</span>
                  <span className="detail-value processed">{formatFileSize(uploadedImage.processedSize)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span className="error-text">{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadPreview; 