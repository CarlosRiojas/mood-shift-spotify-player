
interface SpotifyCredentials {
  clientId: string;
  accessToken: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  tracks: {
    total: number;
  };
  images: Array<{
    url: string;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyTrack {
  name: string;
  artists: Array<{ name: string }>;
  id: string;
}

class SpotifyService {
  private credentials: SpotifyCredentials | null = null;

  setCredentials(credentials: SpotifyCredentials) {
    this.credentials = credentials;
    localStorage.setItem('spotify_credentials', JSON.stringify(credentials));
  }

  getCredentials(): SpotifyCredentials | null {
    if (this.credentials) return this.credentials;
    
    const stored = localStorage.getItem('spotify_credentials');
    if (stored) {
      this.credentials = JSON.parse(stored);
      return this.credentials;
    }
    
    return null;
  }

  clearCredentials() {
    this.credentials = null;
    localStorage.removeItem('spotify_credentials');
  }

  async searchPlaylists(query: string): Promise<SpotifyPlaylist[]> {
    const credentials = this.getCredentials();
    if (!credentials) throw new Error('No credentials available');

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search playlists');
    }

    const data = await response.json();
    return data.playlists.items;
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const credentials = this.getCredentials();
    if (!credentials) throw new Error('No credentials available');

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=10`, {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get playlist tracks');
    }

    const data = await response.json();
    return data.items.map((item: any) => item.track);
  }

  generateAuthUrl(clientId: string, redirectUri: string): string {
    const scope = 'playlist-read-private playlist-read-collaborative user-read-private';
    const state = Math.random().toString(36).substring(7);
    
    // Store state for verification
    localStorage.setItem('spotify_auth_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state: state,
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  extractCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');
    
    if (state && storedState && state === storedState) {
      localStorage.removeItem('spotify_auth_state');
      return code;
    }
    
    return null;
  }

  // Note: This would normally require a backend to exchange code for token
  // For demo purposes, we'll show instructions for manual token input
  async exchangeCodeForToken(code: string, clientId: string, redirectUri: string): Promise<string | null> {
    // This would normally be done on the backend for security
    console.log('Authorization code received:', code);
    console.log('You would normally exchange this on your backend for an access token');
    return null;
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyCredentials, SpotifyPlaylist, SpotifyTrack };
