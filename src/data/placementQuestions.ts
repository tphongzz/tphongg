import { PlacementQuestion } from '../types';

export const placementQuestions: PlacementQuestion[] = [
  // ==================== PART 1: VOCABULARY & IDIOMS (5 QUESTIONS) ====================
  {
    id: 'pq_1',
    type: 'multiple-choice',
    level: 'A1',
    question: 'Choose the word that means "a feeling of great pleasure and satisfaction":',
    options: ['Sadness', 'Happiness', 'Anger', 'Boredom'],
    correctAnswer: 'Happiness',
    explanation: '"Happiness" có nghĩa là sự hạnh phúc, niềm vui sướng.'
  },
  {
    id: 'pq_2',
    type: 'multiple-choice',
    level: 'A2',
    question: 'Which of the following refers to bags and cases taken when traveling?',
    options: ['Furniture', 'Luggage', 'Appliances', 'Garbage'],
    correctAnswer: 'Luggage',
    explanation: '"Luggage" là danh từ chỉ hành lý mang theo khi đi du lịch.'
  },
  {
    id: 'pq_3',
    type: 'multiple-choice',
    level: 'B1',
    question: 'Select the synonym for "collaborate":',
    options: ['Compete', 'Work together', 'Separate', 'Ignore'],
    correctAnswer: 'Work together',
    explanation: '"Collaborate" nghĩa là cộng tác, làm việc cùng nhau (work together).'
  },
  {
    id: 'pq_4',
    type: 'multiple-choice',
    level: 'B2',
    question: 'What does the adjective "comprehensive" mean?',
    options: ['Difficult to understand', 'Complete and thorough', 'Narrow in scope', 'Cheap in price'],
    correctAnswer: 'Complete and thorough',
    explanation: '"Comprehensive" nghĩa là toàn diện, bao quát mọi mặt (complete and thorough).'
  },
  {
    id: 'pq_5',
    type: 'multiple-choice',
    level: 'C1',
    question: 'What is the meaning of the idiom "once in a blue moon"?',
    options: ['Very frequently', 'Very rarely', 'Every month', 'Never'],
    correctAnswer: 'Very rarely',
    explanation: '"Once in a blue moon" là thành ngữ chỉ một sự việc rất hiếm khi xảy ra.'
  },

  // ==================== PART 2: GRAMMAR & STRUCTURE (5 QUESTIONS) ====================
  {
    id: 'pq_6',
    type: 'fill-blank',
    level: 'A1',
    question: 'Complete the sentence: "She _______ coffee every morning before work."',
    options: ['drink', 'drinks', 'is drinking', 'drank'],
    correctAnswer: 'drinks',
    explanation: 'Thói quen hằng ngày ở thì Hiện tại đơn đi với chủ ngữ số ít "She" -> drinks.'
  },
  {
    id: 'pq_7',
    type: 'fill-blank',
    level: 'A2',
    question: 'Complete the sentence: "We _______ in this city since 2018."',
    options: ['live', 'lived', 'have lived', 'are living'],
    correctAnswer: 'have lived',
    explanation: 'Trạng từ "since 2018" báo hiệu thì Hiện tại hoàn thành -> have lived.'
  },
  {
    id: 'pq_8',
    type: 'fill-blank',
    level: 'B1',
    question: 'Complete the sentence: "If I _______ rich, I would travel around the world."',
    options: ['am', 'were', 'had been', 'will be'],
    correctAnswer: 'were',
    explanation: 'Câu điều kiện loại 2 giả định trái hiện tại -> Dùng "were" cho tất cả các ngôi.'
  },
  {
    id: 'pq_9',
    type: 'fill-blank',
    level: 'B2',
    question: 'Complete the sentence: "If you had trained harder, you _______ the championship match."',
    options: ['will win', 'would win', 'would have won', 'had won'],
    correctAnswer: 'would have won',
    explanation: 'Câu điều kiện loại 3 giả định trái quá khứ (If had V3) -> Mệnh đề chính: would have won.'
  },
  {
    id: 'pq_10',
    type: 'fill-blank',
    level: 'C1',
    question: 'Complete the sentence: "No sooner _______ at the station than the train left."',
    options: ['he had arrived', 'had he arrived', 'he arrived', 'did he arrive'],
    correctAnswer: 'had he arrived',
    explanation: 'Cấu trúc đảo ngữ "No sooner + had + S + V3... than..." chỉ hành động vừa xảy ra thì hành động khác nối tiếp.'
  },

  // ==================== PART 3: READING COMPREHENSION (5 QUESTIONS) ====================
  {
    id: 'pq_11',
    type: 'multiple-choice',
    level: 'A2',
    question: 'Read: "Anna loves baking cakes on weekends. She often shares her fresh cookies with neighbors." -> What does Anna do on weekends?',
    options: ['She works in a factory', 'She bakes cakes and cookies', 'She goes swimming', 'She visits the museum'],
    correctAnswer: 'She bakes cakes and cookies',
    explanation: 'Đoạn văn ghi rõ Anna yêu thích việc nướng bánh vào cuối tuần (bakes cakes and cookies).'
  },
  {
    id: 'pq_12',
    type: 'multiple-choice',
    level: 'B1',
    question: 'Read: "Remote work offers flexibility, but it requires strong self-discipline to stay productive." -> What is a requirement for remote work?',
    options: ['Higher salary', 'Strong self-discipline', 'A large office space', 'Daily commuting'],
    correctAnswer: 'Strong self-discipline',
    explanation: 'Đoạn văn nêu rõ công việc từ xa yêu cầu tính tự giác cao (strong self-discipline).'
  },
  {
    id: 'pq_13',
    type: 'multiple-choice',
    level: 'B2',
    question: 'Read: "Artificial intelligence is reshaping healthcare by predicting patient outcomes and accelerating drug discovery." -> How does AI impact healthcare?',
    options: ['By replacing doctors completely', 'By slowing down research', 'By predicting patient outcomes and accelerating research', 'By increasing medical costs'],
    correctAnswer: 'By predicting patient outcomes and accelerating research',
    explanation: 'Đoạn văn ghi rõ AI cải tiến y tế nhờ dự đoán kết quả bệnh nhân và tăng tốc phát hiện thuốc.'
  },
  {
    id: 'pq_14',
    type: 'multiple-choice',
    level: 'C1',
    question: 'Read: "Notwithstanding economic headwinds, the tech industry demonstrated remarkable resilience through strategic diversification." -> What helped the tech industry withstand economic challenges?',
    options: ['Government bailouts', 'Strategic diversification', 'Massive layoffs alone', 'Reducing innovation'],
    correctAnswer: 'Strategic diversification',
    explanation: 'Cụm "through strategic diversification" chỉ ra đa dạng hóa chiến lược giúp ngành công nghệ kiên cường.'
  },
  {
    id: 'pq_15',
    type: 'multiple-choice',
    level: 'C2',
    question: 'What is the tone of a writer who describes a claim as "unsubstantiated rhetoric devoid of empirical merit"?',
    options: ['Enthusiastic', 'Skeptical and critical', 'Neutral and supportive', 'Indifferent'],
    correctAnswer: 'Skeptical and critical',
    explanation: 'Cụm từ "unsubstantiated rhetoric devoid of empirical merit" thể hiện thái độ rất hoài nghi và chỉ trích nặng nề.'
  },

  // ==================== PART 4: LISTENING & PRONUNCIATION (5 QUESTIONS) ====================
  {
    id: 'pq_16',
    type: 'listening',
    level: 'A1',
    question: 'Listen to the audio text and select the exact sentence spoken:',
    audioText: 'Welcome to English NTP learning platform.',
    options: [
      'Welcome to English NTP learning platform.',
      'Welcome to English HQ teaching center.',
      'Welcome to England learning class.',
      'We welcome you to English study.'
    ],
    correctAnswer: 'Welcome to English NTP learning platform.',
    explanation: 'Audio đọc chính xác câu: "Welcome to English NTP learning platform."'
  },
  {
    id: 'pq_17',
    type: 'listening',
    level: 'A2',
    question: 'Listen to the audio text and select the correct sentence:',
    audioText: 'Consistency is the secret key to mastering any foreign language.',
    options: [
      'Consistency is the secret key to mastering any foreign language.',
      'Constancy is the only way to speak foreign languages.',
      'Persistence makes you fluent in foreign language.',
      'Consistency is easy for learning foreign words.'
    ],
    correctAnswer: 'Consistency is the secret key to mastering any foreign language.',
    explanation: 'Audio đọc chính xác câu: "Consistency is the secret key to mastering any foreign language."'
  },
  {
    id: 'pq_18',
    type: 'listening',
    level: 'B1',
    question: 'Listen to the audio text and identify the main message:',
    audioText: 'Practicing daily for twenty minutes is far better than studying three hours once a week.',
    options: [
      'Daily 20-minute practice is better than 3 hours once a week.',
      'Studying 3 hours once a week is the best strategy.',
      'You should study twenty hours every single week.',
      'Practice only when you have free weekend hours.'
    ],
    correctAnswer: 'Daily 20-minute practice is better than 3 hours once a week.',
    explanation: 'Nội dung cốt lõi của audio khuyên nên luyện tập 20 phút mỗi ngày thay vì học dồn 3 tiếng 1 lần mỗi tuần.'
  },
  {
    id: 'pq_19',
    type: 'listening',
    level: 'B2',
    question: 'Listen to the audio text and choose the correct transcript:',
    audioText: 'Technological innovations have fundamentally transformed modern communication methods.',
    options: [
      'Technological innovations have fundamentally transformed modern communication methods.',
      'Technical inventions have destroyed communication methods.',
      'Technology has simplified traditional communication.',
      'Modern devices have changed communication forever.'
    ],
    correctAnswer: 'Technological innovations have fundamentally transformed modern communication methods.',
    explanation: 'Audio đọc chính xác câu: "Technological innovations have fundamentally transformed modern communication methods."'
  },
  {
    id: 'pq_20',
    type: 'listening',
    level: 'C1',
    question: 'Listen to the advanced sentence and select the correct option:',
    audioText: 'Meticulous preparation combined with resilient execution ensures sustainable long-term success.',
    options: [
      'Meticulous preparation combined with resilient execution ensures sustainable long-term success.',
      'Methodical preparation leads to short-term performance.',
      'Careful planning is unimportant for corporate success.',
      'Resilient execution is unnecessary when planning well.'
    ],
    correctAnswer: 'Meticulous preparation combined with resilient execution ensures sustainable long-term success.',
    explanation: 'Audio đọc chính xác câu chuẩn C1: "Meticulous preparation combined with resilient execution ensures sustainable long-term success."'
  }
];
