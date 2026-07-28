import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, ChatMessage, LearningAnalytics } from '../types';
import { getLearningAnalytics } from './trackingService';

export interface TutorResponse {
  reply: string;
  recommendedAction?: {
    label: string;
    targetTab: string;
  };
}

const DR_NTP_SYSTEM_PROMPT = `
You are Dr. NTP, the Master AI Tutor & Central Learning Analytics Director for English NTP platform.
Your objective:
- Provide highly encouraging, empathetic, expert-level academic guidance in Vietnamese mixed with English examples.
- Analyze student's performance data (Rank, XP, Weak Words, Weak Grammar Topics, Shadowing Accuracy, Chat Error History).
- Keep responses clear, motivating, and actionable (2-4 paragraphs max).
- Recommend specific next steps to improve weaknesses.
`;

export const askCentralTutor = async (
  apiKey: string | undefined,
  userMessage: string,
  user: UserProfile,
  history: ChatMessage[] = []
): Promise<TutorResponse> => {
  const analytics: LearningAnalytics = getLearningAnalytics();

  if (!apiKey || apiKey.trim() === '') {
    return generateOfflineTutorResponse(userMessage, user, analytics);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    });

    const contextData = `
[STUDENT DATA PROFILE]
Name: ${user.name}
Rank Level: ${user.rank.toUpperCase()}
XP: ${user.xp}
Streak: ${user.streak} days
Words Learned: ${user.wordsLearned}
Grammar Completed: ${user.grammarCompleted}
Shadowing Completed: ${user.shadowingCompleted}

[LEARNING ANALYTICS TRACKING]
Weak Words List: ${analytics.weakWords.map((w) => `${w.term} (${w.count}x)`).join(', ') || 'None'}
Weak Grammar Topics: ${analytics.weakTopics.map((t) => `${t.topic} (${t.count}x)`).join(', ') || 'None'}
Shadowing Avg Accuracy: ${analytics.overallAccuracy}%
Recent Chat Fixes logged: ${analytics.chatFixHistory.map((c) => `"${c.original}" -> "${c.corrected}"`).join('; ')}
`;

    const pastContext = history
      .slice(-6)
      .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${DR_NTP_SYSTEM_PROMPT}\n\n${contextData}\n\n[CONVERSATION HISTORY]\n${pastContext}\n\nSTUDENT QUESTION: ${userMessage}\n\nDR. NTP RESPONSE:`;

    const result = await model.generateContent(fullPrompt);
    const textResponse = result.response.text();

    return {
      reply: textResponse.trim()
    };
  } catch (error) {
    console.warn('Dr. NTP Gemini API call failed, using fallback:', error);
    return generateOfflineTutorResponse(userMessage, user, analytics);
  }
};

const generateOfflineTutorResponse = (
  userMessage: string,
  user: UserProfile,
  analytics: LearningAnalytics
): TutorResponse => {
  const lower = userMessage.toLowerCase();
  const topWeakWord = analytics.weakWords[0]?.term || 'environment';
  const topWeakTopic = analytics.weakTopics[0]?.topic || 'Present Perfect vs Past Simple';

  if (lower.includes('lộ trình') || lower.includes('hướng dẫn') || lower.includes('học thế nào') || lower.includes('plan')) {
    return {
      reply: `Chào ${user.name}! Với rank **${user.rank.toUpperCase()}** (${user.xp} XP) hiện tại, thầy Dr. NTP khuyên bạn nên tập trung khắc phục điểm yếu lớn nhất:\n\n1. **Từ vựng:** Ôn lại từ "${topWeakWord}" (bị sai ${analytics.weakWords[0]?.count || 2} lần).\n2. **Ngữ pháp:** Luyện tập lại chuyên đề "${topWeakTopic}".\n3. **Shadowing:** Nhai lại video YouTube 15 phút để nâng tỷ lệ chính xác từ ${analytics.overallAccuracy}% lên mốc 90%+.`,
      recommendedAction: { label: 'Vào Phòng Sửa Điểm Yếu', targetTab: 'tutor' }
    };
  }

  if (lower.includes('từ vựng') || lower.includes('vocabulary') || lower.includes('từ yếu')) {
    const listWords = analytics.weakWords.map(w => `• **${w.term}** (sai ${w.count} lần)`).join('\n');
    return {
      reply: `Thầy đã phân tích hệ thống dữ liệu: Các từ vựng bạn hay phát âm hoặc chọn sai đáp án nhất gồm:\n\n${listWords}\n\nHãy dành 5 phút lật Thẻ ghi nhớ Flashcards trong Phân hệ Từ vựng để chuyển các từ này vào kho nhớ lâu!`,
      recommendedAction: { label: 'Mở Kho Từ Vựng', targetTab: 'vocabulary' }
    };
  }

  if (lower.includes('ngữ pháp') || lower.includes('grammar') || lower.includes('lỗi sai')) {
    return {
      reply: `Theo ghi nhận từ các phiên hội thoại với Adam & Eva, bạn thường mắc lỗi chia thì Quá khứ đơn (Past Simple) và nhầm lẫn to-be với động từ thường (như *"I am agree"* -> *"I agree"*).\n\nThầy đã chuẩn bị bài tập ôn tập tức thì tại **Phòng Sửa Điểm Yếu (Weakness Remediation Lab)** phía trên!`,
      recommendedAction: { label: 'Làm Bài Sửa Lỗi Ngữ Pháp', targetTab: 'tutor' }
    };
  }

  return {
    reply: `Chào ${user.name}! Thầy Dr. NTP luôn theo dõi tiến độ của bạn. Hiện tại bạn đã tích lũy **${user.xp} XP** (Rank ${user.rank.toUpperCase()}) và đạt chuỗi **${user.streak} ngày Streak** liên tục.\n\nĐiểm Shadowing trung bình của bạn đang là **${analytics.overallAccuracy}%**. Bạn có câu hỏi nào về từ vựng hay cấu trúc ngữ pháp cần thầy giải đáp thêm không?`
  };
};
