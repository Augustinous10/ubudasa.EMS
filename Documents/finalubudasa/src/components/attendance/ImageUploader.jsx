// src/components/attendance/ImageUploader.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UploadCloud } from 'lucide-react';
import './image-uploader.css';

function ImageUploader({ onImageUpload, recordId }) {
  const [previewFiles, setPreviewFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setPreviewFiles(files.map(file => URL.createObjectURL(file)));

      // Only trigger upload for valid image files
      const imageFiles = files.filter(file => file.type.startsWith("image/"));
      if (imageFiles.length) {
        onImageUpload(imageFiles, recordId);
      }
    }
  };

  return (
    <div className="image-uploader-box">
      <label htmlFor={`upload-${recordId}`} className="upload-label">
        <UploadCloud size={20} />
        <span>Upload Images</span>
        <input
          id={`upload-${recordId}`}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {previewFiles.length > 0 && (
        <div className="preview-grid mt-2">
          {previewFiles.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index}`}
              className="preview-thumbnail"
              loading="lazy"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Prevent unnecessary re-renders
export default React.memo(ImageUploader);

ImageUploader.propTypes = {
  onImageUpload: PropTypes.func.isRequired,
  recordId: PropTypes.string, // Optional if used globally
};
