import React, { useEffect, useState } from 'react'
import {Week} from "./types.ts"
import {handleprev,handlenext,generateCalendar, getMonthlyAttendance,handleWeekClick,handleBack} from "../redux/Attendances/attendanceSlice.ts";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch,RootState } from '../redux/store.ts';
import WeekDetails from './WeekDetails.tsx';


export default function Calender() {
    const {attendances,calendar,faculties,error,loading,monthlyAttendance,week} = useSelector((state:RootState)=>state.attendance);
    const dispatch = useDispatch<AppDispatch>();
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    useEffect(() => {
        const desiredStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        dispatch(generateCalendar(desiredStartDate));
        
    }, []);
    
    // triggers call to get monthly attendance, if the calendar changes, it will be trigger this function again because it is put in useeffect
    useEffect(() => {
        dispatch(getMonthlyAttendance());
    },[calendar])
    
    

    return (
        
    <div className="Calender">
        {/* check to render the weekdetails component */}
        {Object.keys(week).length ? (
        <WeekDetails week={week} onBack={()=>dispatch(handleBack())} />
        ) : (
        <>
        <header>
            {/* because we had set the dates as isostring we would need to convert it to retrive data, the reason why i put [1][0] is because as i said the prev months dates would also be there in the calendar, if we pick the 1st date it could be from the previous month and cause the month to be rendered incorrectly. */}
            <h3>{calendar[0] && new Date(calendar[1][0].date).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <nav>
            <span onClick={()=>dispatch(handleprev())}>&lt;</span>
            <span onClick={()=>dispatch(handlenext())}>&gt;</span>
            </nav>
        </header>
        <section>
        <div className="days">
        <ul>
            <li>Sun</li>
            <li>Mon</li>  
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
            <li>Hrs</li>
        </ul>
        </div>
        <div className="dates">
        {calendar.map((week, weekIndex) => (
            <ul
            key={weekIndex}
            className="week"
            // here we are calling the week click which would trigger to render the weekdetails component
            onClick={() => dispatch(handleWeekClick(weekIndex))}
            >
            {week.map((dateObj, dateIndex) => (
                <li key={dateIndex} 
                // here we are trying to see the if the date is from current month or no and based on that assign inactive or "" class. If the date is of the current month we put another check to see if the absent attribute is true. and due to the dumb format of date it had to be done in this confusing manner. Also that -1 because the dates are zero indexed. 
                className={dateObj.isCurrentMonth
                    ? monthlyAttendance[weekIndex]?.find(attendance => new Date(new Date(attendance.date).setDate(new Date(attendance.date).getDate() - 1)).toISOString() === new Date(dateObj.date).toISOString())?.absent
                    ? 'absent'
                    : ''
                    : 'inactive'}
                    >
                    {new Date(dateObj.date).getDate()}
                    </li>
                ))}
                <li key={6+weekIndex} style={{backgroundColor:'#ccc',borderRadius:'5px',
                    color:Math.round( monthlyAttendance[weekIndex]?.reduce((acc, record) => { 
                        if (record.absent) {
                            return acc;
                        }
                        const recordDate = new Date(record.date);
                        
                        const entryTime = new Date(`${recordDate?.toISOString()?.split('T')[0]}T${record.entry_time}`);
                        const exitTime = new Date(`${recordDate?.toISOString()?.split('T')[0]}T${record.exit_time}`);
                        const hoursWorked = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
                        // console.log(hoursWorked)
                        
                        acc+=hoursWorked;
                        return acc;
                    }, 0)) < 30 ? 'red' : ''
                }}>{
                    // this is responsible of calculating hours in the week. 
                    Math.round( monthlyAttendance[weekIndex]?.reduce((acc, record) => { 
                        if (record.absent) {
                            return acc;
                        }
                        const recordDate = new Date(record.date);
                        
                        const entryTime = new Date(`${recordDate?.toISOString()?.split('T')[0]}T${record.entry_time}`);
                        const exitTime = new Date(`${recordDate?.toISOString()?.split('T')[0]}T${record.exit_time}`);
                        const hoursWorked = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
                        // console.log(hoursWorked)
                        
                        acc+=hoursWorked;
                        return acc;
                    }, 0))
                }/30</li>
                </ul>
                
            ))}
            </div>
            </section>
            </>
        )}
        </div>
        )
    }
    