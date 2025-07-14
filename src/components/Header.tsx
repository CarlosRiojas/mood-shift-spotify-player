
import { Music } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          MoodFlow
        </h1>
      </div>
      <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
        Your personal soundtrack curator. Discover playlists that match your time of day and emotional state for a better daily rhythm.
      </p>
    </header>
  );
};
