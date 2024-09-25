import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from "../store";
import { Attendances, Faculties, type DateObj, type Week } from '../../components/types'; 

interface AttendanceState {
    loading: boolean;
    error: string;
    faculties: Faculties[];
    attendances: Attendances[];
    calendar: Week[];
    monthlyAttendance: Attendances[][];
    week: Attendances[];
}   

const initialState: AttendanceState = {
    loading: false,
    error: "",
    faculties: [],
    attendances: [],
    calendar: [],
    monthlyAttendance: [],
    week: [],
};

export const addAttendance = createAsyncThunk(
    'attendance/saveAttendance',
    async (newAttendance: Attendances, {rejectWithValue}) => {
        try{
            console.log("Sending request to save")
            const response = await axios.post(`/api/attendance`, newAttendance);
            console.log(response.data);
            return response.data;
        } catch(error: any) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const getFaculties = createAsyncThunk("faculty/getFaculty", async () => {
	//await timeout(5000);
	const response = await axios.get(`/api/faculty`);
	return response.data as Faculties[];
});

export const fetchAttendancesByMonth = createAsyncThunk(
  'attendance/fetchByMonth',
  async (params: { month: number; year: number; faculty_id: string }) => {
    console.log("Fetching now...");
    const { month, year, faculty_id } = params;
    const response = await axios.get(`/api/attendance?month=${month + 1}&year=${year}&faculty_id=${faculty_id}`);
    console.log(response.data);
    return response.data as Attendances[];
  }
);


export const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(addAttendance.pending, (state) => {
            state.loading = true;
        })
        .addCase(addAttendance.fulfilled, (state, action) => {
            state.loading = false;
            state.attendances.push(action.payload);
        })
        .addCase(addAttendance.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        })
        .addCase(getFaculties.pending, (state) => {
			state.loading = true;
		})
		.addCase(getFaculties.fulfilled, (state, { payload }) => {
			state.loading = false;
			state.faculties = payload;
            console.log(payload);
		})
		.addCase(getFaculties.rejected, (state, { payload }) => {
			state.loading = false;
			state.error = payload as string;
		})
        .addCase(fetchAttendancesByMonth.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAttendancesByMonth.fulfilled, (state, action) => {
            state.attendances = action.payload;
            state.loading = false;
        })
        .addCase(fetchAttendancesByMonth.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload as string;
        });
    },
});

export const attendanceReducer = attendanceSlice.reducer;
export const selectCount = (state: RootState) => state.attendance;



/*
export const getAttendance = createAsyncThunk(
    "attendance/getAttendance",
    async () => {
        try {
            const response = await axios.get(`/api/attendance`);
            return response.data as Attendances[];
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
);
*/

// this function is responsible for retrieving the attendance records based on the calender that we have rendered. There format of this would be an array of arrays of af attendance records. This is again grouped according to the weeks. The hours are not calculated here. They are done in the component calendar itself

/*
export const getMonthlyAttendance = createAsyncThunk(
    "attendance/gethours",
    async (_, {getState}) => {
        try {
            const state = getState() as RootState;
            const calendar = state.attendance.calendar;
            const attendanceMonthly = await Promise.all(calendar.map(async (week)=>{
                const response = (await axios.get(`/api/week/${week[0].date}/${week[6].date}`)).data;
                // console.log(response)
                return response as Attendances[];
            }));
            return attendanceMonthly as Attendances[][];
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
);
*/

        // the function responsible for generating the calendar. Because date types were creating alot warnings and problems, when generating the calendar, the dates are saved as ISO string. we fill in the calender with the left over days with the prev month and next months dates. and it is made sure that the dates are grouped in weeks which is useful for the calendar component when finding weekly hours.
        /*
        generateCalendar: (state, action: PayloadAction<string>): void => {
            const start = new Date(action.payload);
            const endDate = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            
            const calendar: DateObj[] = [];
            let currentDate = new Date(start);
            
            while (currentDate <= endDate) {
                calendar.push({ date: new Date(currentDate).toISOString(),isCurrentMonth:true});
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // Fill the calendar with previous month's days
            const firstDayOfWeek = new Date(start).getDay();
            // console.log(firstDayOfWeek)
            for (let i = 0; i <firstDayOfWeek; i++) {
                const prevDate = new Date(start.getFullYear(), start.getMonth(), 0);
                prevDate.setDate(prevDate.getDate() - i);
                console.log(prevDate);
                calendar.unshift({ date: prevDate.toISOString() ,isCurrentMonth:false});
                
            }
            
            const lastdayofweek = new Date(endDate).getDay();
            // console.log(lastdayofweek)
            // Fill the calendar with next month's days
            for (let i = lastdayofweek+1; i < 7; i++) {
                const nextDate = new Date(endDate);
                nextDate.setDate(nextDate.getDate() + (i - lastdayofweek));
                calendar.push({ date: nextDate.toISOString(),isCurrentMonth:false});
            }
            
            // Group dates into weeks
            const weeks: Week[] = [];
            let week: Week = [];
            calendar.forEach((dateObj) => {
                week.push(dateObj);
                if (week.length === 7) {
                    weeks.push(week);
                    week = [];
                }
            });
            // console.log(weeks[0])
            state.calendar = weeks;

        },
        // handles the back button in the calendar nav, to go one month back 
        handleprev: (state) => {
            const currentMonth = new Date(state.calendar[1][0].date).getMonth();
            const currentYear = new Date(state.calendar[1][0].date).getFullYear();
            const newDate = new Date(currentYear, currentMonth - 1, 1).toISOString();
            attendanceSlice.caseReducers.generateCalendar(state, {
                payload: newDate,
                type: '',
            });
        },
        // handles the back button in the calendar nav, to go one month forward 
        handlenext: (state) => {
            const currentMonth = new Date(state.calendar[1][0].date).getMonth();
            const currentYear = new Date(state.calendar[1][0].date).getFullYear();
            const newDate = new Date(currentYear, currentMonth + 1, 1).toISOString();
            attendanceSlice.caseReducers.generateCalendar(state, {
                payload: newDate,
                type: '',
            });
        },
        // handles the week click. So i have created a componented name weekDetails. Which basically shows the details of each day like entry time and exit time and etc. so this sets the week variable/state which is then passed as a prop to the weekdetails component in the calendar component
        handleWeekClick:(state,action:PayloadAction<number>)=> { 
            const weekNumber = action.payload;

            const wk = state.monthlyAttendance[weekNumber];
            console.log(JSON.stringify(wk))
            state.week = wk;
        },
        // clears the week state/variable so that the weekDetails component can made to go away. 
        handleBack:(state):void=> {
            state.week = [];
            
        }
        */

    

        /*
        .addCase(getAttendance.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAttendance.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(getAttendance.rejected, (state, {payload}) => {
            state.loading = false;
            state.error = payload as string;
        })
        .addCase(getMonthlyAttendance.pending, (state) => {
            state.loading = true;
        })
        .addCase(getMonthlyAttendance.fulfilled, (state, action) => {
            state.loading = false;
            state.monthlyAttendance = action.payload;
            // state.attendances.push(action.payload);
        })
        .addCase(getMonthlyAttendance.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload as string;
        });
        */

//export const {generateCalendar,handlenext,handleprev,handleWeekClick,handleBack} = attendanceSlice.actions;