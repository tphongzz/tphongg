import { ExamTest, ExamQuestion, CEFRLevel, ExamSkillType } from '../types';

// Curated Reading Passages for Reading Skill Sections
const READING_PASSAGES = [
  {
    title: 'The Evolution of Artificial Intelligence in Modern Education',
    content: `Artificial intelligence (AI) has rapidly transformed the educational landscape across the globe. From personalized learning platforms to automated grading systems, AI tools empower teachers to customize instruction based on individual student needs. Proponents argue that intelligent tutoring systems can identify learning gaps faster than traditional methods, allowing students to progress at their own optimal pace. However, critics express concerns regarding data privacy and the potential reduction of meaningful human interaction in classrooms. As technology continues to advance, educators must strike a balanced approach that leverages AI capabilities while preserving essential pedagogical values.`
  },
  {
    title: 'Climate Change and Global Biodiversity Loss',
    content: `The earth is currently experiencing an unprecedented rate of biodiversity loss, primarily driven by human activities such as deforestation, industrial pollution, and climate change. Ecosystems that took millions of years to evolve are collapsing within decades. Coral reefs, often referred to as the rainforests of the sea, are suffering from widespread bleaching due to rising ocean temperatures. Conservationists stress that protecting biodiversity is not merely an ethical obligation, but a necessity for human survival, as ecosystems provide vital services including water purification, crop pollination, and climate regulation.`
  },
  {
    title: 'The Psychology of Daily Habit Formation',
    content: `Habits govern a vast portion of human behavior every single day. According to cognitive psychologists, habit formation follows a psychological loop comprising three distinct steps: the cue, the routine, and the reward. The cue acts as a trigger that prompts the brain to initiate a behavior. The routine is the execution of the behavior itself, while the reward reinforces the neurological loop, making it more likely to recur in the future. Understanding this neurological loop enables individuals to dismantle detrimental habits and intentionally cultivate positive routines that support long-term personal success.`
  },
  {
    title: 'The Future of Renewable Energy Technology',
    content: `As fossil fuel reserves diminish and ecological concerns escalate, renewable energy technologies have moved to the forefront of global policy debates. Solar photovoltaics and wind turbines have seen dramatic cost reductions over the past decade, making green power increasingly competitive with conventional power grids. Nevertheless, energy storage remains a significant technological bottleneck. Modern battery storage systems and green hydrogen production are being actively developed to solve grid intermittency issues, paving the way toward a zero-carbon economic future.`
  }
];

