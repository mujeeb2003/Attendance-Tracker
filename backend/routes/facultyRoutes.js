import express from 'express';
const router = express.Router();
import { db } from '../../model/index.js';
import { Faculty } from '../../model/Faculty.js';

router.get('/faculty', async (req, res) => {
    try {
        const faculties = await db.Faculty.find();
        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/faculty', async (req,res)=>{
    try {
        const { fid, TeacherName, fulltime } = req.body;
        const faculty = new Faculty({
            fid,
            TeacherName,
            fulltime
        });
        const newFaculty = await faculty.save();
        res.status(201).json(newFaculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;