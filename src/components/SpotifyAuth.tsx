import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import axios from 'axios';

// --- Auth Context Setup ---
// The AuthContextType interface now correctly includes the 'logout' function.
interface AuthContextType {
  token: string | null;
  deviceId: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a SpotifyAuth provider");
    }
    return context;
};

// --- Constants & Helpers ---
const CLIENT_ID = "cb8e977a112143c48a31e2834559bd1b"; 
const REDIRECT_URI = "http://127.0.0.1:8088";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SCOPES = [
    "user-read-private", 
    "user-read-email", 
    "user-top-read", 
    "playlist-read-private",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state"
];

const generateCodeVerifier = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const generateCodeChallenge = async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

// --- Auth Guard Component ---
interface SpotifyAuthProps {
  children: React.ReactNode;
}

export function SpotifyAuth({ children }: SpotifyAuthProps) {
    const [token, setToken] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getAccessToken = useCallback(async (code: string) => {
        const verifier = localStorage.getItem("verifier");
        if (!verifier) {
            console.error("Code verifier not found.");
            setLoading(false);
            return;
        }
        try {
            const params = new URLSearchParams();
            params.append("client_id", CLIENT_ID);
            params.append("grant_type", "authorization_code");
            params.append("code", code);
            params.append("redirect_uri", REDIRECT_URI);
            params.append("code_verifier", verifier);
            const result = await axios.post(TOKEN_ENDPOINT, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            window.localStorage.setItem("spotify_token", result.data.access_token);
            setToken(result.data.access_token);
        } catch (error) {
            console.error("Error fetching access token:", error);
        } finally {
            window.history.pushState({}, '', REDIRECT_URI);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setDeviceId(null);
        window.localStorage.removeItem("spotify_token");
        console.log("User logged out, token cleared.");
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const storedToken = window.localStorage.getItem("spotify_token");
        if (code) {
            getAccessToken(code);
        } else if (storedToken) {
            setToken(storedToken);
        } else {
            setLoading(false);
        }
    }, [getAccessToken]);

    useEffect(() => {
        if (!token) {
            if (loading) setLoading(false);
            return;
        };

        const playerScript = document.getElementById('spotify-player-script');
        if (!playerScript) {
            const script = document.createElement("script");
            script.id = 'spotify-player-script';
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            document.body.appendChild(script);
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Mood Shift Player',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });
            player.addListener('ready', ({ device_id }) => {
                console.log('Spotify Player is ready with Device ID', device_id);
                setDeviceId(device_id);
                setLoading(false);
            });
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setDeviceId(null);
            });
            player.addListener('initialization_error', ({ message }) => { console.error('Failed to initialize', message); setLoading(false); logout(); });
            player.addListener('authentication_error', ({ message }) => { console.error('Failed to authenticate', message); setLoading(false); logout(); });
            player.addListener('account_error', ({ message }) => { console.error('Account error', message); setLoading(false); });
            player.connect();
        };
    }, [token, loading, logout]);

    const redirectToSpotify = async () => {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);
        localStorage.setItem("verifier", verifier);
        const params = new URLSearchParams();
        params.append("client_id", CLIENT_ID);
        params.append("response_type", "code");
        params.append("redirect_uri", REDIRECT_URI);
        params.append("scope", SCOPES.join(' '));
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
        document.location = `${AUTH_ENDPOINT}?${params.toString()}`;
    };

    if (loading) {
        return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Loading Spotify Player...</p></div>;
    }

    if (!token) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans">
                <div className="w-full max-w-md mx-auto text-center">
                    <header className="mb-8"><h1 className="text-4xl md:text-5xl font-bold text-green-500 mb-2">Mood Shift</h1><p className="text-gray-400">Your Spotify, Your Vibe.</p></header>
                    <button onClick={redirectToSpotify} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105">Login with Spotify</button>
                </div>
            </div>
        );
    }

    // The provider's value now correctly matches the AuthContextType interface.
    return (
        <AuthContext.Provider value={{ token, deviceId, logout }}>
            {children}
        </AuthContext.Provider>
    );
}