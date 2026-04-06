/**
 * Centralized analytics utilities for DNTRNG™ Assessment Data.
 */

export interface ResponseStats {
  total: number;
  avgScore: number;
  passRate: number;
  gradeData: { name: string; value: number; color: string }[];
  testPerformanceData: { name: string; avg: number; submissions: number }[];
}

export interface QuestionStat {
  id: string;
  text: string;
  attempts: number;
  correct: number;
  incorrect: number;
  successRate: number;
}

/**
 * Calculates global and per-test metrics from raw response data.
 * @param responses - The list of submission records.
 * @param tests - The list of assessment modules.
 * @param threshold - The percentage required to pass (default 70).
 */
export function calculateResponseStats(responses: any[], tests: any[], threshold: number = 70): ResponseStats | null {
  if (!responses || responses.length === 0) return null;

  const total = responses.length;
  let totalScorePct = 0;
  let passes = 0;

  const gradeCounts = {
    Excellent: 0,
    Pass: 0,
    Fail: 0
  };

  const testStats: Record<string, { count: number; totalScore: number }> = {};

  responses.forEach(r => {
    const score = Number(r.Score) || 0;
    const totalQ = Number(r.Total) || 1;
    const pct = (score / totalQ) * 100;
    
    totalScorePct += pct;
    
    if (pct >= threshold) passes++;
    
    if (pct >= 80) gradeCounts.Excellent++;
    else if (pct >= threshold) gradeCounts.Pass++;
    else gradeCounts.Fail++;

    const testId = String(r['Test ID'] || 'Unknown');
    if (!testStats[testId]) testStats[testId] = { count: 0, totalScore: 0 };
    testStats[testId].count++;
    testStats[testId].totalScore += pct;
  });

  const gradeData = [
    { name: `Excellent (80%+)`, value: gradeCounts.Excellent, color: '#22c55e' },
    { name: `Pass (${threshold}-${79}%)`, value: gradeCounts.Pass, color: '#f59e0b' },
    { name: `Fail (<${threshold}%)`, value: gradeCounts.Fail, color: '#ef4444' }
  ];

  const testPerformanceData = Object.entries(testStats).map(([id, data]) => {
    const test = tests.find(t => t.id === id);
    return {
      name: test?.title || id,
      avg: Math.round(data.totalScore / data.count),
      submissions: data.count
    };
  }).sort((a, b) => b.avg - a.avg);

  return {
    total,
    avgScore: Math.round(totalScorePct / total),
    passRate: Math.round((passes / total) * 100),
    gradeData,
    testPerformanceData
  };
}

/**
 * Calculates per-question metrics for a specific test.
 */
export function calculateQuestionStats(testId: string, questions: any[], allResponses: any[]): QuestionStat[] {
  const testResponses = allResponses.filter(r => String(r['Test ID']) === String(testId));
  
  return questions.map(q => {
    let attempts = 0;
    let correct = 0;

    testResponses.forEach(r => {
      try {
        const raw = typeof r['Raw Responses'] === 'string' 
          ? JSON.parse(r['Raw Responses']) 
          : (r['Raw Responses'] || []);
        
        const qResponse = raw.find((item: any) => String(item.questionId) === String(q.id));
        
        if (qResponse) {
          attempts++;
          if (qResponse.isCorrect) {
            correct++;
          }
        }
      } catch (e) {
        // Skip malformed response data
      }
    });

    const successRate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

    return {
      id: q.id,
      text: q.question_text || 'Unknown Question',
      attempts,
      correct,
      incorrect: attempts - correct,
      successRate
    };
  }).sort((a, b) => a.successRate - b.successRate); // Hardest first by default
}
