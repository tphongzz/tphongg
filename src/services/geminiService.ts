import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage } from '../types';

export type PersonaType = 'adam' | 'eva';

export interface GeminiChatResponse {
  reply: string;
  grammarFix?: {
    original: string;
    corrected: string;
    explanation: string;
  };
}

const ADAM_SYSTEM_PROMPT = `
You are Adam, a friendly, casual, and encouraging male English practice partner for an English learner.
Your conversation style is:
- Friendly, warm, energetic, and uses natural everyday American/British English.
- Keep replies brief and conversational (2-3 sentences max).
- Ask engaging follow-up questions to keep the conversation flowing.
- Always inspect the user's latest English message for grammar or vocabulary errors.

CRITICAL INSTRUCTION: You MUST output your response ONLY in valid JSON format matching this schema:
{
  "reply": "Your conversational English response to the user",
  "grammarFix": null or {
    "original": "Exact sentence or phrase with grammatical or vocabulary error",
    "corrected": "Natural, corrected version of that sentence",
    "explanation": "Clear, friendly explanation in Vietnamese of why it was corrected"
  }
}
If the user's English is grammatically correct or mostly natural, set "grammarFix" to null.
Do NOT wrap your output in backticks or markdown codeblocks if possible, or output pure JSON.
`;

const EVA_SYSTEM_PROMPT = `
You are Eva, a professional, elegant, and highly articulate female English tutor.
Your conversation style is:
- Polished, academic, professional, and refined (ideal for IELTS, business, and formal communication).
- Concise, clear, and instructive (2-4 sentences max).
- Gently highlight higher-level vocabulary or better phrasing.
- Carefully inspect the user's latest message for subtle grammar, preposition, tense, or style errors.

CRITICAL INSTRUCTION: You MUST output your response ONLY in valid JSON format matching this schema:
{
  "reply": "Your polished English response to the user",
  "grammarFix": null or {
    "original": "Sentence or phrase with error or un-natural phrasing",
    "corrected": "Polished, grammatically accurate version",
    "explanation": "Detailed, professional explanation in Vietnamese of the grammatical rule or stylistic improvement"
  }
}
If the user's English is completely accurate, set "grammarFix" to null.
Do NOT wrap your output in backticks or markdown codeblocks if possible, or output pure JSON.
`;

/**
 * Send a message to Gemini AI or use smart fallback
 */
