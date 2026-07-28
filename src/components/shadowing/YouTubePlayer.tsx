import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface YouTubePlayerProps {
  youtubeId: string;
  onTimeUpdate?: (currentTime: number) => void;
  seekTime?: number | null;
  isPlaying?: boolean;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  youtubeId,
  onTimeUpdate,
  seekTime,
  isPlaying = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Synchronize iframe video seek when seekTime changes
  useEffect(() => {
    if (seekTime !== null && seekTime !== undefined && iframeRef.current) {
      const command = JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [seekTime, true],
      });
      iframeRef.current.contentWindow?.postMessage(command, '*');

      const playCommand = JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: [],
      });
      iframeRef.current.contentWindow?.postMessage(playCommand, '*');
      setInternalIsPlaying(true);
    }
  }, [seekTime]);

  // Synchronize Play / Pause state
  useEffect(() => {
    if (iframeRef.current) {
      const func = isPlaying ? 'playVideo' : 'pauseVideo';
      const command = JSON.stringify({
        event: 'command',
        func,
        args: [],
      });
      iframeRef.current.contentWindow?.postMessage(command, '*');
      setInternalIsPlaying(isPlaying);
    }
  }, [isPlaying]);

  // Track playback time via window message listener or interval fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (internalIsPlaying && onTimeUpdate && iframeRef.current) {
        // Request current time from YouTube iframe API
        const command = JSON.stringify({
          event: 'command',
          func: 'getCurrentTime',
          args: [],
        });
        iframeRef.current.contentWindow?.postMessage(command, '*');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [internalIsPlaying, onTimeUpdate]);

  // Handle postMessage response from YouTube iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          if (data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
            if (onTimeUpdate) {
              onTimeUpdate(data.info.currentTime);
            }
          }
        }
      } catch (e) {
        // Ignore non-json messages from other extensions/iframes
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onTimeUpdate]);

  const togglePlay = () => {
    if (!iframeRef.current) return;
    const nextState = !internalIsPlaying;
    const func = nextState ? 'playVideo' : 'pauseVideo';
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*'
    );
    setInternalIsPlaying(nextState);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [speed] }),
        '*'
      );
    }
  };

  const iframeSrc = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&origin=${encodeURIComponent(
    window.location.origin
  )}&rel=0&modestbranding=1`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Video Container */}
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#000',
        }}
      >
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          title="YouTube Video Player"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Embedded Quick Player Controls Bar */}
      <div
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="primary" size="sm" icon={internalIsPlaying ? <Pause size={16} /> : <Play size={16} />} onClick={togglePlay}>
            {internalIsPlaying ? 'Tạm Dừng' : 'Phát Video'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw size={16} />}
            onClick={() => {
              if (seekTime !== null && seekTime !== undefined) {
                iframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ event: 'command', func: 'seekTo', args: [seekTime, true] }),
                  '*'
                );
              }
            }}
          >
            Phát Lại Câu
          </Button>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tốc độ:</span>
          {[0.75, 1.0, 1.25].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              style={{
                background: playbackRate === rate ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)',
                color: playbackRate === rate ? '#000' : 'var(--text-primary)',
                border: 'none',
                padding: '0.25rem 0.6rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
