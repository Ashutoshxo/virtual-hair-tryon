import React, { useState } from 'react';
import HairLengthSelector from './components/HairLengthSelector';
import HairstyleGallery from './components/HairstyleGallery';
import PhotoUpload from './components/PhotoUpload';
import PreviewSection from './components/PreviewSection';

function App() {
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const handleReset = () => {
    setSelectedLength('');
    setSelectedHairstyle(null);
    setUserPhoto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            ✨ Virtual Hair Try-On ✨
          </h1>
          <p className="text-gray-600">
            Upload your photo and try different hairstyles!
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Controls */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <HairLengthSelector
                selectedLength={selectedLength}
                onSelect={setSelectedLength}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <HairstyleGallery
                length={selectedLength}
                onSelect={setSelectedHairstyle}
                selectedHairstyle={selectedHairstyle}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <PhotoUpload onPhotoUpload={setUserPhoto} />
            </div>
          </div>

          {/* Right Side - Preview */}
          <div>
            <PreviewSection
              userPhoto={userPhoto}
              selectedHairstyle={selectedHairstyle}
              onReset={handleReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;