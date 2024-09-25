import React from 'react';
import { WeekDetailsProps } from './types';

// I am facing some problems in this component. The hours are coming as Nan, and the indexing problem of dates is not fixed rest is almost fine.
export default function WeekDetails({ week, onBack }: WeekDetailsProps) {
  return (
    <div className="week-details">
      <button className="back-button" onClick={onBack}>Back to Calendar</button>
      <ul className="details-list">
        {week.map((dateObj, index) => {
          const date = new Date(dateObj.date).toLocaleDateString();
          const entrytime = new Date(`${date}T${dateObj.entry_time}`).toLocaleTimeString()
          const exittime = new Date(`${date}T${dateObj.exit_time}`).toLocaleTimeString()

          // Handle absent dates and attendance calculation
          return (
            <li key={index} className="details-item">
              <div className="date-info">
                <strong>Date: </strong> {date}
              </div>
              {dateObj.absent ? (
                <div className="absent-info" style={{ color: 'red' }}>Absent</div>
              ) : (
                <div className="attendance-info">
                  <div><strong>Entry Time:</strong> {entrytime}</div>
                  <div><strong>Exit Time:</strong> {exittime}</div>
                  <div><strong>Hours Worked:</strong> {
                    entrytime && exittime ? 
                      ((new Date(`${dateObj.date}T${exittime}`).getTime() - new Date(`${dateObj.date}T${entrytime}`).getTime()) / (1000 * 60 * 60)).toFixed(2) : 
                      "N/A"
                  } hours</div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