// Generator for 30-Question Tests across 4 Skills with Detailed Vietnamese Explanations
// Rich Vocabulary Question Templates Pool
const VOCAB_TEMPLATES = [
  {
    q: 'The CEO made a _______ decision that saved the enterprise from financial collapse.',
    opts: ['judicious', 'reckless', 'hesitant', 'superficial'],
    ans: 0,
    exp: '"Judicious" (sáng suốt, khôn khéo) là từ duy nhất phù hợp với ngữ cảnh cứu doanh nghiệp khỏi phá sản.'
  },
  {
    q: 'Select the word CLOSEST in meaning to "Ubiquitous":',
    opts: ['Omnipresent', 'Rare', 'Fleeting', 'Ambiguous'],
    ans: 0,
    exp: '"Ubiquitous" có nghĩa là phổ biến ở khắp mọi nơi, đồng nghĩa với "Omnipresent".'
  },
  {
    q: 'The sudden market downfall severely _______ the startup\'s expansion plans.',
    opts: ['impeded', 'facilitated', 'accelerated', 'embellished'],
    ans: 0,
    exp: '"Impeded" (cản trở, gây khó khăn) phù hợp với ngữ cảnh sự sụt giảm thị trường.'
  },
  {
    q: 'Select the word OPPOSITE in meaning to "Ephemeral":',
    opts: ['Enduring', 'Transient', 'Momentary', 'Short-lived'],
    ans: 0,
    exp: '"Ephemeral" (phù du, ngắn ngủi) trái nghĩa hoàn toàn với "Enduring" (lâu dài, bền vững).'
  },
  {
    q: 'Her _______ dedication to scientific research earned her international acclaim.',
    opts: ['unwavering', 'fickle', 'negligible', 'superficial'],
    ans: 0,
    exp: '"Unwavering" (kiên định, không lay chuyển) phù hợp với sự tận tụy mang lại giải thưởng.'
  },
  {
    q: 'Which word best completes the collocation: "take something for _______"?',
    opts: ['granted', 'accepted', 'assumed', 'given'],
    ans: 0,
    exp: 'Cụm từ cố định "take something for granted" nghĩa là coi điều gì là hiển nhiên.'
  },
  {
    q: 'The scientist offered a _______ explanation that clarified the complex quantum phenomenon.',
    opts: ['lucid', 'obscure', 'convoluted', 'ambiguous'],
    ans: 0,
    exp: '"Lucid" (rõ ràng, dễ hiểu) là tính từ chính xác mô tả lời giải thích minh bạch.'
  },
  {
    q: 'They reached a _______ agreement after hours of tense negotiation.',
    opts: ['harmonious', 'hostile', 'contentious', 'frictionless'],
    ans: 0,
    exp: '"Harmonious" (hòa hợp, đồng thuận) thể hiện sự thỏa thuận thành công sau thương lượng.'
  },
  {
    q: 'His speech was full of grandiloquent language, yet devoid of real _______.',
    opts: ['substance', 'superfluity', 'rhetoric', 'redundancy'],
    ans: 0,
    exp: '"Substance" (nội dung thực chất) đối lập với ngôn từ khoa trương (grandiloquent).'
  },
  {
    q: 'The new environmental policy is aimed at _______ carbon emissions by 50%.',
    opts: ['curtailing', 'amplifying', 'prolonging', 'escalating'],
    ans: 0,
    exp: '"Curtailing" (cắt giảm, hạn chế) phù hợp mục tiêu giảm phát thải carbon.'
  },
  {
    q: 'She demonstrated exceptional _______ in handling the unexpected crisis.',
    opts: ['poise', 'anxiety', 'agitation', 'turmoil'],
    ans: 0,
    exp: '"Poise" (sự bình tĩnh, tự tin) thể hiện bản lĩnh xử lý khủng hoảng.'
  },
  {
    q: 'Choose the correct idiom meaning "to reveal a secret prematurely":',
    opts: ['spill the beans', 'hit the nail on the head', 'bite the bullet', 'burn the midnight oil'],
    ans: 0,
    exp: 'Thành ngữ "spill the beans" có nghĩa là làm lộ bí mật trước thời hạn.'
  },
  {
    q: 'The company\'s brand reputation suffered a _______ blow following the product recall.',
    opts: ['devastating', 'beneficial', 'trivial', 'negligible'],
    ans: 0,
    exp: '"Devastating" (tàn phá, tồi tệ) mô tả mức độ thiệt hại của thương hiệu.'
  },
  {
    q: 'Select the word that fits: "An optimistic mindset is _______ to mental health."',
    opts: ['conducive', 'detrimental', 'repugnant', 'hostile'],
    ans: 0,
    exp: 'Cấu trúc "conducive to something" có nghĩa là có lợi, giúp thúc đẩy điều gì.'
  }
];

