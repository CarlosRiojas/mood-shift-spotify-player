
import { CloudRain, Zap, Heart } from 'lucide-react';
import { Mood, TimeOfDay } from '@/pages/Index';

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodSelect: (mood: Mood) => void;
  timeOfDay: TimeOfDay;
}

export const MoodSelector = ({ selectedMood, onMoodSelect, timeOfDay }: MoodSelectorProps) => {
  const moodOptions = [
    {
      id: 'sad' as Mood,
      label: 'Reflective',
      icon: CloudRain,
      description: 'Gentle, contemplative vibes',
      color: 'from-gray-400 to-blue-500'
    },
    {
      id: 'optimistic' as Mood,
      label: 'Optimistic',
      icon: Zap,
      description: 'Uplifting and motivating',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'happy' as Mood,
      label: 'Joyful',
      icon: Heart,
      description: 'Pure happiness and energy',
      color: 'from-pink-400 to-red-500'
    }
  ];

  const getTimeBasedMessage = () => {
    const messages = {
      morning: "How do you want to start your day?",
      afternoon: "What energy do you need right now?",
      night: "How should we end your day?"
    };
    return messages[timeOfDay];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white text-center">
        {getTimeBasedMessage()}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moodOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMood === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onMoodSelect(option.id)}
              className={`
                group relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-300
                ${isSelected 
                  ? 'bg-white/30 scale-105 shadow-xl ring-2 ring-white/50' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-102'
                }
              `}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-0 ${isSelected ? 'opacity-30' : 'group-hover:opacity-20'} transition-opacity duration-300`} />
              
              <div className="relative z-10 text-center space-y-3">
                <div className="flex justify-center">
                  <Icon className={`w-8 h-8 transition-transform duration-300 ${isSelected ? 'scale-110 text-white' : 'text-white/80'}`} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {option.label}
                </h3>
                <p className="text-white/70 text-sm">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
