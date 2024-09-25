import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const WeeklySummary = () => {
  const { attendances } = useSelector((state: RootState) => state.attendance);

  const calculateHours = () => {
    const weeklyHours = new Array(4).fill(0);
    attendances.forEach(att => {
      const date = new Date(att.date);
      const dayOfMonth = date.getDate();

      const week = Math.floor((dayOfMonth - 1) / 7);
      
      const [entryHour, entryMinute] = att.entry_time.split(':').map(Number);
      const [exitHour, exitMinute] = att.exit_time.split(':').map(Number);
      
      const hoursWorked = (exitHour + exitMinute / 60) - (entryHour + entryMinute / 60);
      weeklyHours[week] += hoursWorked;
    });
    return weeklyHours;
  };

  const weeklyHours = calculateHours();

  return (
    <div className="summary-container">
      {weeklyHours.map((hours, index) => (
        <div key={index} className={`week-summary ${hours >= 40 ? 'met' : 'not-met'}`}>
          Week {index + 1}: {hours.toFixed(2)} hours
        </div>
      ))}
      <div className="leftover-hours">
        Leftover hours: {(160 - weeklyHours.reduce((acc, cur) => acc + cur, 0)).toFixed(2)}
      </div>
    </div>
  );
};

export default WeeklySummary;
