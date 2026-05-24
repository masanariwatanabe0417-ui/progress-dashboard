"use client";

import { Loader2, GraduationCap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ExtractedLessonInfo } from "@/lib/types";

interface TeacherPaneProps {
  explanation: string;
  isLoading: boolean;
  hasScreenshots: boolean;
  currentLessonInfo: ExtractedLessonInfo | null;
}

export default function TeacherPane({
  explanation,
  isLoading,
  hasScreenshots,
  currentLessonInfo,
}: TeacherPaneProps) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            先生ペイン
          </h2>
        </div>
        {currentLessonInfo && (
          <div className="flex items-center gap-1.5 min-w-0">
            <Badge variant="outline" className="text-xs shrink-0">{currentLessonInfo.series}</Badge>
            <span className="text-xs text-muted-foreground truncate hidden sm:block">
              {currentLessonInfo.course} › {currentLessonInfo.lesson}
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">スクリーンショットを読み取り中...</p>
              <p className="text-xs text-muted-foreground">シリーズ・レッスン名と解説を同時に生成しています</p>
            </div>
          ) : explanation ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {explanation}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
              <GraduationCap className="h-12 w-12 opacity-20" />
              {hasScreenshots ? (
                <p className="text-sm">解析中...</p>
              ) : (
                <>
                  <p className="text-sm font-medium">問題のスクリーンショットを貼り付けると</p>
                  <p className="text-sm text-primary font-medium">
                    シリーズ名・レッスン名を自動で読み取り<br />AIが解説を生成します
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ②のエリアをクリック → Ctrl+V で貼り付け
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
