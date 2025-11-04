import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import axios from 'axios';

const PreviewSection = ({ userPhoto, selectedHairstyle, onReset }) => {
  const canvasRef = useRef(null);
  const [hairPosition, setHairPosition] = useState({ x: 0, y: 0 });
  const [hairScale, setHairScale] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userPhoto && selectedHairstyle) {
      drawPreview();
    }
  }, [userPhoto, selectedHairstyle, hairPosition, hairScale]);

  const drawPreview = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';
    userImg.src = userPhoto;
    
    userImg.onload = () => {
      canvas.width = userImg.width;
      canvas.height = userImg.height;
      
      ctx.drawImage(userImg, 0, 0);
      
      if (selectedHairstyle) {
        const hairImg = new Image();
        hairImg.crossOrigin = 'anonymous';
        hairImg.src = selectedHairstyle.image_url;
        
        hairImg.onload = () => {
          const scaledWidth = hairImg.width * hairScale;
          const scaledHeight = hairImg.height * hairScale;
          
          ctx.drawImage(
            hairImg,
            hairPosition.x,
            hairPosition.y,
            scaledWidth,
            scaledHeight
          );
        };
      }
    };
  };

  const handleSavePreview = async () => {
    setSaving(true);
    const canvas = canvasRef.current;
    const previewImage = canvas.toDataURL('image/png');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/upload/save-preview`, {
        user_photo: userPhoto,
        hairstyle_id: selectedHairstyle.id,
        preview_image: previewImage
      });
      
      alert('Preview saved successfully! ✅');
    } catch (error) {
      console.error('Error saving preview:', error);
      alert('Failed to save preview');
    } finally {
      setSaving(false);
    }
  };

  if (!userPhoto) {
    return (
      <div className="text-center py-12 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Upload a photo to see preview</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Preview</h2>
      
      <div className="mb-4 relative">
        <canvas
          ref={canvasRef}
          className="max-w-full border-2 border-gray-300 rounded-lg"
        />
      </div>

      {selectedHairstyle && (
        <div className="mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Hair Size: {Math.round(hairScale * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={hairScale}
              onChange={(e) => setHairScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <p className="text-sm text-gray-600">
            💡 Tip: Drag the hairstyle image to reposition it
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleSavePreview}
          disabled={!selectedHairstyle || saving}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
        >
          {saving ? 'Saving...' : '💾 Save Preview'}
        </button>
        
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default PreviewSection;