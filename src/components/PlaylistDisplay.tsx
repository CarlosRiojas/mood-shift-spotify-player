
import { useState, useEffect } from 'react';
import { Play, Heart, MoreHorizontal, Clock, ExternalLink } from 'lucide-react';
import { TimeOfDay, Mood } from '@/pages/Index';
import { spotifyService, SpotifyPlaylist, SpotifyTrack } from '@/services/spotifyService';

interface PlaylistDisplayProps {
  timeOfDay: TimeOfDay;
  mood: Mood;
  isSpotifyConnected: boolean;
}

export const PlaylistDisplay = ({ timeOfDay, mood, isSpotifyConnected }: PlaylistDisplayProps) => {
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock playlist data for when Spotify is not connected
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

  useEffect(() => {
    if (isSpotifyConnected) {
      searchForPlaylist();
    }
  }, [timeOfDay, mood, isSpotifyConnected]);

  const searchForPlaylist = async () => {
    setLoading(true);
    try {
      const searchQuery = getSearchQuery(timeOfDay, mood);
      const playlists = await spotifyService.searchPlaylists(searchQuery);
      
      if (playlists.length > 0) {
        const selectedPlaylist = playlists[0];
        setPlaylist(selectedPlaylist);
        
        // Fetch tracks for the playlist
        const playlistTracks = await spotifyService.getPlaylistTracks(selectedPlaylist.id);
        setTracks(playlistTracks);
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSearchQuery = (time: TimeOfDay, mood: Mood): string => {
    const queries = {
      morning: {
        sad: 'morning sad acoustic chill',
        optimistic: 'morning motivation uplifting',
        happy: 'morning energy happy upbeat'
      },
      afternoon: {
        sad: 'afternoon melancholy contemplative',
        optimistic: 'afternoon motivation focus',
        happy: 'afternoon happy sunshine'
      },
      night: {
        sad: 'evening night sad peaceful',
        optimistic: 'night hopeful relaxing',
        happy: 'night celebration party'
      }
    };
    return queries[time][mood];
  };

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

  const currentData = isSpotifyConnected && playlist ? {
    name: playlist.name,
    description: playlist.description || 'Spotify playlist',
    tracks: tracks.map(track => `${track.name} - ${track.artists.map(a => a.name).join(', ')}`),
    duration: `${tracks.length} tracks`,
    spotifyUrl: playlist.external_urls.spotify,
    image: playlist.images[0]?.url
  } : mockPlaylists[timeOfDay][mood];

  if (loading && isSpotifyConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`bg-gradient-to-br ${getPlaylistGradient()} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Finding the perfect playlist for your mood...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-gradient-to-br ${getPlaylistGradient()} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            {currentData.image && (
              <img 
                src={currentData.image} 
                alt="Playlist cover" 
                className="w-16 h-16 rounded-lg mb-4 object-cover"
              />
            )}
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentData.name}
            </h3>
            <p className="text-white/70 mb-4">
              {currentData.description}
            </p>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentData.duration}
              </div>
              <div className="flex items-center gap-1">
                {currentData.tracks.length} tracks
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
          {isSpotifyConnected && currentData.spotifyUrl ? (
            <>
              Play on Spotify
              <ExternalLink className="w-4 h-4" />
            </>
          ) : (
            'Play on Spotify'
          )}
        </button>

        <div className="space-y-3">
          <h4 className="text-white font-semibold mb-3">Featured Tracks:</h4>
          {currentData.tracks.slice(0, 5).map((track, index) => (
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
            {isSpotifyConnected ? (
              <>
                <strong>Live Spotify Integration:</strong> Real playlists refreshed based on your mood and time of day.
              </>
            ) : (
              <>
                <strong>Demo Mode:</strong> Connect to Spotify above to get real playlists tailored to your mood.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
