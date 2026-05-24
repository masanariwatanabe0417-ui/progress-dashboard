export interface Lesson {
  id: string;
  title: string;
  questionCount: number;
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Series {
  id: string;
  title: string;
  color: string;
  courses: Course[];
}

export interface DrillScreenshots {
  questionImage: string | null;
  answerImage: string | null;
}

export interface QAEntry {
  id: string;
  question: string;
  answer: string;
  proposedAddition: string;
  approved: boolean;
}

export interface SelectedLesson {
  series: Series;
  course: Course;
  lesson: Lesson;
}