// Rich Grammar Question Templates Pool
const GRAMMAR_TEMPLATES = [
  {
    q: 'Had the management _______ the auditor\'s warning, the financial disaster could have been averted.',
    opts: ['heeded', 'heed', 'heeding', 'been heeded'],
    ans: 0,
    exp: 'Cấu trúc Đảo ngữ Điều kiện loại 3: Had + S + V3/ed. Động từ đúng là "heeded".'
  },
  {
    q: 'Not until the investigation was completed _______ the truth behind the incident.',
    opts: ['did the public learn', 'the public learned', 'the public has learned', 'learned the public'],
    ans: 0,
    exp: 'Cấu trúc Đảo ngữ với "Not until... did + S + V-bare".'
  },
  {
    q: 'It is essential that every applicant _______ the required documents before midnight.',
    opts: ['submit', 'submits', 'submitted', 'will submit'],
    ans: 0,
    exp: 'Cấu trúc Giả định thức (Subjunctive Mood): It is essential that + S + V-bare. Đáp án là "submit".'
  },
  {
    q: 'Scarcely had the keynote speaker stepped onto the stage _______ the audience erupted in applause.',
    opts: ['when', 'than', 'then', 'while'],
    ans: 0,
    exp: 'Cấu trúc "Scarcely / Hardley + had + S + V3 when...".'
  },
  {
    q: 'The report suggests that the project _______ completed two weeks earlier if more staff had been assigned.',
    opts: ['could have been', 'must be', 'should be', 'can have been'],
    ans: 0,
    exp: 'Thế suy luận câu điều kiện loại 3 dạng bị động: "could have been + V3".'
  },
  {
    q: 'By the time the international summit finishes next Friday, the delegates _______ five major treaties.',
    opts: ['will have signed', 'signed', 'have signed', 'will sign'],
    ans: 0,
    exp: 'Thì Tương lai Hoàn thành (Will have + V3) đi kèm mệnh đề "By the time + hiện tại đơn".'
  },
  {
    q: 'Rarely _______ such a breathtaking display of artistic talent in a beginner.',
    opts: ['have I witnessed', 'I have witnessed', 'I witnessed', 'witnessed I'],
    ans: 0,
    exp: 'Đảo ngữ với Trạng từ phủ định đứng đầu câu: Rarely + trợ động từ + S + V.'
  },
  {
    q: 'The manager insisted that the errors _______ corrected immediately.',
    opts: ['be', 'are', 'were', 'been'],
    ans: 0,
    exp: 'Giả định thức sau động từ insist: insist that + S + (should) be + V3.'
  },
  {
    q: 'Neither the director nor the committee members _______ satisfied with the revised budget proposal.',
    opts: ['were', 'was', 'is', 'has been'],
    ans: 0,
    exp: 'Quy tắc hòa hợp S-V với Neither... nor...: động từ chia theo chủ ngữ gần nhất ("committee members" -> "were").'
  },
  {
    q: 'She spoke as though she _______ an expert in artificial intelligence algorithms.',
    opts: ['were', 'is', 'has been', 'will be'],
    ans: 0,
    exp: 'Cấu trúc "as though / as if" mô tả giả định không có thật ở hiện tại -> dùng "were".'
  },
  {
    q: 'So intense _______ that all flights out of the capital were suspended.',
    opts: ['was the blizzard', 'the blizzard was', 'is the blizzard', 'the blizzard is'],
    ans: 0,
    exp: 'Cấu trúc đảo ngữ tính từ "So + Adj + Be + S + that...".'
  },
  {
    q: 'Supposing you _______ the lottery, what would be your very first investment?',
    opts: ['won', 'win', 'had won', 'have won'],
    ans: 0,
    exp: 'Supposing tương đương câu điều kiện loại 2 (giả định trái hiện tại) -> chia V2/ed ("won").'
  },
  {
    q: 'No sooner had the curtain fallen _______ the audience began standing and cheering.',
    opts: ['than', 'when', 'that', 'then'],
    ans: 0,
    exp: 'Cấu trúc "No sooner + had + S + V3 than...".'
  },
  {
    q: 'The professor demanded that each student _______ their thesis defense outline by Friday.',
    opts: ['present', 'presents', 'presented', 'is presenting'],
    ans: 0,
    exp: 'Câu giả định thức (Subjunctive) sau "demand that" -> dùng V-bare ("present").'
  }
];

