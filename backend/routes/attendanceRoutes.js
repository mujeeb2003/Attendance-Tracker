import express from 'express';
const router = express.Router();
import { Attendance } from '../../model/Attendance.js';

router.post('/attendance', async (req, res) => {
  try {
    const { faculty_id, date, entry_time, exit_time, absent } = req.body;
    const attendance = new Attendance({ faculty_id, date, entry_time, exit_time, absent });
    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get('/attendance', async (req, res) => {
    try {
        const { month, year, faculty_id } = req.query;

        const monthInt = parseInt(month, 10) - 1;
        const yearInt = parseInt(year, 10);

        if (isNaN(monthInt) || isNaN(yearInt) || !faculty_id) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }

        // Define the start and end dates for the month
        const startDate = new Date(yearInt, monthInt, 1);
        const endDate = new Date(yearInt, monthInt + 1, 0, 23, 59, 59, 999);
        console.log("start date: ",startDate);
        console.log("end date: ",endDate);

        const attendances = await Attendance.find({
            faculty_id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        res.json(attendances);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

/*
router.get('/', async (req,res)=>{
    const Attendance = await db.Attendance.find().sort({date:1});
    res.status(200).json(Attendance);
})

router.get('/week/:start/:end', async (req, res) => {
    const { start, end } = req.params;
    
    // console.log(start,end);
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // console.log(startDate,endDate);
    
    const attendance = await db.Attendance.find({
        date:{
            $gte:startDate,
            $lte:new Date(endDate.setDate(endDate.getDate() + 1))
        }
    }).sort({date:1})

    console.log(attendance);

    res.status(200).json(attendance);
});
*/