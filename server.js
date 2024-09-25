import cors from 'cors';
import express from 'express';
import attendanceRoutes from './backend/routes/attendanceRoutes.js'
import facultyRoutes from './backend/routes/facultyRoutes.js'
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/', facultyRoutes);
app.use('/', attendanceRoutes);



app.listen(PORT,() => console.log(`Server started on http://localhost:${PORT}`))