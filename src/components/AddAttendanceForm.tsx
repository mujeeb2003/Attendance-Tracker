import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState} from '../redux/store'
import { Calendar } from '../components/Calendar'
import { WeeklySummary } from '../components/WeeklySummary'
import { addAttendance, selectCount, getFaculties, fetchAttendancesByMonth } from "../redux/Attendances/attendanceSlice";
import { Attendances, Faculties, Props } from "./types";
import { Fragment } from "react";

export const AddAttendanceForm = function () {
    //const { faculties, attendances } = useSelector((state: RootState) => state.attendance);
    const [formData, setFormData] = useState({
        faculty_id: '',
        date: new Date(),
        entry_time: '',
        exit_time: '',
        absent: false,
    });

    const [attendanceExists, setAttendanceExists] = useState(false);
    const { attendances } = useSelector((state: RootState) => state.attendance);
    const { faculties } = useSelector(selectCount);
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value,
      }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
        
      const attendanceData = {
            ...formData,
            date: new Date(),
            absent: false,
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAttendance = attendances.find(att => {
        const entry_date = new Date(att.date);

        return (
          att.faculty_id === formData.faculty_id &&
          entry_date.getFullYear() === today.getFullYear() &&
          entry_date.getMonth() === today.getMonth() &&
          entry_date.getDate() === today.getDate()
        );
      });

      console.log("Existing attendance: ", existingAttendance);

      if (existingAttendance) {
        alert("Attendance for today already exists!");
        return;
      }

      dispatch(addAttendance(attendanceData));
      setAttendanceExists(true);
      dispatch(fetchAttendancesByMonth({ month: today.getMonth(), year: today.getFullYear(), faculty_id: formData.faculty_id }));
  };

    useEffect(() => {
      const response = dispatch(getFaculties());
      console.log(response);
    }, [dispatch]);

    return (
      <Fragment>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Faculty</label>
            <select name="faculty_id" value={formData.faculty_id} onChange={handleChange}>
              <option value="">Select Faculty</option>
              {faculties.map((faculty: Faculties) => (
                <option key={faculty.fid} value={faculty.fid}>
                {faculty.TeacherName}
              </option>
              ))}
            </select>
          </div>
        <div>
          <label>Entry Time</label>
          <input
            type="time"
            name="entry_time"
            value={formData.entry_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Exit Time</label>
            <input
              type="time"
              name="exit_time"
              value={formData.exit_time}
              onChange={handleChange}
            />
        </div>
          <button type="submit">Add Attendance</button>
        </form>
      </div>
      {formData.faculty_id && (
        <div className="calendar-summary-container">
            <Calendar faculty_id={formData.faculty_id} />
            <WeeklySummary />
        </div>
            )}
      </Fragment>
    )
}