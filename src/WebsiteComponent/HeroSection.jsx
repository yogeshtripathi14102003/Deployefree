import React, { useEffect, useRef } from "react";
import { Users, Globe, Flag } from "lucide-react";
import '../WebsiteComponent/hero.css';


const stats = [
  {
    icon: <Users className="icon" />,
    value: 157000,
    label: "Employees",
  },
  {
    icon: <Globe className="icon" />,
    value: 160,
    label: "Nationalities",
  },
  {
    icon: <Flag className="icon" />,
    value: 180,
    label: "Locations worldwide",
  },
];

const CountUp = ({ endValue, duration = 2000 }) => {
  const ref = useRef();
  
useEffect(() => {
  const startTime = performance.now();

  const format = (val) => {
    return endValue > 1000 ? val.toLocaleString() : val;
  };

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(progress * endValue);
    if (ref.current) {
      ref.current.textContent = format(current);
    }
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}, [endValue, duration]);

  return <div ref={ref} className="stat-value">0</div>;
};

const HeroSection = () => {
  return (
    <div className="client-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="icon-wrapper">{stat.icon}</div>
          <CountUp endValue={stat.value} />
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default HeroSection;
