import { writable } from 'svelte/store';
import Player from './moralisobjects/player';

export const authStore = createAuthStore();

export const isAuthenticated = writable(false);
export const user = writable(null);

function createAuthStore() {
  let auth = null;

  function init(provider) {
    // TODO: Hardcoded for Moralis for now. Add other providers as needed

    if (provider.toLowerCase() === 'moralis') {
      auth = window.Moralis;

      const serverUrl = import.meta.env.CLIENT_MORALIS_SERVER_URL;
      const appId = import.meta.env.CLIENT_MORALIS_APP_ID;
      auth.start({ serverUrl, appId });
    }
  }

  async function connect() {
    let user_ = auth.User.current();
    if (!user_) {
      user_ = await authenticate();
      await user_.fetch();
    }
    isAuthenticated.set(true);
    user.set(user_);
    console.log('logged in user:', user_);
  }

  async function disconnect() {
    await auth.User.logOut();
    isAuthenticated.set(false);
    user.set(null);

    console.log('logged out');
  }

  async function authenticate() {
    let user_;

    const options = {
      signingMessage: 'Sign in to Our Worlds',
    };

    try {
      if (typeof web3 !== 'undefined') {
        user_ = await auth.authenticate(options);
      } else {
        options.provider = 'walletconnect';
        user_ = await auth.authenticate(options);
      }
    } catch (error) {
      console.error('authenticate failed', error);
      throw new Error(error);
    }
    console.log(auth.User.current());
    return user_;
  }

  return { auth, connect, disconnect, init };
}
