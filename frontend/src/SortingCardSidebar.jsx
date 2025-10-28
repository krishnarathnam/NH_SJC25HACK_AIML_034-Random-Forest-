import _React from 'react';
import { useNavigate } from 'react-router-dom';

const SortingCardSidebar = ({ selectedCard, onClose }) => {
  const navigate = useNavigate();

  if (!selectedCard) return null;

  const handleStartLearning = () => {
    navigate(`/learning/${selectedCard.name.replace(/\s+/g, '-').toLowerCase()}`, {
      state: { algorithm: selectedCard.name }
    });
  };

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-xl border-l border-gray-200 z-20 overflow-y-auto">
      <div className="p-6 min-h-full flex flex-col">
        <div 
          onClick={onClose}
          className="mb-6 text-xs cursor-pointer hover:opacity-70"
        >
          ← Back
        </div>
        
        <h1 className="text-3xl font-bold text-[#023047] mb-2 font-pixel">{selectedCard.name}</h1>
        
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-sm font-semibold">
              {selectedCard.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#023047]/10 text-[#023047] text-sm font-semibold">
              +{selectedCard.xp} XP
            </span>
          </div>
          
          <div className="mb-4">
              <h3 className="text-lg font-semibold text-[#023047] mb-2 font-pixel">WHAT YOU'LL EARN:</h3>
            <ul className="space-y-1">
              {selectedCard.rewards.map((reward, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  {reward}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#023047] mb-3 font-pixel">WHY THIS MATTERS:</h3>
          <p className="text-gray-700 leading-relaxed">{selectedCard.importance}</p>
        </div>

        <div className="mt-auto">
          <button 
            onClick={handleStartLearning}
            className="w-full py-3 rounded-md bg-[#8B5CF6] text-white font-semibold hover:bg-[#7C3AED] transition-colors font-pixel text-sm"
          >
            {selectedCard.progress > 0 ? 'CONTINUE LEARNING' : 'START LEARNING'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortingCardSidebar;
