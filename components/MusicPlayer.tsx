import React, { useState, useRef } from 'react';

const BGM_URL = 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_2dde625aa9.mp3';

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        // Initialize the Audio object on the first user interaction (click).
        // This is the most reliable way to comply with browser autoplay policies.
        if (!audioRef.current) {
            const audio = new Audio(BGM_URL);
            audio.loop = true;
            audio.volume = 0.15;
            audioRef.current = audio;
        }

        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    // This catch block is important for handling cases where playback fails.
                    console.warn("BGMの再生に失敗しました。ユーザーによる操作が必要です。", error);
                    setIsPlaying(false);
                });
            }
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={togglePlay}
                className="w-12 h-12 bg-gray-700/50 hover:bg-gray-600/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
                aria-label={isPlaying ? '音楽をミュート' : '音楽を再生'}
            >
                {isPlaying ? <UnmutedIcon /> : <MutedIcon />}
            </button>
        </div>
    );
};

const MutedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l-4-4m0 4l4-4" />
    </svg>
);

const UnmutedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);


export default MusicPlayer;