
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
    const scope = 'playlist-read-private playlist-read-collaborative';
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  extractTokenFromUrl(): string | null {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  }
}

export const spotifyService = new SpotifyService();
export type { SpotifyCredentials, SpotifyPlaylist, SpotifyTrack };
