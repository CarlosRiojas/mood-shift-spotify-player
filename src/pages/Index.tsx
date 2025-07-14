
import { useState } from 'react';
import { TimeSelector } from '@/components/TimeSelector';
import { MoodSelector } from '@/components/MoodSelector';
import { PlaylistDisplay } from '@/components/PlaylistDisplay';
import { Header } from '@/components/Header';

export type TimeOfDay = 'morning' | 'afternoon' | 'night';
export type Mood = 'sad' | 'optimistic' | 'happy';

const Index = () => {
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('morning');
  const [selectedMood, setSelectedMood] = useState<Mood>('optimistic');

  const getBackgroundGradient = () => {
    const timeGradients = {
      morning: 'from-orange-400 via-pink-400 to-purple-500',
      afternoon: 'from-blue-400 via-cyan-400 to-teal-500',
      night: 'from-purple-900 via-blue-900 to-indigo-900'
    };
    return timeGradients[selectedTime];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 ease-in-out`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        <div className="mt-12 space-y-8">
          <TimeSelector 
            selectedTime={selectedTime} 
            onTimeSelect={setSelectedTime} 
          />
          
          <MoodSelector 
            selectedMood={selectedMood} 
            onMoodSelect={setSelectedMood}
            timeOfDay={selectedTime}
          />
          
          <PlaylistDisplay 
            timeOfDay={selectedTime}
            mood={selectedMood}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
