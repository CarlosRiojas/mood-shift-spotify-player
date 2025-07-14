
import { useState, useEffect } from 'react';
import { spotifyService, SpotifyCredentials } from '@/services/spotifyService';
import { Input } from '@/components/ui/input';
import { Music, LogOut, ExternalLink } from 'lucide-react';

interface SpotifyAuthProps {
  onAuthChange: (isAuthenticated: boolean) => void;
}

export const SpotifyAuth = ({ onAuthChange }: SpotifyAuthProps) => {
  const [credentials, setCredentials] = useState<SpotifyCredentials | null>(null);
  const [clientId, setClientId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualToken, setManualToken] = useState('');

  useEffect(() => {
    // Check for existing credentials
    const existingCredentials = spotifyService.getCredentials();
    if (existingCredentials) {
      setCredentials(existingCredentials);
      onAuthChange(true);
    }

    // Check for token in URL (from OAuth redirect)
    const token = spotifyService.extractTokenFromUrl();
    if (token && clientId) {
      const newCredentials = { clientId, accessToken: token };
      spotifyService.setCredentials(newCredentials);
      setCredentials(newCredentials);
      onAuthChange(true);
      
      // Clean up URL
      window.location.hash = '';
    }
  }, [clientId, onAuthChange]);

  const handleOAuthLogin = () => {
    if (!clientId.trim()) {
      alert('Please enter your Spotify Client ID first');
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;
    const authUrl = spotifyService.generateAuthUrl(clientId, redirectUri);
    window.location.href = authUrl;
  };

  const handleManualLogin = () => {
    if (!clientId.trim() || !manualToken.trim()) {
      alert('Please enter both Client ID and Access Token');
      return;
    }

    const newCredentials = { clientId, accessToken: manualToken };
    spotifyService.setCredentials(newCredentials);
    setCredentials(newCredentials);
    onAuthChange(true);
  };

  const handleLogout = () => {
    spotifyService.clearCredentials();
    setCredentials(null);
    setClientId('');
    setManualToken('');
    onAuthChange(false);
  };

  if (credentials) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Connected to Spotify</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Music className="w-5 h-5" />
        Connect to Spotify
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-2">
            Spotify Client ID
          </label>
          <Input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter your Spotify app Client ID"
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleOAuthLogin}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Authorize with Spotify
          </button>
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
          >
            Manual
          </button>
        </div>

        {showManualInput && (
          <div className="space-y-3 pt-4 border-t border-white/20">
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Access Token
              </label>
              <Input
                type="text"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste your access token here"
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
            <button
              onClick={handleManualLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Connect Manually
            </button>
          </div>
        )}

        <div className="text-xs text-white/60 space-y-1">
          <p>• Create a Spotify app at developer.spotify.com</p>
          <p>• Add this URL as redirect URI: {window.location.origin}{window.location.pathname}</p>
          <p>• Get your Client ID from the app dashboard</p>
        </div>
      </div>
    </div>
  );
};
