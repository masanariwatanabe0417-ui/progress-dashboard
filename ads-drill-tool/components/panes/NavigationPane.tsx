"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, GraduationCap } from "lucide-react";
import { CURRICULUM } from "@/lib/curriculum";
import { SelectedLesson, Series, Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavigationPaneProps {
  selectedLesson: SelectedLesson | null;
  onLessonSelect: (selected: SelectedLesson) => void;
}

export default function NavigationPane({ selectedLesson, onLessonSelect }: NavigationPaneProps) {
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(new Set(["s1"]));
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set(["c1"]));

  const toggleSeries = (id: string) => {
    setExpandedSeries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleCourse = (id: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full border-r bg-muted/30">
      <div className="p-3 border-b">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          シリーズ / コース
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {CURRICULUM.map((series: Series) => (
            <div key={series.id}>
              <button
                onClick={() => toggleSeries(series.id)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium hover:bg-accent transition-colors text-left"
              >
                {expandedSeries.has(series.id) ? (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className={cn("w-2 h-2 rounded-full shrink-0", series.color)} />
                <span className="truncate text-xs">{series.title}</span>
              </button>

              {expandedSeries.has(series.id) && (
                <div className="ml-4 space-y-1">
                  {series.courses.map((course: Course) => (
                    <div key={course.id}>
                      <button
                        onClick={() => toggleCourse(course.id)}
                        className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors text-left"
                      >
                        {expandedCourses.has(course.id) ? (
                          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                        )}
                        <BookOpen className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate text-xs">{course.title}</span>
                      </button>

                      {expandedCourses.has(course.id) && (
                        <div className="ml-4 space-y-0.5">
                          {course.lessons.map((lesson) => {
                            const isSelected =
                              selectedLesson?.lesson.id === lesson.id;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() =>
                                  onLessonSelect({ series, course, lesson })
                                }
                                className={cn(
                                  "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs hover:bg-accent transition-colors text-left",
                                  isSelected &&
                                    "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                              >
                                <GraduationCap className="h-3 w-3 shrink-0" />
                                <span className="truncate">{lesson.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
