import React from "react";
import '../css/SummaryCard.css'; // Import the external CSS

const SummaryCard = ({ icon, text, number }) => {
  return (
    <div className="summary-card">
      <div className="summary-card-icon">
        {icon}
      </div>
      <div className="summary-card-content">
        <p className="summary-card-text">{text}</p>
        <p className="summary-card-number">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
