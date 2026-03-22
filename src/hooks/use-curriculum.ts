import { useState, useEffect } from 'react';
import { curriculum as staticCurriculum } from '@/lib/curriculum'; 
import type { Category } from '@/lib/curriculum';

export interface ApiCategory {
  id:          string;
  title:       string;
  sort_order:  number;
  courses:     ApiCourse[];
}

export interface ApiCourse {
  id:           string;
  category_id:  string;
  title:        string;
  description:  string;
  image_url:    string;
  sort_order:   number;
  is_published: number;
  units:        ApiUnit[];
}

export interface ApiUnit {
  id:                     string;
  course_id:              string;
  title:                  string;
  description:            string;
  estimated_reading_time: string;
  sort_order:             number;
  is_published:           number;
}

function normalizeApiData(apiData: ApiCategory[]): Category[] {
  return apiData.map(cat => ({
    id:    cat.id,
    title: cat.title,
    courses: (cat.courses || []).map(course => ({
      id:          course.id,
      title:       course.title,
      description: course.description,
      image:       course.image_url,
      units:       (course.units || []).map(unit => ({
        id:                   unit.id,
        title:                unit.title,
        description:          unit.description,
        estimatedReadingTime: unit.estimated_reading_time,
        topics:               [],
      })),
    })),
  }));
}

export function useCurriculum() {
  const [data, setData]       = useState<Category[]>(staticCurriculum);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res  = await fetch('/api/curriculum');
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setData(normalizeApiData(json.data));
          setFromApi(true);
        }
      } catch {
        // fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, fromApi };
}

export function useUnitTopics(unitId: string | undefined) {
  const [topics, setTopics]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unitId) { setLoading(false); return; }
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`/api/units/${unitId}/topics`);
        const json = await res.json();

        if (!cancelled && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const normalized = json.data.map((t: any) => ({
            id:             t.id,
            title:          t.title,
            content:        t.content        || '',
            // ✅ DÜZELTİLDİ — attachment_url artık map ediliyor
            attachment_url: t.attachment_url || '',
            videoYoutubeId: t.video_youtube_id || '',
            quiz: (t.quiz || []).map((q: any) => ({
              question:      q.question,
              options:       typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
              correctAnswer: q.correct_answer,
              explanation:   q.explanation,
            })),
          }));
          if (!cancelled) setTopics(normalized);
        } else if (!cancelled) {
          setTopics(findTopicsInStatic(unitId));
        }
      } catch {
        if (!cancelled) setTopics(findTopicsInStatic(unitId));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [unitId]);

  return { topics, loading };
}

function findTopicsInStatic(unitId: string): any[] {
  for (const cat of staticCurriculum) {
    for (const course of cat.courses) {
      const unit = course.units.find(u => u.id === unitId);
      if (unit) return unit.topics || [];
    }
  }
  return [];
}
