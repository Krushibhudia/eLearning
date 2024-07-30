
import React from 'react';
import { getYouTubeVideoId } from './utils';

const VideoPlayer = ({ mediaUrl, title }) => {
  const videoId = getYouTubeVideoId(mediaUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return embedUrl ? (
    <div className="video-container">
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title={`${title} Video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  ) : null;
};

export default VideoPlayer;
