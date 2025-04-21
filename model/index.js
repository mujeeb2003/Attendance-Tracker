import mongoose from "mongoose";
import { Attendance } from './Attendance.js'
import { Faculty } from "./Faculty.js";
import dotenv from "dotenv";
dotenv.config();

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
})();

export const db = {
    Faculty, 
    Attendance
};