export const sendMessageToGemini = async (
  apiKey: string | undefined,
  persona: PersonaType,
  userMessage: string,
  history: ChatMessage[] = []
): Promise<GeminiChatResponse> => {
  // If no API Key provided, fallback to Smart Mock AI
  if (!apiKey || apiKey.trim() === '') {
    return generateMockResponse(persona, userMessage);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        responseMimeType: 'application/json',
      },
    });

    const systemPrompt = persona === 'adam' ? ADAM_SYSTEM_PROMPT : EVA_SYSTEM_PROMPT;

    // Convert past chat history into context format
    const contextPrompt = history
      .slice(-6)
      .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\n[CONVERSATION HISTORY]\n${contextPrompt}\n\nUSER: ${userMessage}\n\nASSISTANT:`;

    const result = await model.generateContent(fullPrompt);
    const textResponse = result.response.text();

    return parseGeminiResponse(textResponse, persona, userMessage);
  } catch (error) {
    console.warn('Gemini API call failed or quota exceeded, using fallback:', error);
    return generateMockResponse(persona, userMessage);
  }
};

/**
 * Helper to safely parse JSON response from Gemini
 */
const parseGeminiResponse = (
  rawText: string,
  persona: PersonaType,
  userMessage: string
): GeminiChatResponse => {
  try {
    // Clean markdown code blocks if Gemini wrapped JSON in ```json ... ```
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanJson);
    if (parsed && typeof parsed.reply === 'string') {
      return {
        reply: parsed.reply,
        grammarFix:
          parsed.grammarFix && parsed.grammarFix.original && parsed.grammarFix.corrected
            ? parsed.grammarFix
            : undefined,
      };
    }
  } catch (e) {
    console.error('Failed to parse Gemini JSON output, using raw text:', e);
  }

  // Fallback if parsing failed
  return {
    reply: rawText.replace(/```json/g, '').replace(/```/g, '').trim(),
    grammarFix: checkBasicGrammarFallback(userMessage),
  };
};

/**
 * Basic offline grammar check for fallback
 */
const checkBasicGrammarFallback = (text: string) => {
  const lower = text.toLowerCase().trim();
  if (lower.includes('i goes') || lower.includes('he go') || lower.includes('she go')) {
    return {
      original: text,
      corrected: text
        .replace(/i goes/gi, 'I go')
        .replace(/he go /gi, 'he goes ')
        .replace(/she go /gi, 'she goes '),
      explanation: 'Sử dụng đúng chia động từ ở thì hiện tại đơn (I go, He/She goes).',
    };
  }
  if (lower.includes('yesterday i go') || lower.includes('yesterday i buy')) {
    return {
      original: text,
      corrected: text
        .replace(/yesterday i go/gi, 'yesterday I went')
        .replace(/yesterday i buy/gi, 'yesterday I bought'),
      explanation: 'Thì quá khứ đơn (Past Simple) dùng động từ quá khứ "went/bought" thay cho động từ nguyên mẫu.',
    };
  }
  if (lower.includes('i am agree') || lower.includes('i am disagree')) {
    return {
      original: text,
      corrected: text.replace(/i am agree/gi, 'I agree').replace(/i am disagree/gi, 'I disagree'),
      explanation: '"Agree" là một động từ, không dùng to-be "am agree". Hãy dùng "I agree".',
    };
  }
  return undefined;
};

/**
 * Smart Mock AI Response generator when offline or API key is absent
 */
const generateMockResponse = (persona: PersonaType, userMessage: string): GeminiChatResponse => {
  const lower = userMessage.toLowerCase();

  // Grammar check
  const grammarFix = checkBasicGrammarFallback(userMessage);

  if (persona === 'adam') {
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return {
        reply: "Hey there! It's awesome to talk to you today. How is your day going so far?",
        grammarFix,
      };
    }
    if (lower.includes('coffee') || lower.includes('order')) {
      return {
        reply: "I love coffee! What's your go-to drink? I usually get an iced caramel macchiato.",
        grammarFix,
      };
    }
    if (lower.includes('hobbies') || lower.includes('like') || lower.includes('movie')) {
      return {
        reply: "That sounds super interesting! In my free time, I really enjoy listening to music and watching sci-fi movies. What about you?",
        grammarFix,
      };
    }
    if (lower.includes('weather') || lower.includes('today')) {
      return {
        reply: "The weather really affects my mood! Is it sunny or rainy where you are right now?",
        grammarFix,
      };
    }
    return {
      reply: `That's a great point! Tell me more about that. Why do you think so?`,
      grammarFix,
    };
  } else {
    // Eva Persona
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return {
        reply: "Good day! I am delighted to practice English with you. What topic shall we explore in our lesson today?",
        grammarFix,
      };
    }
    if (lower.includes('interview') || lower.includes('job') || lower.includes('work')) {
      return {
        reply: "Excellent topic. In professional interviews, highlighting your achievements with specific metrics is essential. Could you describe your current role or aspirations?",
        grammarFix,
      };
    }
    if (lower.includes('ielts') || lower.includes('study') || lower.includes('exam')) {
      return {
        reply: "Preparation is key to mastering academic exams. Focusing on advanced vocabulary and cohesive devices will significantly boost your score.",
        grammarFix,
      };
    }
    return {
      reply: "Indeed. Expressing complex ideas clearly requires precision in sentence structure. Could you elaborate on your perspective?",
      grammarFix,
    };
  }
};

/**
 * Generate quick AI tutor explanation for word lookup or grammar points
 */
export const generateTutorExplanation = async (prompt: string, level: string = 'B2'): Promise<string> => {
  return `📌 Phân Tích Từ Vựng:
• Nghĩa Tiếng Việt: Từ vựng quan trọng giúp nâng cao phản xạ nói & viết.
• 2 Cụm từ hay gặp (Collocations): "great happiness", "pursue happiness".
• Mẹo nhớ nhanh: Nhớ lại cảm xúc thăng hoa khi vừa hoàn thành xuất sắc một mục tiêu lớn!`;
};
