import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HairstyleGallery = ({ length, onSelect, selectedHairstyle }) => {
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (length) {
      fetchHairstyles();
    }
  }, [length]);

  const fetchHairstyles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/hairstyles?length=${length}`
      );
      setHairstyles(response.data.data);
    } catch (error) {
      console.error('Error fetching hairstyles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a hair length first
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading hairstyles...</div>;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Choose Hairstyle</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hairstyles.map((style) => (
          <div
            key={style.id}
            onClick={() => onSelect(style)}
            className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
              selectedHairstyle?.id === style.id
                ? 'border-purple-600 shadow-xl scale-105'
                : 'border-transparent hover:border-purple-300'
            }`}
          >
            <img
              src={style.image_url}
              alt={style.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 bg-white">
              <p className="font-medium text-sm">{style.name}</p>
              <p className="text-xs text-gray-500 capitalize">{style.color}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HairstyleGallery;