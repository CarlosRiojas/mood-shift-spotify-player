import axios from 'axios';

const API_BASE_URL = 'https://api.spotify.com/v1';

// --- Type Definitions ---
// Note the addition of the 'uri' property to SpotifyTrack, which is essential for playback.
export interface SpotifyImage { url: string; }
export interface SpotifyArtist { name: string; }
export interface SpotifyTrack { 
  id: string; 
  name: string; 
  artists: SpotifyArtist[]; 
  uri: string; 
  duration_ms: number; 
}
export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  external_urls: {
    spotify: string;
  };
}


// --- API Client ---
/**
 * Creates a reusable Axios instance with the necessary auth header.
 * @param token The Spotify access token.
 * @returns An Axios instance configured with the authentication header.
 */
const getApiClient = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// --- Service Functions ---

/**
 * Searches for tracks on Spotify based on a query.
 * @param query The search query string.
 * @param token The user's access token.
 * @returns A promise that resolves to an array of tracks.
 */
const searchTracks = async (query: string, token: string): Promise<SpotifyTrack[]> => {
  const apiClient = getApiClient(token);
  try {
    const response = await apiClient.get('/search', {
      params: { 
        q: query, 
        type: 'track', 
        limit: 50 // Fetch up to 50 tracks to build a good playlist
      }, 
    });
    return response.data.tracks.items;
  } catch (error) {
    console.error('Error in spotifyService searching for tracks:', error);
    throw error;
  }
};

/**
 * Starts or resumes playback on a specific device.
 * @param token The user's access token.
 * @param deviceId The ID of the device to play on (from the Web Playback SDK).
 * @param trackUris An array of Spotify Track URIs to play.
 */
const playTracks = async (token: string, deviceId: string, trackUris: string[]) => {
    const apiClient = getApiClient(token);
    try {
        // This command tells the Spotify API to start playing the provided tracks on the specified device.
        await apiClient.put(`/me/player/play?device_id=${deviceId}`, {
            uris: trackUris,
        });
    } catch (error) {
        console.error('Error starting playback:', error);
        throw error;
    }
};


export const spotifyService = {
  searchTracks,
  playTracks,
};


