
import { Sunrise, Sun, Moon } from 'lucide-react';
import { TimeOfDay } from '@/pages/Index';

interface TimeSelectorProps {
  selectedTime: TimeOfDay;
  onTimeSelect: (time: TimeOfDay) => void;
}

export const TimeSelector = ({ selectedTime, onTimeSelect }: TimeSelectorProps) => {
  const timeOptions = [
    {
      id: 'morning' as TimeOfDay,
      label: 'Morning',
      icon: Sunrise,
      description: 'Start your day right',
      gradient: 'from-orange-400 to-pink-500'
    },
    {
      id: 'afternoon' as TimeOfDay,
      label: 'Afternoon',
      icon: Sun,
      description: 'Keep the energy flowing',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'night' as TimeOfDay,
      label: 'Night',
      icon: Moon,
      description: 'Wind down peacefully',
      gradient: 'from-purple-600 to-indigo-700'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white text-center">
        What time is it?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedTime === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onTimeSelect(option.id)}
              className={`
                group relative p-6 rounded-2xl backdrop-blur-sm transition-all duration-300
                ${isSelected 
                  ? 'bg-white/30 scale-105 shadow-xl' 
                  : 'bg-white/10 hover:bg-white/20 hover:scale-102'
                }
              `}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              
              <div className="relative z-10 text-center space-y-3">
                <div className="flex justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {option.label}
                </h3>
                <p className="text-white/70 text-sm">
                  {option.description}
                </p>
              </div>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
