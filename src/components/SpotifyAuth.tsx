
import { useState, useEffect } from 'react';
import { spotifyService, SpotifyCredentials } from '@/services/spotifyService';
import { Input } from '@/components/ui/input';
import { Music, LogOut, ExternalLink, AlertCircle } from 'lucide-react';

interface SpotifyAuthProps {
  onAuthChange: (isAuthenticated: boolean) => void;
}

export const SpotifyAuth = ({ onAuthChange }: SpotifyAuthProps) => {
  const [credentials, setCredentials] = useState<SpotifyCredentials | null>(null);
  const [clientId, setClientId] = useState('');
  const [showManualInput, setShowManualInput] = useState(true);
  const [manualToken, setManualToken] = useState('');
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing credentials
    const existingCredentials = spotifyService.getCredentials();
    if (existingCredentials) {
      setCredentials(existingCredentials);
      onAuthChange(true);
    }

    // Check for authorization code in URL
    const code = spotifyService.extractCodeFromUrl();
    if (code) {
      setAuthCode(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onAuthChange]);

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
    setAuthCode(null);
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
      
      {authCode && (
        <div className="mb-4 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-white">
              <p className="font-medium mb-2">Authorization Code Received!</p>
              <p className="text-sm text-white/80 mb-3">
                For security reasons, exchanging the authorization code for an access token requires a backend server. 
                For this demo, please get your access token manually:
              </p>
              <ol className="text-sm text-white/80 space-y-1 ml-4">
                <li>1. Go to <a href="https://developer.spotify.com/console/get-playlists/" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">Spotify Web API Console</a></li>
                <li>2. Click "Get Token" and authorize</li>
                <li>3. Copy the access token and paste it below</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
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
            disabled={!clientId.trim()}
          >
            <ExternalLink className="w-4 h-4" />
            Authorize with Spotify
          </button>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/20">
          <div>
            <label className="block text-white/80 text-sm mb-2">
              Access Token (Manual Input)
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
            Connect with Token
          </button>
        </div>

        <div className="text-xs text-white/60 space-y-1">
          <p><strong>Setup Instructions:</strong></p>
          <p>• Create a Spotify app at <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">developer.spotify.com</a></p>
          <p>• Add this URL as redirect URI: <code className="bg-white/10 px-1 rounded">{window.location.origin}{window.location.pathname}</code></p>
          <p>• For quick testing, get a token from the <a href="https://developer.spotify.com/console/get-playlists/" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">Web API Console</a></p>
        </div>
      </div>
    </div>
  );
};
