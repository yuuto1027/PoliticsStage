const sounds: { [key: string]: HTMLAudioElement } = {};
const BASE_URL = 'https://cdn.pixabay.com/download/audio/2022/';

const soundFiles: { [key: string]: string } = {
  click: '05/05/audio_1688d22d7c.mp3',
  next_turn: '08/04/audio_2dde625aa9.mp3',
  success: '02/16/audio_5c5a818de1.mp3',
  failure: '05/03/audio_a70d5a363a.mp3',
  event: '09/06/audio_946891322b.mp3',
  action: '01/25/audio_5119b96e95.mp3',
};

// Preload audio files only in a browser environment
if (typeof window !== 'undefined') {
    Object.keys(soundFiles).forEach(key => {
        const audio = new Audio(`${BASE_URL}${soundFiles[key]}`);
        audio.volume = 0.3;
        sounds[key] = audio;
    });
}

type SoundType = 'click' | 'next_turn' | 'success' | 'failure' | 'event' | 'action';

const playSound = (sound: SoundType): void => {
  if (sounds[sound]) {
    sounds[sound].currentTime = 0;
    const playPromise = sounds[sound].play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay was prevented. This is common in browsers and requires user interaction.
        console.warn(`Audio playback for "${sound}" was prevented.`, error);
      });
    }
  }
};

export default playSound;
