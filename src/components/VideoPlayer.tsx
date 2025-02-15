import React, { useState, useEffect } from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, onClose }) => {
  const [isError, setIsError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [iframeKey, setIframeKey] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    console.log('Video URL changed:', url);
    setCurrentUrl(url);
    setIsError(false);
    setErrorDetails('');
    setRetryCount(0);
  }, [url]);

  const handleError = () => {
    console.error('Video player failed to load:', currentUrl);
    setErrorDetails(currentUrl);
    setIsError(true);
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setIsError(false);
      setIframeKey(prev => prev + 1);
      
      // Add a small delay before retry
      setTimeout(() => {
        // Try to reload with a slightly modified URL to bypass cache
        const timestamp = new Date().getTime();
        setCurrentUrl(`${url}${url.includes('?') ? '&' : '?'}_t=${timestamp}`);
      }, 1000);
    }
  };

  const handleLoad = () => {
    console.log('Video player loaded:', currentUrl);
    // Remove the iframe content check as it's not necessary and causes CORS errors
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
        aria-label="Close video player"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="w-full h-full max-w-7xl max-h-[80vh] p-4">
        {isError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
            <div className="text-center text-white">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Playback Error</h3>
              <div className="text-sm text-gray-400 mb-4">
                <p className="mb-2">The video is currently unavailable.</p>
                {errorDetails && <p className="text-xs break-all">Failed URL: {errorDetails}</p>}
                <p className="text-xs">Retry count: {retryCount}/{MAX_RETRIES}</p>
              </div>
              {retryCount < MAX_RETRIES ? (
                <button 
                  onClick={handleRetry}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center mx-auto gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Playback
                </button>
              ) : (
                <button 
                  onClick={onClose}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Close Player
                </button>
              )}
            </div>
          </div>
        ) : (
          <iframe
            key={iframeKey}
            src={currentUrl}
            className="w-full h-full rounded-lg"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-modals allow-top-navigation"
            loading="lazy"
            onError={handleError}
            onLoad={handleLoad}
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;