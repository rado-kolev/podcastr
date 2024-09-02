'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useAudio } from '@/providers/AudioProvider';

import { Progress } from './ui/progress';
import { formatTime } from '@/lib/formatTime';

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Initialize visibility to false
  const { audio, clearAudio } = useAudio();

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 5,
        audioRef.current.duration
      );
    }
  };

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 5,
        0
      );
    }
  };

  const closePlayer = () => {
    setIsVisible(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    clearAudio(); // Clear the audio when the player is closed
  };

  useEffect(() => {
    if (audio?.audioUrl) {
      setIsVisible(true); // Show the player when there is an audio
      const audioElement = audioRef.current;
      if (audioElement) {
        audioElement.src = audio.audioUrl;
        audioElement.load();
        audioElement.play().then(() => setIsPlaying(true));
        setDuration(audioElement.duration || 0);
        setCurrentTime(0);
      }
    } else {
      setIsVisible(false); // Hide the player when no audio is set
    }
  }, [audio]);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateCurrentTime);
      return () => {
        audioElement.removeEventListener('timeupdate', updateCurrentTime);
      };
    }
  }, [isVisible]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn('sticky bottom-0 left-0 flex size-full flex-col', {
        hidden: !audio?.audioUrl,
      })}
    >
      <Progress
        value={(currentTime / duration) * 100}
        className='w-full'
        max={duration}
      />
      <section className='glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12'>
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className='hidden'
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />

        <div className='flex items-center gap-4 max-md:hidden'>
          <Link href={`/podcast/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl! || '/images/player1.png'}
              width={64}
              height={64}
              alt='player1'
              className='aspect-square rounded-xl'
            />
          </Link>
          <div className='flex w-[160px] flex-col'>
            <h2 className='text-14 truncate font-semibold text-white-1'>
              {audio?.title}
            </h2>
            <p className='text-12 font-normal text-white-2'>{audio?.author}</p>
          </div>
        </div>

        <div className='flex-center cursor-pointer gap-3 md:gap-6'>
          <div className='flex items-center gap-1.5'>
            <Image
              src={'/icons/reverse.svg'}
              width={24}
              height={24}
              alt='rewind'
              onClick={rewind}
            />
            <h2 className='text-12 font-bold text-white-4'>-5</h2>
          </div>
          <Image
            src={isPlaying ? '/icons/Pause.svg' : '/icons/Play.svg'}
            width={30}
            height={30}
            alt='play'
            onClick={togglePlayPause}
          />
          <div className='flex items-center gap-1.5'>
            <h2 className='text-12 font-bold text-white-4'>+5</h2>
            <Image
              src={'/icons/forward.svg'}
              width={24}
              height={24}
              alt='forward'
              onClick={forward}
            />
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2 max-md:hidden'>
            <h2 className='text-16 font-normal text-white-2'>
              {formatTime(currentTime)}
            </h2>
            <span className='text-16 font-normal text-white-2'>/</span>
            <h2 className='text-16 font-normal text-white-2'>
              {formatTime(duration)}
            </h2>
          </div>

          <div className='flex w-full gap-2'>
            <Image
              src={isMuted ? '/icons/unmute.svg' : '/icons/mute.svg'}
              width={24}
              height={24}
              alt='mute unmute'
              onClick={toggleMute}
              className='cursor-pointer'
            />
          </div>
        </div>

        <div className='absolute top-2 right-2'>
          <Image
            src={'/icons/close.svg'}
            width={24}
            height={24}
            alt='close'
            onClick={closePlayer}
            className='cursor-pointer'
          />
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;
