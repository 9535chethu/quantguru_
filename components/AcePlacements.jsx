import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LearningModule.css';

const API_URL = 'http://localhost/quantguru/api/phpapi.php';

function AcePlacements() {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [visibleItems, setVisibleItems] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryId = 4; // Update this as needed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(API_URL, {
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
            setVisibleItems((prev) => [...prev, entry.target.dataset.index]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.content-block').forEach((block, index) => {
      block.dataset.index = index;
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
    <div className="learning-module company-specific-training">
      <div className='header-block animate-fade-in'>
        <div className='text-container'>
          <h1 className="animate-slide-down"><b>Company Specific Training</b></h1>
          <p className="animate-slide-up">
            "Empower your future with customized training designed just for you! Unlock your potential and excel in your studies with personalized programs crafted for student success."
          </p>
        </div>
        <div className='image-container animate-scale-in'>
          <img
            src='https://create.microsoft.com/_next/image?url=https%3A%2F%2Fdsgrcdnblobprod5u3.azureedge.net%2Fcmsassets%2FLogoDesign-02-Logos.webp&w=1920&q=75'
            alt='Company Specific Training'
          />
        </div>
      </div>
      <div className="content-container">
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && !error && contentItems.length === 0 && <p>No content available.</p>}
        {contentItems.map((block, index) => (
          <div 
            className={`content-block ${visibleItems.includes(index.toString()) ? 'animate-fade-in' : ''}`}
            key={index}
            data-index={index}
          >
            <div className='content-image'>
              <img
                src={block.thumbnail} // Ensure this key matches your API response
                alt={block.title}
                onClick={() => playVideo(block.url)} // Ensure this key matches your API response
              />
            </div>
            <div className='content-text'>
              <p>{block.title}
                <a href="#">{block.subtitle}</a>
              </p>
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

export default AcePlacements;
