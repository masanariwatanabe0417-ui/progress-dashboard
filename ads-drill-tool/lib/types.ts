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

export interface ExtractedLessonInfo {
  series: string;
  course: string;
  lesson: string;
  questionInfo: string;
}

export interface StudiedEntry {
  id: string;
  lessonInfo: ExtractedLessonInfo;
  timestamp: number;
}
