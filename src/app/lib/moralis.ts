import Moralis from 'moralis';

let isInitialized = false;

export const initMoralis = async () => {
  try {
    if (!isInitialized) {
      await Moralis.start({
        apiKey: process.env.MORALIS_KEY,
      });
      isInitialized = true;
      console.log('Moralis initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Moralis', error);
  }
};