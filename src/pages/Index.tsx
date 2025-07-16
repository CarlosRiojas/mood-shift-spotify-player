import { useState } from 'react';
import { TimeSelector } from '@/components/TimeSelector';
import { MoodSelector } from '@/components/MoodSelector';
import { PlaylistDisplay } from '@/components/PlaylistDisplay';
import { SpotifyAuth } from '@/components/SpotifyAuth';
import { Header } from '@/components/Header';

export type TimeOfDay = 'morning' | 'afternoon' | 'night';
export type Mood = 'sad' | 'optimistic' | 'happy';

const Index = () => {
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('morning');
  const [selectedMood, setSelectedMood] = useState<Mood>('optimistic');

  // The 'token' and 'onAuthError' logic is no longer needed here.
  // The SpotifyAuth component now manages all of that internally.

  const getBackgroundGradient = () => {
    const timeGradients = {
      morning: 'from-orange-400 via-pink-400 to-purple-500',
      afternoon: 'from-blue-400 via-cyan-400 to-teal-500',
      night: 'from-purple-900 via-blue-900 to-indigo-900'
    };
    return timeGradients[selectedTime];
  };

  return (
    // 1. The SpotifyAuth component now acts as a wrapper for the entire page.
    // It will show a login screen if needed, or it will render its children if the user is authenticated.
    <SpotifyAuth>
      <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-1000 ease-in-out`}>
        <div className="container mx-auto px-4 py-8">
          <Header />
          
          <div className="mt-12 space-y-8">
            {/* 2. All the components that need authentication now live INSIDE SpotifyAuth. */}
            
            <TimeSelector 
              selectedTime={selectedTime} 
              onTimeSelect={setSelectedTime} 
            />
            
            <MoodSelector 
              selectedMood={selectedMood} 
              onMoodSelect={setSelectedMood}
              timeOfDay={selectedTime}
            />
            
            {/* 3. PlaylistDisplay can now correctly use the useAuth() hook because it's a child of SpotifyAuth. */}
            {/* The 'onAuthError' prop is removed as it's no longer part of this design. */}
            <PlaylistDisplay 
              timeOfDay={selectedTime}
              mood={selectedMood}
              onAuthError={() => { /* This can be handled internally or removed if not needed */ }}
            />
          </div>
        </div>
      </div>
    </SpotifyAuth>
  );
};

export default Index;


