import React from 'react';
import './styles/StatsCard.css';

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  iconColor = "icon-primary",
}) {
  return (
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-card-layout">
          <div>
            <p className="stats-card-title">{title}</p>
            <h3 className="stats-card-value">{value}</h3>
            {description && (
              <p className="stats-card-description">{description}</p>
            )}
            {trend !== undefined && (
              <div className="stats-card-trend">
                <span
                  className={`trend-badge ${trend >= 0 ? 'trend-positive' : 'trend-negative'}`}
                >
                  {trend >= 0 ? "+" : ""}{trend}%
                </span>
                {trendLabel && (
                  <span className="trend-label">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={`stats-card-icon ${iconColor}`}>
            <Icon className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}