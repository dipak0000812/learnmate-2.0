// src/services/oauthService.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const oauthService = {
  // Google OAuth
  loginWithGoogle: async () => {
    try {
      // Option 1: Redirect to backend OAuth endpoint
      // window.location.href = `${API_URL}/api/auth/google`;
      
      // Option 2: Use popup window
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        `${API_URL}/api/auth/google`,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      return new Promise((resolve, reject) => {
        const checkPopup = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);

        window.addEventListener('message', (event) => {
          if (event.origin !== API_URL) return;
          
          clearInterval(checkPopup);
          popup?.close();
          
          if (event.data.success) {
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Authentication failed'));
          }
        });
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  },

  // GitHub OAuth
  loginWithGitHub: async () => {
    try {
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        `${API_URL}/api/auth/github`,
        'GitHub Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      return new Promise((resolve, reject) => {
        const checkPopup = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);

        window.addEventListener('message', (event) => {
          if (event.origin !== API_URL) return;
          
          clearInterval(checkPopup);
          popup?.close();
          
          if (event.data.success) {
            resolve(event.data);
          } else {
            reject(new Error(event.data.error || 'Authentication failed'));
          }
        });
      });
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
  },

  // Handle OAuth callback (for popup method)
  handleOAuthCallback: (token, user) => {
    // Send data back to parent window
    if (window.opener) {
      window.opener.postMessage(
        { success: true, token, user },
        window.location.origin
      );
      window.close();
    }
  }
};

export default oauthService;