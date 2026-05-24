"use client";

import { useCallback, useState } from "react";
import NavigationPane from "./panes/NavigationPane";
import ScreenshotPane from "./panes/ScreenshotPane";
import TeacherPane from "./panes/TeacherPane";
import QuestionPane from "./panes/QuestionPane";
import { DrillScreenshots, QAEntry, SelectedLesson } from "@/lib/types";

export default function DrillTool() {
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null);
  const [screenshots, setScreenshots] = useState<DrillScreenshots>({
    questionImage: null,
    answerImage: null,
  });
  const [teacherExplanation, setTeacherExplanation] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [qaEntries, setQaEntries] = useState<QAEntry[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  const fetchTeacherExplanation = useCallback(
    async (newScreenshots: DrillScreenshots, lessonTitle: string) => {
      if (!newScreenshots.questionImage) return;
      setTeacherLoading(true);
      setTeacherExplanation("");
      try {
        const res = await fetch("/api/teacher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionImageDataUrl: newScreenshots.questionImage,
            answerImageDataUrl: newScreenshots.answerImage,
            lessonTitle,
          }),
        });
        const data = await res.json();
        if (data.explanation) setTeacherExplanation(data.explanation);
      } catch (err) {
        console.error(err);
      } finally {
        setTeacherLoading(false);
      }
    },
    []
  );

  const handleLessonSelect = useCallback((selected: SelectedLesson) => {
    setSelectedLesson(selected);
    setScreenshots({ questionImage: null, answerImage: null });
    setTeacherExplanation("");
    setQaEntries([]);
  }, []);

  const handleScreenshotUpload = useCallback(
    (type: "question" | "answer", dataUrl: string) => {
      setScreenshots((prev) => {
        const next = { ...prev, [type === "question" ? "questionImage" : "answerImage"]: dataUrl };
        if (selectedLesson) {
          fetchTeacherExplanation(next, selectedLesson.lesson.title);
        }
        return next;
      });
    },
    [selectedLesson, fetchTeacherExplanation]
  );

  const handleScreenshotClear = useCallback(
    (type: "question" | "answer") => {
      setScreenshots((prev) => {
        const next = { ...prev, [type === "question" ? "questionImage" : "answerImage"]: null };
        return next;
      });
      setTeacherExplanation("");
    },
    []
  );

  const handleAskQuestion = useCallback(
    async (question: string) => {
      if (!selectedLesson) return;
      setQuestionLoading(true);
      try {
        const res = await fetch("/api/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            questionImageDataUrl: screenshots.questionImage,
            answerImageDataUrl: screenshots.answerImage,
            currentExplanation: teacherExplanation,
            lessonTitle: selectedLesson.lesson.title,
          }),
        });
        const data = await res.json();
        const entry: QAEntry = {
          id: Date.now().toString(),
          question,
          answer: data.answer || "回答を取得できませんでした",
          proposedAddition: data.proposedAddition || "",
          approved: false,
        };
        setQaEntries((prev) => [...prev, entry]);
      } catch (err) {
        console.error(err);
      } finally {
        setQuestionLoading(false);
      }
    },
    [selectedLesson, screenshots, teacherExplanation]
  );

  const handleApproveAddition = useCallback((entryId: string) => {
    setQaEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, approved: true } : e))
    );
    const entry = qaEntries.find((e) => e.id === entryId);
    if (entry?.proposedAddition) {
      setTeacherExplanation((prev) =>
        prev ? `${prev}\n\n---\n${entry.proposedAddition}` : entry.proposedAddition
      );
    }
  }, [qaEntries]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ①ナビゲーション */}
      <div className="w-56 shrink-0">
        <NavigationPane
          selectedLesson={selectedLesson}
          onLessonSelect={handleLessonSelect}
        />
      </div>

      {/* ②スクリーンショット */}
      <div className="w-72 shrink-0">
        <ScreenshotPane
          screenshots={screenshots}
          onScreenshotUpload={handleScreenshotUpload}
          onScreenshotClear={handleScreenshotClear}
          disabled={!selectedLesson}
        />
      </div>

      {/* ③先生ペイン */}
      <div className="flex-1 min-w-0">
        <TeacherPane
          explanation={teacherExplanation}
          isLoading={teacherLoading}
          hasScreenshots={!!(screenshots.questionImage)}
        />
      </div>

      {/* ④質問ペイン */}
      <div className="w-80 shrink-0">
        <QuestionPane
          qaEntries={qaEntries}
          isLoading={questionLoading}
          hasLesson={!!selectedLesson}
          onAskQuestion={handleAskQuestion}
          onApproveAddition={handleApproveAddition}
        />
      </div>
    </div>
  );
}