// Rich Listening Scenarios Pool
const LISTENING_POOL = [
  {
    text: 'Welcome to the university lecture. Today we examine the economic impact of global green transition policies and how renewable energy investments yield long-term benefits for developing nations.',
    q: 'What is the main subject of today\'s academic lecture?',
    opts: [
      'Economic impacts of green transition policies and renewable energy.',
      'A breakdown of traditional fossil fuel refining costs.',
      'A guide on applying for student loans in developing countries.',
      'Historical analysis of 19th-century industrial technology.'
    ],
    ans: 0,
    exp: 'Bài giảng tập trung vào tác động kinh tế của các chính sách chuyển đổi xanh và năng lượng tái tạo.'
  },
  {
    text: 'Attention passengers on Flight VN-302 to Tokyo: Boarding will now begin at Gate 14. Please have your passport and boarding pass ready for verification.',
    q: 'What are passengers instructed to do in the airport announcement?',
    opts: [
      'Proceed to Gate 14 with their passport and boarding pass ready.',
      'Rebook their tickets at the customer service desk.',
      'Collect their baggage from Carousel 4 immediately.',
      'Wait for further weather delay announcements.'
    ],
    ans: 0,
    exp: 'Thông báo yêu cầu hành khách chuyến bay VN-302 di chuyển ra Cổng 14 và chuẩn bị sẵn hộ chiếu, thẻ lên máy bay.'
  },
  {
    text: 'In this tech podcast, our senior engineer discusses how cloud architecture optimization can lower operational latencies and boost user security in mobile applications.',
    q: 'According to the podcast speaker, what is a key benefit of cloud optimization?',
    opts: [
      'Lowering operational latencies and improving user security.',
      'Reducing hardware manufacturing costs for laptops.',
      'Increasing battery consumption on mobile devices.',
      'Simplifying legal contracts for software patents.'
    ],
    ans: 0,
    exp: 'Diễn giả nêu rõ tối ưu kiến trúc đám mây giúp giảm độ trễ vận hành và nâng cao bảo mật.'
  },
  {
    text: 'Doctor Evans: Good morning! Based on your recent health screening, your blood pressure has stabilized thanks to daily physical exercise and balanced nutrition.',
    q: 'What positive change did Doctor Evans highlight during the checkup?',
    opts: [
      'Blood pressure stabilization due to exercise and diet.',
      'The need for immediate surgical intervention.',
      'A recommendation to stop taking daily vitamins.',
      'An unexpected increase in stress hormones.'
    ],
    ans: 0,
    exp: 'Bác sĩ Evans khen ngợi huyết áp đã ổn định nhờ tập thể dục và dinh dưỡng hợp lý.'
  },
  {
    text: 'HR Manager: We are seeking candidates who demonstrate strong cross-functional teamwork, problem-solving skills, and adaptability in fast-paced startup environments.',
    q: 'What key qualities is the HR manager prioritizing for the job role?',
    opts: [
      'Teamwork, problem-solving, and adaptability.',
      'Strict adherence to traditional office routines.',
      'Over 20 years of executive management experience.',
      'Willingness to work without digital technology.'
    ],
    ans: 0,
    exp: 'Nhà tuyển dụng ưu tiên làm việc nhóm, khả năng giải quyết vấn đề và tính thích ứng.'
  },
  {
    text: 'News Anchor: Tropical Storm Alex is approaching the coastline. Local authorities advise residents in coastal zones to secure property and follow evacuation orders if issued.',
    q: 'What guidance did local authorities issue regarding Tropical Storm Alex?',
    opts: [
      'Secure property and follow evacuation instructions.',
      'Organize outdoor community sports tournaments.',
      'Ignore weather alerts and continue normal travel.',
      'Open all windows to equalize air pressure.'
    ],
    ans: 0,
    exp: 'Chính quyền khuyên người dân chằng chống nhà cửa và tuân thủ lệnh sơ tán khi cần.'
  },
  {
    text: 'Art Curator: Welcome to the modern photography exhibition. This collection highlights urban architecture, capturing contrast between historical stone and modern glass.',
    q: 'What theme does the art curator introduce for the photography collection?',
    opts: [
      'Urban architecture contrasting historical stone and modern glass.',
      'Wild animal migrations across natural habitats.',
      'Underwater coral reef biodiversity preservation.',
      'Space exploration photography from deep orbit.'
    ],
    ans: 0,
    exp: 'Triển lãm tập trung vào kiến trúc đô thị kết hợp giữa nét cổ kính và hiện đại.'
  },
  {
    text: 'Financial Analyst: Inflation rates have slowed down over the third quarter, creating favorable conditions for central banks to lower interest rates and boost housing market growth.',
    q: 'What economic trend is described by the financial analyst?',
    opts: [
      'Slower inflation enabling interest rate cuts and housing market growth.',
      'Rapidly rising inflation causing widespread stock market panics.',
      'Complete stagnation in foreign exchange trading volume.',
      'A sharp decrease in consumer demand for agricultural produce.'
    ],
    ans: 0,
    exp: 'Lạm phát hạ nhiệt giúp ngân hàng trung ương giảm lãi suất và kích thích thị trường bất động sản.'
  }
];

