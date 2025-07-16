import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { TimeOfDay, Mood } from '@/pages/Index';
import { spotifyService, SpotifyTrack } from '@/services/spotifyService';
import { isAxiosError } from 'axios';
import { useAuth } from '@/components/SpotifyAuth';

// --- Helper Functions ---
const getSearchQuery = (time: TimeOfDay, mood: Mood): string => {
  const queries = {
    morning: { sad: 'rainy morning coffeehouse', optimistic: 'good morning positive start', happy: 'happy morning feel good' },
    afternoon: { sad: 'lo-fi beats chill study', optimistic: 'afternoon motivation focus', happy: 'sunshine vibes feel good afternoon' },
    night: { sad: 'late night sad vibes', optimistic: 'chill night relaxing hopeful', happy: 'night party hits' }
  };
  return queries[time][mood];
};

const getPlaylistGradient = (timeOfDay: TimeOfDay, mood: Mood): string => {
  const gradients = {
    morning: { sad: 'from-blue-400/20 to-gray-500/20', optimistic: 'from-yellow-400/20 to-orange-500/20', happy: 'from-pink-400/20 to-red-500/20' },
    afternoon: { sad: 'from-blue-500/20 to-purple-500/20', optimistic: 'from-green-400/20 to-blue-500/20', happy: 'from-yellow-400/20 to-pink-500/20' },
    night: { sad: 'from-indigo-600/20 to-purple-800/20', optimistic: 'from-purple-500/20 to-pink-500/20', happy: 'from-pink-500/20 to-red-600/20' }
  };
  return gradients[timeOfDay][mood];
};

// --- Component Definition ---
interface PlaylistDisplayProps {
  timeOfDay: TimeOfDay;
  mood: Mood;
  onAuthError: () => void;
}

export const PlaylistDisplay = ({ timeOfDay, mood, onAuthError }: PlaylistDisplayProps) => {
  const { token, deviceId } = useAuth();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const currentTrackIndexRef = useRef(0);

  const searchForTracks = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const searchQuery = getSearchQuery(timeOfDay, mood);
      const foundTracks = await spotifyService.searchTracks(searchQuery, token);
      
      if (foundTracks && foundTracks.length > 0) {
        setTracks(foundTracks.filter(track => track));
      } else {
        setTracks([]);
        setError("No tracks found for this mood. Try another combination!");
      }
    } catch (err) {
      console.error('Caught error in PlaylistDisplay:', err);
      let detailedError = "Could not fetch playlist data. Please try again later.";
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          detailedError = "Your session has expired. Please log in again.";
          onAuthError();
        } else if (err.response.data?.error?.message) {
          detailedError = `Spotify API Error: ${err.response.data.error.message}`;
        }
      }
      setError(detailedError);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [token, timeOfDay, mood, onAuthError]);

  useEffect(() => {
    if (token) {
      searchForTracks();
    }
  }, [token, searchForTracks]);

  const playTrack = async (trackIndex: number) => {
    if (!token || !deviceId || !tracks[trackIndex]) {
      setError("Spotify player not ready. Please ensure Spotify is active on a device.");
      return;
    }
    
    currentTrackIndexRef.current = trackIndex;
    const track = tracks[trackIndex];
    
    try {
      await spotifyService.playTracks(token, deviceId, [track.uri]);
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing track:", error);
      setError("Could not play track.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`bg-gradient-to-br ${getPlaylistGradient(timeOfDay, mood)} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Finding the perfect tracks for your mood...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className={`bg-gradient-to-br from-red-500/20 to-red-800/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
          <div className="text-center text-white">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
            <p className="text-white/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`bg-gradient-to-br ${getPlaylistGradient(timeOfDay, mood)} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">Your Custom Playlist</h3>
            <div className="flex items-center gap-2">
                <span className="text-white/70 text-sm">Autoplay</span>
                <button onClick={() => setIsAutoplay(!isAutoplay)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isAutoplay ? 'bg-green-500' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAutoplay ? 'transform translate-x-6' : ''}`}></div>
                </button>
            </div>
        </div>
        
        {currentTrack && (
            <div className="mb-6 p-4 rounded-lg bg-black/20 text-center">
                <p className="text-white/70 text-sm">Now Playing</p>
                <p className="text-white font-bold">{currentTrack.name}</p>
                <p className="text-white/80">{currentTrack.artists.map(a => a.name).join(', ')}</p>
            </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {tracks.length > 0 ? tracks.map((track, index) => (
            <div key={track.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white/70 text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-white/90 truncate">{track.name}</p>
                <p className="text-white/60 text-sm truncate">{track.artists.map(a => a.name).join(', ')}</p>
              </div>
              <button onClick={() => playTrack(index)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                {currentTrack?.id === track.id && isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>
            </div>
          )) : (
            <div className="text-center text-white/70 py-8">
              <p>No tracks found for this selection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

