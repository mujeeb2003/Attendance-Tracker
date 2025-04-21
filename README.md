# Attendance Tracker

A comprehensive web application for tracking faculty attendance and work hours. This system provides a calendar-based interface to monitor daily attendance, weekly summaries, and monthly overviews.

## Features

- **Faculty Management**: Add and view faculty members
- **Attendance Tracking**: Record daily attendance with entry and exit times
- **Calendar View**: Visualize attendance patterns in a monthly calendar format
- **Weekly Details**: In-depth view of weekly attendance records with hours calculation
- **Weekly Summary**: Overview of hours worked per week with target completion metrics
- **Absence Tracking**: Mark and visualize faculty absences

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- Axios for API requests
- Vite for build tooling and development server

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- RESTful API architecture

## Installation

1. Clone the repository
2. Install dependencies

## Environment Setup

Create a `.env` file in the root directory with your MongoDB connection string:

## Run the Application

```bash
npm run dev
```

## Usage

### Adding Attendance Records
1. Select a faculty member from the dropdown
2. Enter entry and exit times
3. Submit the form to record attendance

### Viewing Attendance
- The calendar view shows monthly attendance with color coding
- Click on any week to view detailed daily attendance records
- The weekly summary shows total hours worked per week with completion status

## Project Structure

### API Endpoints

#### Faculty
- `GET /api/faculty` - Get all faculty members
- `POST /api/faculty` - Add a new faculty member

#### Attendance
- `GET /api/attendance` - Get attendance records (with optional month, year, faculty_id filters)
- `POST /api/attendance` - Add a new attendance record

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
