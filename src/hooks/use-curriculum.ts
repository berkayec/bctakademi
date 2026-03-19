import { useState, useEffect } from 'react';
import { curriculum as staticCurriculum } from '@/lib/curriculum';
import type { Category } from '@/lib/curriculum';

export function useCurriculum() {
  const [data, setData] = useState<Category[]>(staticCurriculum);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/curriculum')
      .then(r => r.json())
      .then((json: any) => {
        if (cancelled || !json.success || !json.data?.length) return;
        // API verisini curriculum.ts formatına normalize et
        const normalized: Category[] = json.data.map((cat: any) => ({
          id: cat.id,
          title: cat.title,
          courses: (cat.courses || []).map((course: any) => ({
            id: course.id,
            title: course.title,
            description: course.description || '',
            image: course.image_url || course.image || '',
            units: (course.units || []).map((unit: any) => ({
              id: unit.id,
              title: unit.title,
              description: unit.description || '',
              estimatedReadingTime: unit.estimated_reading_time || unit.estimatedReadingTime || '60 dk',
              topics: (unit.topics || []).map((topic: any) => ({
                id: topic.id,
                title: topic.title,
                content: topic.content || '',
                videoYoutubeId: topic.video_youtube_id || topic.videoYoutubeId,
                quiz: (topic.quiz || []).map((q: any) => ({
                  question: q.question,
                  options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
                  correctAnswer: q.correct_answer ?? q.correctAnswer,
                  explanation: q.explanation || '',
                })),
              })),
            })),
          })),
        }));
        if (!cancelled) setData(normalized);
      })
      .catch(() => { /* fallback: staticCurriculum */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { curriculum: data, loading };
}

export function useUnitTopics(unitId: string | undefined) {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!unitId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/units/${unitId}/topics`)
      .then(r => r.json())
      .then((json: any) => {
        if (cancelled || !json.success || !json.data?.length) return;
        const normalized = json.data.map((topic: any) => ({
          id: topic.id,
          title: topic.title,
          content: topic.content || '',
          videoYoutubeId: topic.video_youtube_id || topic.videoYoutubeId,
          quiz: (topic.quiz || []).map((q: any) => ({
            question: q.question,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correctAnswer: q.correct_answer ?? q.correctAnswer,
            explanation: q.explanation || '',
          })),
        }));
        if (!cancelled) setTopics(normalized);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [unitId]);

  return { topics, loading };
}