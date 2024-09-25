import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../redux/store';
import { fetchAttendancesByMonth } from '../redux/Attendances/attendanceSlice';
import { Props } from './types';

interface CalendarProps extends Props {
  faculty_id: string ;
}


export const Calendar = function (props: CalendarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { attendances } = useSelector((state: RootState) => state.attendance);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    console.log(props.faculty_id);
    if (props.faculty_id) {
      dispatch(fetchAttendancesByMonth({ month: currentDate.getMonth(), year: currentDate.getFullYear(), faculty_id: props.faculty_id }));
    }
  }, [currentDate, dispatch, props.faculty_id]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const numDays = daysInMonth(month, year);

    for (let i = 1; i <= numDays; i++) {
      const attendance = attendances.find(att => {
        const attDate = new Date(att.date);
        return attDate.getFullYear() === year && attDate.getMonth() === month && attDate.getDate() === i;
      });

      const hours = attendance ? `${attendance.entry_time} - ${attendance.exit_time}` : '';
      days.push(
        <div key={i} className="day-cell">
          <span>{i}</span>
          {hours && <span className="hours">{hours}</span>}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
}
