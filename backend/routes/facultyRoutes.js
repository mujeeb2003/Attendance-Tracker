import express from 'express';
const router = express.Router();
import { db } from '../../model/index.js';
import { Faculty } from '../../model/Faculty.js';

router.get('/faculty', async (req, res) => {
    try {
        const faculties = await db.Faculty.find().sort({ TeacherName: 1 });
        res.status(200).json(faculties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;