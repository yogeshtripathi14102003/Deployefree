import React, { useRef, useEffect } from 'react';
import './ServicesPage.css';

const services = [
  { title: 'Website Development', icon: '/assets/icons/web-dev.svg', bgColor: '#2F80ED' },
  { title: 'AI Integration',        icon: '/assets/icons/ai.svg',     bgColor: '#FBBF24' },
//   { title: 'Digital Marketing',     icon: '/assets/icons/marketing.svg', bgColor: '#2F80ED' },
  // …add more as needed
];

const CARD_WIDTH = 240;    // must match CSS .service-card width
const CARD_GAP   = 24;     // must match CSS .services-slider gap
const AUTO_INTERVAL = 3000; // ms between auto-slides

const ServicesPage = () => {
  const sliderRef     = useRef(null);
  const intervalRef   = useRef(null);

  // Scroll by one card
  const scrollByOne = (direction = 1) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: direction * (CARD_WIDTH + CARD_GAP),
      behavior: 'smooth',
    });
  };

  // Auto-slide logic
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    intervalRef.current = setInterval(() => {
      // If we're at (or past) end, jump back to start
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByOne(1);
      }
    }, AUTO_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="services-page">
      {/* Left side content */}
      <div className="services-content">
        <h1>Explore Our Services</h1>
        <p>Browse our offerings — they auto-slide every 3 seconds, or use the arrows to navigate.</p>
        <ul>
          <li><strong>Web Development</strong> – Fast, responsive sites.</li>
          <li><strong>AI Integration</strong> – Intelligent automation.</li>
          <li><strong>Digital Marketing</strong> – Campaigns that convert.</li>
        </ul>
        <button className="learn-more">Learn More</button>
      </div>

      {/* Right side slider with controls */}
      <div className="services-slider-wrapper">
        <button className="slider-btn left" onClick={() => scrollByOne(-1)} aria-label="Scroll left">‹</button>
        <div className="services-slider" ref={sliderRef}>
          {services.map((s, i) => (
            <div
              key={i}
              className="service-card"
              style={{ backgroundColor: s.bgColor }}
            >
              <div className="icon-wrap">
                <img src={s.icon} alt={s.title} />
              </div>
              <h3>{s.title}</h3>
            </div>
          ))}
        </div>
        <button className="slider-btn right" onClick={() => scrollByOne(1)} aria-label="Scroll right">›</button>
      </div>
    </div>
  );
};

export default ServicesPage;
