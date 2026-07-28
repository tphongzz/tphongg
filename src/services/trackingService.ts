import { LearningAnalytics, RecommendedTask, RemediationQuestion, UserProfile } from '../types';

const ANALYTICS_STORAGE_KEY = 'english_hnq_analytics';

export const defaultAnalytics: LearningAnalytics = {
  weakWords: [
    { term: 'environment', count: 3 },
    { term: 'resilient', count: 2 },
    { term: 'enthusiastic', count: 2 },
    { term: 'phenomenon', count: 1 }
  ],
  weakTopics: [
    { topic: 'Present Perfect vs Past Simple', count: 4 },
    { topic: 'Prepositions of Time & Place', count: 3 },
    { topic: 'Conditionals (Type 2 & 3)', count: 2 }
  ],
  shadowingHistory: [
    { id: '1', lessonTitle: 'Mastering English Small Talk', score: 78, date: new Date().toISOString() },
    { id: '2', lessonTitle: 'Business Meeting Expressions', score: 85, date: new Date().toISOString() }
  ],
  chatFixHistory: [
    {
      id: '1',
      original: 'I am agree with your opinion',
      corrected: 'I agree with your opinion',
      explanation: '"Agree" là một động từ, không dùng to-be "am agree". Hãy dùng "I agree".',
      date: new Date().toISOString()
    },
    {
      id: '2',
      original: 'Yesterday I go to the cinema',
      corrected: 'Yesterday I went to the cinema',
      explanation: 'Thì quá khứ đơn (Past Simple) dùng động từ quá khứ "went" cho hành động đã xảy ra.',
      date: new Date().toISOString()
    }
  ],
  overallAccuracy: 82,
  recommendedDailyXp: 150
};

export const getLearningAnalytics = (): LearningAnalytics => {
  try {
    const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading learning analytics from localStorage:', e);
  }
  return defaultAnalytics;
};

export const saveLearningAnalytics = (analytics: LearningAnalytics): void => {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error saving learning analytics to localStorage:', e);
  }
};

export const trackWeakWord = (term: string): void => {
  const analytics = getLearningAnalytics();
  const index = analytics.weakWords.findIndex((w) => w.term.toLowerCase() === term.toLowerCase());
  if (index >= 0) {
    analytics.weakWords[index].count += 1;
  } else {
    analytics.weakWords.push({ term, count: 1 });
  }
  // Sort by count descending
  analytics.weakWords.sort((a, b) => b.count - a.count);
  saveLearningAnalytics(analytics);
};

export const trackWeakTopic = (topic: string): void => {
  const analytics = getLearningAnalytics();
  const index = analytics.weakTopics.findIndex((t) => t.topic.toLowerCase() === topic.toLowerCase());
  if (index >= 0) {
    analytics.weakTopics[index].count += 1;
  } else {
    analytics.weakTopics.push({ topic, count: 1 });
  }
  analytics.weakTopics.sort((a, b) => b.count - a.count);
  saveLearningAnalytics(analytics);
};

export const trackShadowingScore = (lessonTitle: string, score: number): void => {
  const analytics = getLearningAnalytics();
  analytics.shadowingHistory.unshift({
    id: Date.now().toString(),
    lessonTitle,
    score,
    date: new Date().toISOString()
  });
  // Keep last 20
  if (analytics.shadowingHistory.length > 20) {
    analytics.shadowingHistory = analytics.shadowingHistory.slice(0, 20);
  }
  // Recalculate average score
  const totalScore = analytics.shadowingHistory.reduce((sum, item) => sum + item.score, 0);
  analytics.overallAccuracy = Math.round(totalScore / analytics.shadowingHistory.length);
  saveLearningAnalytics(analytics);
};

export const recordChatGrammarFix = (original: string, corrected: string, explanation: string): void => {
  const analytics = getLearningAnalytics();
  analytics.chatFixHistory.unshift({
    id: Date.now().toString(),
    original,
    corrected,
    explanation,
    date: new Date().toISOString()
  });
  if (analytics.chatFixHistory.length > 20) {
    analytics.chatFixHistory = analytics.chatFixHistory.slice(0, 20);
  }
  saveLearningAnalytics(analytics);
};