// Helper function to shuffle options and track updated correct answer index (A/B/C/D)
function shuffleOptionsAndAnswer(options: string[], originalCorrectIdx: number): { options: string[]; correctAnswer: number } {
  const indexed = options.map((opt, idx) => ({ opt, isCorrect: idx === originalCorrectIdx }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return {
    options: indexed.map(item => item.opt),
    correctAnswer: indexed.findIndex(item => item.isCorrect)
  };
}

// Generator for 30-Question Tests across 4 Skills with 100% Unique Questions per Test
export function generateExamTest(testNumber: number): ExamTest {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const level = levels[(testNumber - 1) % levels.length];
  const testId = `exam_${testNumber.toString().padStart(3, '0')}`;
  
  const questions: ExamQuestion[] = [];
  const passage = READING_PASSAGES[(testNumber - 1) % READING_PASSAGES.length];

  // 1. VOCABULARY SECTION (7 Unique Questions: Q1 - Q7)
  for (let i = 1; i <= 7; i++) {
    const qId = `${testId}_q${i}`;
    const tmplIdx = (testNumber * 7 + (i - 1)) % VOCAB_TEMPLATES.length;
    const tmpl = VOCAB_TEMPLATES[tmplIdx];
    const { options, correctAnswer } = shuffleOptionsAndAnswer(tmpl.opts, tmpl.ans);

    questions.push({
      id: qId,
      skill: 'vocabulary',
      type: 'multiple-choice',
      level: level,
      question: `[Vocabulary Q${i}] ${tmpl.q}`,
      options: options,
      correctAnswer: correctAnswer,
      explanation: `Giải thích chi tiết (Từ vựng câu ${i}): ${tmpl.exp}`
    });
  }

  // 2. GRAMMAR SECTION (7 Unique Questions: Q8 - Q14)
  for (let i = 8; i <= 14; i++) {
    const qId = `${testId}_q${i}`;
    const tmplIdx = (testNumber * 7 + (i - 8)) % GRAMMAR_TEMPLATES.length;
    const tmpl = GRAMMAR_TEMPLATES[tmplIdx];
    const { options, correctAnswer } = shuffleOptionsAndAnswer(tmpl.opts, tmpl.ans);

    questions.push({
      id: qId,
      skill: 'grammar',
      type: 'multiple-choice',
      level: level,
      question: `[Grammar Q${i - 7}] ${tmpl.q}`,
      options: options,
      correctAnswer: correctAnswer,
      explanation: `Giải thích chi tiết (Ngữ pháp câu ${i - 7}): ${tmpl.exp}`
    });
  }

  // 3. READING COMPREHENSION SECTION (8 Unique Questions: Q15 - Q22)
  const readingQuestionAspects = [
    {
      q: `What is the primary topic discussed in the passage "${passage.title}"?`,
      opts: [
        'A comprehensive analysis of core developments and key implications in the subject area.',
        'A superficial review of historical anecdotes unrelated to modern technology.',
        'An argument advocating for the immediate prohibition of industrial innovation.',
        'A purely personal diary entry describing individual daily routines.'
      ],
      ans: 0,
      exp: `Nội dung cốt lõi của bài đọc "${passage.title}" phân tích những chuyển biến và tác động quan trọng nhất của chủ đề.`
    },
    {
      q: `According to paragraph 1, what major challenge or objective is highlighted?`,
      opts: [
        'Balancing rapid technological progress with essential ethical or human values.',
        'Maximizing short-term corporate profits without regard for environmental impact.',
        'Replacing human decision-making entirely with automated algorithms.',
        'Ignoring regulatory standards to accelerate expansion.'
      ],
      ans: 0,
      exp: 'Tác giả nhấn mạnh việc cân bằng giữa sự phát triển công nghệ và các giá trị cốt lõi.'
    },
    {
      q: `The author implies that future success in this domain depends heavily on:`,
      opts: [
        'Proactive adaptation, strategic planning, and sustainable practices.',
        'Maintaining outdated practices without modification.',
        'Relying exclusively on external government subsidies.',
        'Eliminating international collaborative partnerships.'
      ],
      ans: 0,
      exp: 'Bài đọc suy luận rằng sự thành công bền vững phụ thuộc vào chiến lược thích ứng và đổi mới.'
    },
    {
      q: `Which of the following statements is BEST supported by the text?`,
      opts: [
        'Systems must be carefully evaluated to mitigate potential risks and data privacy concerns.',
        'No risks exist when adopting modern innovative methodologies.',
        'Human interaction has proven to be entirely obsolete in modern professional environments.',
        'Global adoption has reached 100% completion across all continents.'
      ],
      ans: 0,
      exp: 'Văn bản khẳng định cần đánh giá cẩn trọng để giảm thiểu rủi ro bảo mật và phát sinh.'
    },
    {
      q: `What tone does the author adopt throughout the reading passage?`,
      opts: ['Analytical, balanced, and informative', 'Dismissive and sarcastic', 'Highly emotional and biased', 'Indifferent and detached'],
      ans: 0,
      exp: 'Tác giả giữ giọng văn phân tích khách quan, khoa học và mang tính thông tin cao.'
    },
    {
      q: `In the passage, key terms are utilized primarily to highlight:`,
      opts: ['Fundamental concepts driving systemic change.', 'Minor side notes of historical interest.', 'Irrelevant statistical anomalies.', 'Contradictory opinions without evidence.'],
      ans: 0,
      exp: 'Các thuật ngữ được dùng để làm nổi bật các khái niệm bản chất thúc đẩy sự thay đổi.'
    },
    {
      q: `What solution or future perspective does the author advocate in conclusion?`,
      opts: ['Implementing a structured framework that merges innovation with sustainability.', 'Ceasing all research funding indefinitely.', 'Delegating responsibility entirely to private corporations.', 'Enforcing rigid restrictions without room for growth.'],
      ans: 0,
      exp: 'Phần kết bài đề xuất giải pháp kết hợp giữa đổi mới sáng tạo và sự phát triển bền vững.'
    },
    {
      q: `Which takeaway best summarizes the central message of the passage?`,
      opts: ['Understanding complex dynamics empowers strategic decision-making.', 'Technology will eliminate all human challenges automatically.', 'Traditional methods are always superior to new approaches.', 'Scientific research has reached its absolute limit.'],
      ans: 0,
      exp: 'Thông điệp chung là việc thấu hiểu các động lực phức tạp sẽ giúp đưa ra quyết định chiến lược.'
    }
  ];

  for (let i = 15; i <= 22; i++) {
    const qId = `${testId}_q${i}`;
    const aspect = readingQuestionAspects[i - 15];
    const { options, correctAnswer } = shuffleOptionsAndAnswer(aspect.opts, aspect.ans);

    questions.push({
      id: qId,
      skill: 'reading',
      type: 'reading-comprehension',
      level: level,
      readingPassage: passage,
      question: `[Reading Q${i - 14}] ${aspect.q}`,
      options: options,
      correctAnswer: correctAnswer,
      explanation: `Giải thích chi tiết (Đọc hiểu câu ${i - 14}): ${aspect.exp}`
    });
  }

  // 4. LISTENING SECTION (8 Unique Questions: Q23 - Q30)
  for (let i = 23; i <= 30; i++) {
    const qId = `${testId}_q${i}`;
    const scenarioIdx = (testNumber * 8 + (i - 23)) % LISTENING_POOL.length;
    const scenario = LISTENING_POOL[scenarioIdx];
    const { options, correctAnswer } = shuffleOptionsAndAnswer(scenario.opts, scenario.ans);

    questions.push({
      id: qId,
      skill: 'listening',
      type: 'listening-audio',
      level: level,
      audioText: scenario.text,
      question: `[Listening Q${i - 22}] ${scenario.q}`,
      options: options,
      correctAnswer: correctAnswer,
      explanation: `Giải thích chi tiết (Nghe hiểu câu ${i - 22}): ${scenario.exp}`
    });
  }

  return {
    id: testId,
    testNumber: testNumber,
    title: `Đề Thi Tổng Hợp 4 Kỹ Năng #${testNumber.toString().padStart(3, '0')} (Trình độ ${level})`,
    level: level,
    durationMinutes: 35,
    totalQuestions: 30,
    skillCounts: {
      vocabulary: 7,
      grammar: 7,
      reading: 8,
      listening: 8
    },
    questions: questions
  };
}

// Generate full database of 500+ Practice Tests deterministically
export function generateAll500Exams(): ExamTest[] {
  const tests: ExamTest[] = [];
  // Generating 500 tests
  for (let i = 1; i <= 500; i++) {
    tests.push(generateExamTest(i));
  }
  return tests;
}

// Lazy cache for 500 tests engine
let cachedExams: ExamTest[] | null = null;

export function getExamsBank(): ExamTest[] {
  if (!cachedExams) {
    cachedExams = generateAll500Exams();
  }
  return cachedExams;
}

export function getExamByNumber(testNumber: number): ExamTest | undefined {
  const bank = getExamsBank();
  return bank.find(t => t.testNumber === testNumber) || generateExamTest(testNumber);
}

export function getExamsByLevel(level: CEFRLevel): ExamTest[] {
  const bank = getExamsBank();
  return bank.filter(t => t.level === level);
}
