import { configureStore } from '@reduxjs/toolkit'
import { attendanceReducer } from './Attendances/attendanceSlice'

export const store = configureStore({
    reducer: {
        attendance: attendanceReducer,
    },

});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;