export const generateDailyTasks = (user: UserProfile): RecommendedTask[] => {
  const analytics = getLearningAnalytics();
  const topWeakWord = analytics.weakWords[0]?.term || 'environment';
  const topWeakTopic = analytics.weakTopics[0]?.topic || 'Present Perfect';

  return [
    {
      id: 'task_1',
      title: `Ôn tập từ vựng còn yếu: "${topWeakWord}"`,
      description: `Bạn chưa ghi nhớ vững từ "${topWeakWord}" (bị sai ${analytics.weakWords[0]?.count || 2} lần). Hãy ôn flashcard ngay!`,
      category: 'vocabulary',
      targetTab: 'vocabulary',
      xpReward: 30
    },
    {
      id: 'task_2',
      title: `Củng cố Ngữ pháp: ${topWeakTopic}`,
      description: `Phân tích cho thấy bạn thường nhầm lẫn chủ đề "${topWeakTopic}". Hãy làm lại 3 bài tập trắc nghiệm này.`,
      category: 'grammar',
      targetTab: 'grammar',
      xpReward: 40
    },
    {
      id: 'task_3',
      title: 'Luyện Shadowing nâng điểm phát âm (>80%)',
      description: `Điểm Shadowing trung bình hiện tại: ${analytics.overallAccuracy}%. Nhại giọng 1 video YouTube để nâng hạng!`,
      category: 'shadowing',
      targetTab: 'shadowing',
      xpReward: 50
    },
    {
      id: 'task_4',
      title: 'Trò chuyện 10 phút cùng AI Adam hoặc Eva',
      description: 'Luyện phản xạ giao tiếp tự nhiên và nhận phản hồi Instant Grammar Correction trực tiếp.',
      category: 'chatbot',
      targetTab: 'chatbot',
      xpReward: 35
    }
  ];
};

export const generateRemediationQuiz = (analytics: LearningAnalytics): RemediationQuestion[] => {
  const questions: RemediationQuestion[] = [];

  // Generate word remediation questions
  if (analytics.weakWords.length > 0) {
    const w1 = analytics.weakWords[0]?.term || 'environment';
    questions.push({
      id: 'rem_w1',
      type: 'word',
      question: `Chọn nghĩa đúng của từ vựng yếu "${w1}":`,
      options: ['Môi trường sống', 'Sự kiên cường', 'Hiện tượng tự nhiên', 'Nhiệt tình'],
      correctAnswer: 0,
      explanation: `"${w1}" có nghĩa là môi trường sống surrounding elements.`,
      targetItem: w1
    });
  }

  if (analytics.weakWords.length > 1) {
    const w2 = analytics.weakWords[1]?.term || 'resilient';
    questions.push({
      id: 'rem_w2',
      type: 'word',
      question: `Điền từ thích hợp vào chỗ trống: "She is a very ________ person who recovers quickly from hardship."`,
      options: ['resilient', 'environment', 'enthusiastic', 'phenomenon'],
      correctAnswer: 0,
      explanation: '"Resilient" tính từ nghĩa là kiên cường, có khả năng phục hồi nhanh chóng sau khó khăn.',
      targetItem: w2
    });
  }

  // Generate grammar remediation questions
  questions.push({
      id: 'rem_g1',
      type: 'grammar',
      question: 'Sửa lỗi sai trong câu: "I am agree with your opinion."',
      options: ['I agree with your opinion.', 'I am agreed with your opinion.', 'I agreeing with your opinion.', 'I was agree with your opinion.'],
      correctAnswer: 0,
      explanation: '"Agree" là động từ thường, không kết hợp to-be "am agree". Đáp án đúng là "I agree with your opinion."',
      targetItem: 'Present Simple vs To-Be'
  });

  questions.push({
      id: 'rem_g2',
      type: 'grammar',
      question: 'Chọn dạng đúng của động từ: "Yesterday, I ________ (go) to the cinema with my friends."',
      options: ['go', 'went', 'have gone', 'gone'],
      correctAnswer: 1,
      explanation: 'Có dấu hiệu thời gian "Yesterday" trong quá khứ xác định, sử dụng thì Quá khứ đơn (Past Simple): "went".',
      targetItem: 'Past Simple'
  });

  return questions;
};
