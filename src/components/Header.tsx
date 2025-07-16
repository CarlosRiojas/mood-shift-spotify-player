import React from 'react';
import { useAuth } from './SpotifyAuth'; // Import the hook to access context

export const Header = () => {
  // Use the hook to get the token and the logout function from the context
  const { token, logout } = useAuth();

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Spotify Moods</h1>
        <p className="text-white/70">Find the perfect soundtrack for your moment.</p>
      </div>
      
      {/* Conditionally render the logout button only if a token exists */}
      {token && (
        <button
          onClick={logout}
          className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      )}
    </header>
  );
};