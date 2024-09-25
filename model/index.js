import mongoose from "mongoose";
import { Attendance } from './Attendance.js'
import { Faculty } from "./Faculty.js";


(async () => {
    await mongoose.connect(`mongodb://127.0.0.1:27017/ZabCMS`);
})();

export const db = {
    Faculty, 
    Attendance
};
