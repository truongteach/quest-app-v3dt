import { Question, HotspotZone } from '@/types/quiz';

/**
 * Robustly parses a registry field that might be a JSON array or a comma-separated string.
 */
export const parseRegistryArray = (input: any): string[] => {
  if (!input) return [];
  const str = String(input).trim();
  
  // Try parsing as JSON first for maximum data integrity
  if (str.startsWith('[') && str.endsWith(']')) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch (e) {
      // Fallback to standard comma splitting if JSON is malformed
    }
  }
  
  // Legacy or manual entry fallback: split by comma, handling potential empty segments
  return str.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

/**
 * Calculates whether a user's response is correct for a given question.
 */
export const calculateScoreForQuestion = (q: Question, response: any): boolean => {
  if (q.correct_answer === undefined || q.correct_answer === null || response === undefined || response === null) return false;
  
  const questionType = q.question_type;
  const correctArr = parseRegistryArray(q.correct_answer);

  if (['single_choice', 'true_false', 'short_text', 'dropdown'].includes(questionType)) {
    const target = correctArr[0] || "";
    return response.toString().toLowerCase().trim() === target.toLowerCase().trim();
  } 
  
  if (questionType === 'multiple_choice') {
    const resArr = (Array.isArray(response) ? response : []).map((r: any) => r.toString().trim().toLowerCase()).sort();
    const sortedCorrect = [...correctArr].map(c => c.toLowerCase()).sort();
    return JSON.stringify(resArr) === JSON.stringify(sortedCorrect);
  } 
  
  if (questionType === 'ordering') {
    const responseArr = (Array.isArray(response) ? response : []).map((r: any) => r.toString().trim());
    return JSON.stringify(responseArr) === JSON.stringify(correctArr);
  } 
  
  if (questionType === 'hotspot') {
    try {
      const zones: HotspotZone[] = JSON.parse(q.metadata || "[]");
      const correctZones = zones.some(z => z.isCorrect) 
        ? zones.filter(z => z.isCorrect)
        : zones;

      const hit = correctZones.find((z: HotspotZone) => {
        const dist = Math.sqrt(Math.pow(response.x - z.x, 2) + Math.pow(response.y - z.y, 2));
        return dist <= z.radius;
      });
      return !!hit;
    } catch (e) { return false; }
  } 
  
  if (questionType === 'matching') {
    // Correct pairs are stored as "left|right" within the correctArr JSON array
    const userPairs = Object.entries(response as Record<string, string>).map(([k, v]) => `${k}|${v}`).sort();
    const sortedCorrect = [...correctArr].sort();
    if (sortedCorrect.length !== userPairs.length) return false;
    return JSON.stringify(userPairs) === JSON.stringify(sortedCorrect);
  }

  if (questionType === 'multiple_true_false') {
    const statements = parseRegistryArray(q.order_group);
    const userResp = response as Record<string, string>;
    
    return statements.every((s, i) => {
      const userVal = (userResp[s] || "").toLowerCase();
      const correctVal = (correctArr[i] || "").toLowerCase();
      return userVal === correctVal;
    });
  }

  if (questionType === 'matrix_choice') {
    const rows = parseRegistryArray(q.order_group);
    const userResp = response as Record<string, string>;

    return rows.every((row, i) => {
      const userVal = (userResp[row] || "").toLowerCase();
      const correctVal = (correctArr[i] || "").toLowerCase();
      return userVal === correctVal;
    });
  }
  
  return false;
};

/**
 * Calculates the total score for a set of responses.
 */
export const calculateTotalScore = (questions: Question[], responses: { questionId: string; answer: any }[]): number => {
  let score = 0;
  questions.forEach(q => {
    const response = responses.find(r => r.questionId === q.id)?.answer;
    if (calculateScoreForQuestion(q, response)) score++;
  });
  return score;
};
