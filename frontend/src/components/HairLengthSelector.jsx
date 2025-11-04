import React from 'react';

const HairLengthSelector = ({ selectedLength, onSelect }) => {
  const lengths = ['short', 'medium', 'long'];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Select Hair Length</h2>
      <div className="flex gap-4">
        {lengths.map((length) => (
          <button
            key={length}
            onClick={() => onSelect(length)}
            className={`px-6 py-3 rounded-lg font-medium capitalize transition-all ${
              selectedLength === length
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {length}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HairLengthSelector;