import React, { useState, useEffect } from 'react';
import './Resource.css';

// Sample video data (replace with actual data or API call)
const videoData = {
  educational: [
    { title: 'Math Basics', videoUrl: 'https://www.youtube.com/embed/64643Op6WJo?si=uQPSrIZM7rOJDYcq' },
    { title: 'Science Experiments', videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY' },
  ],
  extracurricular: [
    { title: 'Football Skills', videoUrl: 'https://www.youtube.com/embed/KV5yM3iI8Qw' },
    { title: 'Painting Tutorial', videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwJQ' },
  ],
};

// Subtitle data (you can use an API to get this data dynamically)
const subtitles = {
  'https://www.youtube.com/embed/64643Op6WJo?si=uQPSrIZM7rOJDYcq': {
    English: [
      'Welcome to Math Basics!',
      'Learn addition, subtraction, multiplication, and division.',
    ],
    Hindi: [
      'गणित की मूल बातें जानें!',
      'जोड़, घटाना, गुणा और भाग सीखें।',
    ],
  },
  'https://www.youtube.com/embed/tgbNymZ7vqY': {
    English: [
      'This is a science experiment.',
      'Understand the chemical reaction principles.',
    ],
    Hindi: [
      'यह एक विज्ञान प्रयोग है।',
      'रासायनिक प्रतिक्रियाओं के सिद्धांतों को समझें।',
    ],
  },
  'https://www.youtube.com/embed/KV5yM3iI8Qw': {
    English: [
      'Football skills practice.',
      'Improve your passing and dribbling techniques.',
    ],
    Hindi: [
      'फुटबॉल कौशल अभ्यास।',
      'अपने पासिंग और ड्रिब्लिंग कौशल में सुधार करें।',
    ],
  },
  'https://www.youtube.com/embed/3JZ_D3ELwJQ': {
    English: [
      'Basic painting tutorial.',
      'Learn brush techniques and color blending.',
    ],
    Hindi: [
      'बुनियादी पेंटिंग ट्यूटोरियल।',
      'ब्रश तकनीक और रंग मिश्रण सीखें।',
    ],
  },
};

const Resource = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [subtitlesToShow, setSubtitlesToShow] = useState([]);
  const [subtitlesIndex, setSubtitlesIndex] = useState(0);

  // Handle activity type change
  const handleActivityChange = (e) => {
    const activity = e.target.value;
    setSelectedActivity(activity);
    filterVideosByLanguage(activity, selectedLanguage);
  };

  // Handle language change for subtitles
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    filterVideosByLanguage(selectedActivity, e.target.value);
  };

  // Filter videos based on selected language
  const filterVideosByLanguage = (activity, language) => {
    const filteredVideos = videoData[activity]?.filter((video) => {
      return subtitles[video.videoUrl] && subtitles[video.videoUrl][language];
    }) || [];
    setSelectedVideos(filteredVideos);
  };

  // Handle video play and show subtitles
  const handleVideoPlay = (videoUrl) => {
    setIsVideoPlaying(true);
    setCurrentVideo(videoUrl);
    setSubtitlesIndex(0); // Reset subtitle index when a new video starts
    updateSubtitles(selectedLanguage);
  };

  // Update subtitles based on selected language
  const updateSubtitles = (language) => {
    if (subtitles[currentVideo] && subtitles[currentVideo][language]) {
      setSubtitlesToShow(subtitles[currentVideo][language]);
    }
  };

  // Display subtitles in sync with video (simple implementation)
  useEffect(() => {
    if (isVideoPlaying && subtitlesToShow.length > 0) {
      const interval = setInterval(() => {
        if (subtitlesIndex < subtitlesToShow.length) {
          setSubtitlesIndex((prev) => prev + 1);
        } else {
          clearInterval(interval);
        }
      }, 3000); // Show subtitle every 3 seconds (this can be adjusted)

      return () => clearInterval(interval);
    }
  }, [isVideoPlaying, subtitlesToShow, subtitlesIndex]);

  return (
    <div className="resource-container">
      <h1 className="title">Activity Resource</h1>

      {/* Search bar for selecting an activity */}
      <div className="search-bar">
        <label htmlFor="activity-select">Select Activity Type:</label>
        <input
          type="text"
          id="activity-select"
          list="activity-suggestions"
          value={selectedActivity}
          onChange={handleActivityChange}
          placeholder="Search and select an activity"
        />
        <datalist id="activity-suggestions">
          <option value="educational" />
          <option value="extracurricular" />
        </datalist>
      </div>

      {/* Language selection */}
      <div className="language-selection">
        <label htmlFor="language-select">Select Language for Subtitles:</label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          {/* Add more languages here */}
        </select>
      </div>

      {/* Video list display */}
      <div className="video-list">
        {selectedVideos.length > 0 ? (
          selectedVideos.map((video, index) => (
            <div
              key={index}
              className="video-item"
              onClick={() => handleVideoPlay(video.videoUrl)}
            >
              <h3>{video.title}</h3>
              <p>Click to play</p>
            </div>
          ))
        ) : (
          <p>No videos found for this activity.</p>
        )}
      </div>

      {/* Video player */}
      {isVideoPlaying && (
        <div className="video-player">
          <button className="close-video" onClick={() => setIsVideoPlaying(false)}>
            X
          </button>
          <iframe
            src={currentVideo}
            width="100%"
            height="400"
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          {/* Display subtitles */}
          <div className="subtitles">
            {subtitlesToShow.length > 0 && subtitlesToShow[subtitlesIndex] && (
              <p>{subtitlesToShow[subtitlesIndex]}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resource;
