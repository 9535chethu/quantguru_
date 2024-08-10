import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LearningModule.css';

const API_PATH = 'http://localhost/quantguru/';
const API_URL2 = API_PATH + 'api/phpapi.php';

function ArithmeticProblems() {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [visibleItems, setVisibleItems] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryId = 1; // Update this as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(API_URL2, {
          action: 'get-videos-by-category',
          category_id: categoryId
        });
        if (response.data.success) {
          setContentItems(response.data.videos);
        } else {
          console.error('Error fetching data:', response.data.message);
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (contentItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...prev, Number(entry.target.dataset.index)]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.content-block').forEach((block) => {
      observer.observe(block);
    });

    return () => observer.disconnect();
  }, [contentItems]);

  const playVideo = (url) => {
    const videoId = url.split('v=')[1].split('&')[0];
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    setVideoUrl(embedUrl);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setVideoUrl('');
  };

  return (
    <div className="learning-module arithmetic-problems">
      <div className='header-block animate-fade-in'>
        <div className='text-container'>
          <h1 className="animate-slide-down">Speed Maths</h1>
          <p className="animate-slide-up">"Enhance math proficiency with our interactive online learning module, designed for effective skill mastery."</p>
        </div>
        <div className='image-container animate-scale-in'>
          <img
            src='https://e7.pngegg.com/pngimages/430/779/png-clipart-mathematical-equations-illustration-mathematics-formula-equation-mathematical-notation-mathematics-cdr-angle.png'
            alt='Mathematical equations'
            onClick={() => playVideo('https://www.youtube.com/watch?v=X8mLL__9FmQ&list=PLyV06iJG9PI_gfBXYMbYkMCnVLw0d-IOy&index=1&ab_channel=QuantGuru')}
          />
        </div>
      </div>
      <div className="content-container">
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && !error && contentItems.length === 0 && <p>No content available.</p>}
        {contentItems.map((item, index) => (
          <div 
            className={`content-block ${visibleItems.includes(index) ? 'animate-fade-in' : ''}`} 
            key={index}
            data-index={index}
          >
            <div className='content-image'>
              <img
                src={`${API_PATH}${item.thumbnail}`} 
                alt={item.title}
                onClick={() => playVideo(item.url)} // Ensure this key matches your API response
              />
            </div>
            <div className='content-text'>
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {showVideo && (
        <div className="video-popup animate-fade-in">
          <div className="video-popup-content animate-scale-in">
            <span className="close" onClick={closeVideo}>&times;</span>
            <iframe
              width="560"
              height="315"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArithmeticProblems;
