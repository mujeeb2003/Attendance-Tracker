import {Schema,model} from "mongoose";

const attendanceSchema = new Schema({
    faculty_id: { type: String, required: true },
    date: { type: Date, required: true },
    entry_time: { type: String, required: true },
    exit_time: { type: String, required: true },
    absent: { type: Boolean, required: true },
});

export const Attendance = model("Attendance", attendanceSchema);
