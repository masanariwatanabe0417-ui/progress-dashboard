"use client";

import { Loader2, GraduationCap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TeacherPaneProps {
  explanation: string;
  isLoading: boolean;
  hasScreenshots: boolean;
}

export default function TeacherPane({ explanation, isLoading, hasScreenshots }: TeacherPaneProps) {
  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3 border-b flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          先生ペイン
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">解説を生成中...</p>
            </div>
          ) : explanation ? (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {explanation}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
              <GraduationCap className="h-12 w-12 opacity-20" />
              {hasScreenshots ? (
                <p className="text-sm">スクリーンショットをアップロードすると解説が表示されます</p>
              ) : (
                <>
                  <p className="text-sm font-medium">左のペインでレッスンを選択し</p>
                  <p className="text-sm">問題・解答のスクリーンショットを貼り付けると</p>
                  <p className="text-sm text-primary font-medium">AIが自動で解説します</p>
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
