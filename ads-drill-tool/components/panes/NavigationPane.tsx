"use client";

import { BookOpen, History } from "lucide-react";
import { ExtractedLessonInfo, StudiedEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NavigationPaneProps {
  studiedEntries: StudiedEntry[];
  currentLessonInfo: ExtractedLessonInfo | null;
}

export default function NavigationPane({ studiedEntries, currentLessonInfo }: NavigationPaneProps) {
  return (
    <div className="flex flex-col h-full border-r bg-muted/30">
      <div className="p-3 border-b">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          本気AIドリル
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">学習履歴</p>
      </div>

      {/* 現在のレッスン */}
      {currentLessonInfo && (
        <div className="mx-2 mt-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5 space-y-1">
          <p className="text-xs font-semibold text-primary flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            学習中
          </p>
          <p className="text-xs font-bold text-foreground truncate">{currentLessonInfo.series}</p>
          <p className="text-xs text-muted-foreground truncate">{currentLessonInfo.course}</p>
          <p className="text-xs text-foreground truncate">{currentLessonInfo.lesson}</p>
          {currentLessonInfo.questionInfo && (
            <Badge variant="secondary" className="text-xs h-5">
              {currentLessonInfo.questionInfo}
            </Badge>
          )}
        </div>
      )}

      {/* 学習履歴リスト */}
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-1">
        <History className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">このセッションの履歴</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {studiedEntries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground px-2">
              <BookOpen className="h-8 w-8 opacity-20" />
              <p className="text-xs">
                問題のスクリーンショットを貼ると自動でシリーズ・レッスン名が表示されます
              </p>
            </div>
          ) : (
            studiedEntries.map((entry) => {
              const isCurrent =
                currentLessonInfo &&
                entry.lessonInfo.series === currentLessonInfo.series &&
                entry.lessonInfo.course === currentLessonInfo.course &&
                entry.lessonInfo.lesson === currentLessonInfo.lesson;

              return (
                <div
                  key={entry.id}
                  className={cn(
                    "rounded-md px-2 py-2 space-y-0.5",
                    isCurrent
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent"
                  )}
                >
                  <p className="text-xs font-semibold text-foreground truncate">
                    {entry.lessonInfo.series}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {entry.lessonInfo.course}
                  </p>
                  <p className="text-xs text-foreground/80 truncate">
                    {entry.lessonInfo.lesson}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
