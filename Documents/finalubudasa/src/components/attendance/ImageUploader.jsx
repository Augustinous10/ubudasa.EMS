import { useState } from 'react';
import '../styles/components/attendance/image-uploader.css';

const ImageUploader = ({ date, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please select an image under 5MB.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select an image file.');
      return;
    }

    try {
      setLoading(true);
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="image-uploader" onSubmit={handleSubmit}>
      <label>
        Upload attendance image for {date}:
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {previewUrl && (
        <div className="preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default ImageUploader;
