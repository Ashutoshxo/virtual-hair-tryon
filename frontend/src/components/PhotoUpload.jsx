import React, { useRef, useState } from 'react';
import axios from 'axios';

const PhotoUpload = ({ onPhotoUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      const photoUrl = `http://localhost:5000${response.data.photoUrl}`;
      setPreview(photoUrl);
      onPhotoUpload(photoUrl);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera');
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('photo', blob, 'capture.jpg');
      
      setUploading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/upload`,
          formData
        );
        
        const photoUrl = `http://localhost:5000${response.data.photoUrl}`;
        setPreview(photoUrl);
        onPhotoUpload(photoUrl);
        stopCamera();
      } catch (error) {
        console.error('Error uploading captured photo:', error);
      } finally {
        setUploading(false);
      }
    });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Upload or Capture Photo</h2>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={uploading}
        >
          📁 Upload Photo
        </button>
        
        <button
          onClick={isCameraActive ? capturePhoto : startCamera}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          disabled={uploading}
        >
          {isCameraActive ? '📸 Capture' : '📷 Open Camera'}
        </button>
        
        {isCameraActive && (
          <button
            onClick={stopCamera}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            ❌ Close Camera
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {isCameraActive && (
        <div className="mb-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-w-md rounded-lg border-2 border-gray-300"
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {uploading && <p className="text-blue-600">Uploading...</p>}
      
      {preview && !isCameraActive && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full max-w-md rounded-lg border-2 border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;