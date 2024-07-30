
const fetchYouTubeEmbedUrl = async (videoId) => {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key='AIzaSyCBDwchXmLCefO05O5W-ge1aX3FicsOmCQ'&part=player`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const embedUrl = data.items[0].player.embedHtml;
        return embedUrl;
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      return null;
    }
  };
  
  export default fetchYouTubeEmbedUrl;
  