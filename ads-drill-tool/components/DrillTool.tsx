"use client";

import { useCallback, useState } from "react";
import NavigationPane from "./panes/NavigationPane";
import ScreenshotPane from "./panes/ScreenshotPane";
import TeacherPane from "./panes/TeacherPane";
import QuestionPane from "./panes/QuestionPane";
import { DrillScreenshots, ExtractedLessonInfo, QAEntry, StudiedEntry } from "@/lib/types";

export default function DrillTool() {
  const [screenshots, setScreenshots] = useState<DrillScreenshots>({
    questionImage: null,
    answerImage: null,
  });
  const [currentLessonInfo, setCurrentLessonInfo] = useState<ExtractedLessonInfo | null>(null);
  const [studiedEntries, setStudiedEntries] = useState<StudiedEntry[]>([]);
  const [teacherExplanation, setTeacherExplanation] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [qaEntries, setQaEntries] = useState<QAEntry[]>([]);
  const [questionLoading, setQuestionLoading] = useState(false);

  const fetchTeacherExplanation = useCallback(
    async (newScreenshots: DrillScreenshots) => {
      if (!newScreenshots.questionImage) return;
      setTeacherLoading(true);
      setTeacherExplanation("");
      setCurrentLessonInfo(null);
      try {
        const res = await fetch("/api/teacher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionImageDataUrl: newScreenshots.questionImage,
            answerImageDataUrl: newScreenshots.answerImage,
          }),
        });
        const data = await res.json();
        if (data.explanation) setTeacherExplanation(data.explanation);
        if (data.lessonInfo) {
          const info: ExtractedLessonInfo = data.lessonInfo;
          setCurrentLessonInfo(info);
          setStudiedEntries((prev) => {
            const alreadyExists = prev.some(
              (e) => e.lessonInfo.series === info.series &&
                     e.lessonInfo.course === info.course &&
                     e.lessonInfo.lesson === info.lesson
            );
            if (alreadyExists) return prev;
            return [
              { id: Date.now().toString(), lessonInfo: info, timestamp: Date.now() },
              ...prev,
            ];
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTeacherLoading(false);
      }
    },
    []
  );

  const handleScreenshotUpload = useCallback(
    (type: "question" | "answer", dataUrl: string) => {
      setScreenshots((prev) => {
        const next = { ...prev, [type === "question" ? "questionImage" : "answerImage"]: dataUrl };
        fetchTeacherExplanation(next);
        return next;
      });
      setQaEntries([]);
    },
    [fetchTeacherExplanation]
  );

  const handleScreenshotClear = useCallback((type: "question" | "answer") => {
    setScreenshots((prev) => ({
      ...prev,
      [type === "question" ? "questionImage" : "answerImage"]: null,
    }));
    if (type === "question") {
      setTeacherExplanation("");
      setCurrentLessonInfo(null);
    }
  }, []);

  const handleAskQuestion = useCallback(
    async (question: string) => {
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
            lessonTitle: currentLessonInfo
              ? `${currentLessonInfo.series} ${currentLessonInfo.course} - ${currentLessonInfo.lesson}`
              : "不明",
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
    [screenshots, teacherExplanation, currentLessonInfo]
  );

  const handleApproveAddition = useCallback(
    (entryId: string) => {
      const entry = qaEntries.find((e) => e.id === entryId);
      if (entry?.proposedAddition) {
        setTeacherExplanation((prev) =>
          prev ? `${prev}\n\n---\n${entry.proposedAddition}` : entry.proposedAddition
        );
      }
      setQaEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, approved: true } : e))
      );
    },
    [qaEntries]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ①ナビゲーション */}
      <div className="w-56 shrink-0">
        <NavigationPane
          studiedEntries={studiedEntries}
          currentLessonInfo={currentLessonInfo}
        />
      </div>

      {/* ②スクリーンショット */}
      <div className="w-72 shrink-0">
        <ScreenshotPane
          screenshots={screenshots}
          onScreenshotUpload={handleScreenshotUpload}
          onScreenshotClear={handleScreenshotClear}
          disabled={false}
        />
      </div>

      {/* ③先生ペイン */}
      <div className="flex-1 min-w-0">
        <TeacherPane
          explanation={teacherExplanation}
          isLoading={teacherLoading}
          currentLessonInfo={currentLessonInfo}
          hasScreenshots={!!screenshots.questionImage}
        />
      </div>

      {/* ④質問ペイン */}
      <div className="w-80 shrink-0">
        <QuestionPane
          qaEntries={qaEntries}
          isLoading={questionLoading}
          hasLesson={!!screenshots.questionImage}
          onAskQuestion={handleAskQuestion}
          onApproveAddition={handleApproveAddition}
        />
      </div>
    </div>
  );
}
