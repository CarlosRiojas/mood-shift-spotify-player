
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { TimeOfDay, Mood } from '@/pages/Index';

interface PlaylistDisplayProps {
  timeOfDay: TimeOfDay;
  mood: Mood;
}

export const PlaylistDisplay = ({ timeOfDay, mood }: PlaylistDisplayProps) => {
  // Mock playlist data - this will be replaced with Spotify API data
  const mockPlaylists = {
    morning: {
      sad: {
        name: "Gentle Morning Reflection",
        description: "Soft acoustic melodies to ease into the day",
        tracks: ["Holocene - Bon Iver", "Mad World - Gary Jules", "The Night We Met - Lord Huron"],
        duration: "45 min"
      },
      optimistic: {
        name: "Rise & Shine",
        description: "Uplifting tunes to start your day with purpose",
        tracks: ["Good Morning - Kanye West", "Walking on Sunshine - Katrina", "Here Comes the Sun - The Beatles"],
        duration: "52 min"
      },
      happy: {
        name: "Morning Energy Boost",
        description: "High-energy tracks to jumpstart your day",
        tracks: ["Happy - Pharrell Williams", "Can't Stop the Feeling - Justin Timberlake", "Good as Hell - Lizzo"],
        duration: "38 min"
      }
    },
    afternoon: {
      sad: {
        name: "Midday Contemplation",
        description: "Thoughtful tracks for afternoon reflection",
        tracks: ["Breathe Me - Sia", "Hide and Seek - Imogen Heap", "Skinny Love - Bon Iver"],
        duration: "41 min"
      },
      optimistic: {
        name: "Afternoon Motivation",
        description: "Keep your momentum going strong",
        tracks: ["Stronger - Kelly Clarkson", "Count on Me - Bruno Mars", "Unstoppable - Sia"],
        duration: "49 min"
      },
      happy: {
        name: "Sunshine Vibes",
        description: "Feel-good hits for the brightest part of your day",
        tracks: ["Uptown Funk - Bruno Mars", "Shake It Off - Taylor Swift", "Dancing Queen - ABBA"],
        duration: "44 min"
      }
    },
    night: {
      sad: {
        name: "Evening Solitude",
        description: "Peaceful melodies for quiet contemplation",
        tracks: ["Hurt - Johnny Cash", "Black - Pearl Jam", "Everybody Hurts - R.E.M."],
        duration: "47 min"
      },
      optimistic: {
        name: "Hopeful Nights",
        description: "End your day with hope and gratitude",
        tracks: ["Three Little Birds - Bob Marley", "What a Wonderful World - Louis Armstrong", "Somewhere Over the Rainbow - Israel Kamakawiwoʻole"],
        duration: "36 min"
      },
      happy: {
        name: "Nighttime Celebration",
        description: "Joyful tracks to celebrate the day's end",
        tracks: ["September - Earth Wind & Fire", "I Want to Dance with Somebody - Whitney Houston", "Mr. Blue Sky - ELO"],
        duration: "42 min"
      }
    }
  };

  const currentPlaylist = mockPlaylists[timeOfDay][mood];

  const getPlaylistGradient = () => {
    const gradients = {
      morning: {
        sad: 'from-blue-400/20 to-gray-500/20',
        optimistic: 'from-yellow-400/20 to-orange-500/20',
        happy: 'from-pink-400/20 to-red-500/20'
      },
      afternoon: {
        sad: 'from-blue-500/20 to-purple-500/20',
        optimistic: 'from-green-400/20 to-blue-500/20',
        happy: 'from-yellow-400/20 to-pink-500/20'
      },
      night: {
        sad: 'from-indigo-600/20 to-purple-800/20',
        optimistic: 'from-purple-500/20 to-pink-500/20',
        happy: 'from-pink-500/20 to-red-600/20'
      }
    };
    return gradients[timeOfDay][mood];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-gradient-to-br ${getPlaylistGradient()} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentPlaylist.name}
            </h3>
            <p className="text-white/70 mb-4">
              {currentPlaylist.description}
            </p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentPlaylist.duration}
              </div>
              <div className="flex items-center gap-1">
                {currentPlaylist.tracks.length} tracks
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <button className="w-full mb-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200 flex items-center justify-center gap-3">
          <Play className="w-6 h-6 fill-current" />
          Play on Spotify
        </button>

        <div className="space-y-3">
          <h4 className="text-white font-semibold mb-3">Featured Tracks:</h4>
          {currentPlaylist.tracks.map((track, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white/70 text-sm font-medium">
                {index + 1}
              </div>
              <span className="text-white/90 flex-1">{track}</span>
              <button className="p-1 rounded hover:bg-white/10 transition-colors">
                <Play className="w-4 h-4 text-white/70" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm text-center">
            <strong>Coming Soon:</strong> Real-time Spotify integration to automatically refresh playlists based on your mood and listening patterns.
          </p>
        </div>
      </div>
    </div>
  );
};
