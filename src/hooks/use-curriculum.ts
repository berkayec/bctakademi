/**
 * useCurriculum — D1 API'sinden müfredat çeker, hata/boş durumda curriculum.ts'e döner.
 * 
 * API yanıtı: { success: true, data: Category[] }
 * Her category: { id, title, courses: [{ id, title, description, image_url, units: [...] }] }
 */
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
  image_url:    string;   // API'de image_url, statik'te image
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

/** API verisini curriculum.ts formatına dönüştür */
function normalizeApiData(apiData: ApiCategory[]): Category[] {
  return apiData.map(cat => ({
    id:    cat.id,
    title: cat.title,
    courses: (cat.courses || []).map(course => ({
      id:          course.id,
      title:       course.title,
      description: course.description,
      image:       course.image_url,     // image_url → image
      units:       (course.units || []).map(unit => ({
        id:                   unit.id,
        title:                unit.title,
        description:          unit.description,
        estimatedReadingTime: unit.estimated_reading_time,
        topics:               [],        // topics ayrı endpoint'ten gelir
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
        // json.data boşsa veya hata varsa statik data kalır
      } catch {
        // ağ hatası — statik fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, fromApi };
}

/** Tek bir ünitenin konularını API'den çek, hata durumunda curriculum.ts'den bul */
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
          // API'den gelen topic: { id, unit_id, title, content, quiz: [{question, options, correct_answer, explanation}] }
          const normalized = json.data.map((t: any) => ({
            id:            t.id,
            title:         t.title,
            content:       t.content,
            videoYoutubeId: t.video_youtube_id ?? undefined,
            quiz: (t.quiz || []).map((q: any) => ({
              question:      q.question,
              options:       typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
              correctAnswer: q.correct_answer,
              explanation:   q.explanation,
            })),
          }));
          if (!cancelled) setTopics(normalized);
        } else if (!cancelled) {
          // Fallback: curriculum.ts'den bul
          const fallback = findTopicsInStatic(unitId);
          setTopics(fallback);
        }
      } catch {
        if (!cancelled) {
          const fallback = findTopicsInStatic(unitId);
          setTopics(fallback);
        }
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
