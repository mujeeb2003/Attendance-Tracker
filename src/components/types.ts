export interface DateObj {
    date: string; 
    isCurrentMonth: boolean;
  }
  
export type Week = DateObj[];
  
export type Faculties = {
	fid: number;
	TeacherName: string;
	fulltime: boolean;
};

export type Attendances = {
  faculty_id: string;
  date: Date;
  entry_time: string;
  exit_time: string;
  absent: boolean;
};

export type WeekDetailsProps = {
	week: Attendances[];
	onBack: () => void;
  }

export type Props = {
	faculty_id: string;
};