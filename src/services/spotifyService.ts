import axios, { isAxiosError } from 'axios';

const API_BASE_URL = 'https://api.spotify.com/v1';

// --- Type Definitions ---
export interface SpotifyImage { url: string; }
export interface SpotifyArtist { name: string; }
export interface SpotifyTrack { 
  id: string; 
  name: string; 
  artists: SpotifyArtist[]; 
  uri: string; 
  duration_ms: number; 
}

// --- API Client ---
const getApiClient = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

// --- Service Functions ---

const searchTracks = async (query: string, token: string): Promise<SpotifyTrack[]> => {
  const apiClient = getApiClient(token);
  try {
    const response = await apiClient.get('/search', {
      params: { q: query, type: 'track', limit: 50 },
    });
    return response.data.tracks.items;
  } catch (error) {
    console.error('Error in spotifyService searching for tracks:', error);
    throw error;
  }
};

const playTracks = async (token: string, deviceId: string, trackUris: string[]) => {
    const apiClient = getApiClient(token);
    try {
        await apiClient.put(`/me/player/play?device_id=${deviceId}`, {
            uris: trackUris,
        });
    } catch (error) {
        console.error('Error in spotifyService starting playback:', error);
        throw error;
    }
};

/**
 * Pauses the user's currently active player.
 * @param token The user's access token.
 * @param deviceId The ID of the device to pause.
 */
const pausePlayback = async (token: string, deviceId: string) => {
    const apiClient = getApiClient(token);
    try {
        await apiClient.put(`/me/player/pause?device_id=${deviceId}`);
    } catch (error) {
        console.error('Error in spotifyService pausing playback:', error);
        throw error;
    }
};

export const spotifyService = {
  searchTracks,
  playTracks,
  pausePlayback, // Export the new function
};



