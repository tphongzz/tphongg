import { MiniGameInfo, CrosswordCell } from '../types';

export const MINI_GAMES_LIST: MiniGameInfo[] = [
  {
    id: 'match',
    title: 'Word Match 3D Pro',
    subtitle: 'Nối Từ Tiếng Anh & Nghĩa Việt 3D',
    iconName: 'Grid',
    badge: '3D Match',
    color: '#00F0FF',
    description: 'Lật thẻ và nối cặp Từ vựng Tiếng Anh cùng Nghĩa Tiếng Việt tương ứng trong thời gian ngắn nhất!'
  },
  {
    id: 'unscramble',
    title: 'Word Unscramble',
    subtitle: 'Xếp Ký Tự Xáo Trộn Thành Từ Đúng',
    iconName: 'Shuffle',
    badge: 'Spelling',
    color: '#7000FF',
    description: 'Giải mã các chữ cái bị xáo trộn để khôi phục lại từ vựng chuẩn xác và chính tả.'
  },
  {
    id: 'speed',
    title: 'Speed Quiz 10s',
    subtitle: 'Thách Thức Phản Xạ 10 Giây',
    iconName: 'Zap',
    badge: 'Fast Pace',
    color: '#FF007A',
    description: 'Trả lời nhanh các câu hỏi ngữ pháp & từ vựng trong vòng 10 giây mỗi câu để ghi điểm combo!'
  },
  {
    id: 'listening',
    title: 'Listening Hero',
    subtitle: 'Nghe Âm Thanh & Bắt Từ Đúng',
    iconName: 'Headphones',
    badge: 'Audio Game',
    color: '#00FF66',
    description: 'Lắng nghe audio phát âm từ vựng bản ngữ và chọn từ chính xác trước khi thời gian trôi qua.'
  },
  {
    id: 'builder',
    title: 'Sentence Builder',
    subtitle: 'Xếp Khối Từ Thành Câu Ngữ Pháp',
    iconName: 'Layers',
    badge: 'Grammar Drag',
    color: '#FFB800',
    description: 'Sắp xếp các khối từ vựng xáo trộn thành một câu Tiếng Anh hoàn chỉnh chuẩn ngữ pháp.'
  },
  {
    id: 'boss',
    title: 'Grammar Boss Battle',
    subtitle: 'Trận Chiến Trùm Ngữ Pháp RPG',
    iconName: 'Swords',
    badge: 'RPG Battle',
    color: '#FF3333',
    description: 'Hóa thân thành Dũng sĩ Ngữ Pháp, trả lời đúng các câu trắc nghiệm để tung chiêu đánh bại Quái vật Boss!'
  },
  {
    id: 'crossword',
    title: 'Vocabulary Crossword',
    subtitle: 'Giải Ô Chữ Tiếng Anh Thông Minh',
    iconName: 'Table',
    badge: 'Puzzle Grid',
    color: '#00D2FF',
    description: 'Đọc gợi ý định nghĩa và điền các ký tự vào ma trận ô chữ Tiếng Anh để mở khóa từ khóa bí ẩn.'
  },
  {
    id: 'runner',
    title: 'Word Runner Arcade',
    subtitle: 'Chạy Đua Né Chướng Ngại & Bắt Từ',
    iconName: 'Activity',
    badge: 'Arcade Run',
    color: '#FF00E5',
    description: 'Điều khiển nhân vật chạy đua, thu thập các từ vựng đúng và né tránh từ sai chính tả trên đường chạy!'
  },
  {
    id: 'ninja',
    title: 'Pronunciation Ninja',
    subtitle: 'Ninja Phát Âm Chấm Điểm Voice',
    iconName: 'Mic',
    badge: 'AI Voice Ninja',
    color: '#A855F7',
    description: 'Đọc to phát âm từ vựng theo mic, nhận chấm điểm độ chuẩn xác giọng nói % real-time để ghi điểm Ninja!'
  },
  {
    id: 'memory',
    title: 'Memory Flip Cards',
    subtitle: 'Game Trí Nhớ Thẻ Ghi Nhớ 3D',
    iconName: 'RotateCw',
    badge: 'Memory Brain',
    color: '#3B82F6',
    description: 'Lật và ghi nhớ vị trí các cặp thẻ từ vựng - hình ảnh/ví dụ để rèn luyện trí nhớ lâu dài.'
  }
];

// Data Pool for Sentence Builder
export const SENTENCE_BUILDER_POOL = [
  {
    id: 'sb_1',
    scrambled: ['learning', 'English', 'is', 'a', 'rewarding', 'journey'],
    correct: 'learning English is a rewarding journey',
    translation: 'Học tiếng Anh là một hành trình đầy phần thưởng xứng đáng.'
  },
  {
    id: 'sb_2',
    scrambled: ['technology', 'has', 'transformed', 'the', 'way', 'we', 'communicate'],
    correct: 'technology has transformed the way we communicate',
    translation: 'Công nghệ đã thay đổi cách chúng ta giao tiếp.'
  },
  {
    id: 'sb_3',
    scrambled: ['she', 'has', 'been', 'working', 'here', 'since', '2020'],
    correct: 'she has been working here since 2020',
    translation: 'Cô ấy đã làm việc ở đây từ năm 2020.'
  },
  {
    id: 'sb_4',
    scrambled: ['if', 'it', 'rains', 'tomorrow', 'we', 'will', 'stay', 'home'],
    correct: 'if it rains tomorrow we will stay home',
    translation: 'Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà.'
  }
];

// Data Pool for Grammar Boss Battle
export const BOSS_BATTLE_STAGES = [
  {
    stage: 1,
    bossName: 'Shadow Golem (Goblin Ngữ Pháp)',
    hp: 100,
    avatar: '👺',
    questions: [
      {
        q: 'She _______ to school every day by bus.',
        options: ['goes', 'going', 'go', 'went'],
        ans: 0,
        damage: 35,
        exp: 'Dấu hiệu "every day" -> Hiện tại đơn với主語 số ít "She goes".'
      },
      {
        q: 'They _______ TV when the phone rang.',
        options: ['were watching', 'watched', 'are watching', 'have watched'],
        ans: 0,
        damage: 35,
        exp: 'Hành động đang xảy ra trong quá khứ bị hành động khác xen vào -> Quá khứ tiếp diễn (were watching).'
      },
      {
        q: 'Look! The airplane _______ off.',
        options: ['is taking', 'takes', 'took', 'has taken'],
        ans: 0,
        damage: 35,
        exp: 'Dấu hiệu "Look!" -> Hiện tại tiếp diễn (is taking).'
      }
    ]
  },
  {
    stage: 2,
    bossName: 'Dragon Lord Syntax (Rồng Ngữ Pháp)',
    hp: 150,
    avatar: '🐉',
    questions: [
      {
        q: 'Had I known about the party, I _______ you.',
        options: ['would have invited', 'invited', 'will invite', 'would invite'],
        ans: 0,
        damage: 50,
        exp: 'Đảo ngữ điều kiện loại 3 ("Had I known") -> Vế sau dùng "would have V3".'
      },
      {
        q: 'Under no circumstances _______ the door.',
        options: ['should you open', 'you should open', 'did you opened', 'you opened'],
        ans: 0,
        damage: 50,
        exp: 'Đảo ngữ với "Under no circumstances" -> Đưa trợ động từ lên trước chủ ngữ (should you open).'
      },
      {
        q: 'It is essential that he _______ the report on time.',
        options: ['submit', 'submits', 'submitted', 'has submitted'],
        ans: 0,
        damage: 50,
        exp: 'Cấu trúc giả định Subjunctive Mood ("essential that S + V-bare") -> "submit" nguyên mẫu.'
      }
    ]
  }
];

// Sample Crossword Grid Data
export const SAMPLE_CROSSWORD_GRID: CrosswordCell[][] = [
  [
    { row: 0, col: 0, letter: 'H', number: 1, userLetter: '' },
    { row: 0, col: 1, letter: 'A', userLetter: '' },
    { row: 0, col: 2, letter: 'P', userLetter: '' },
    { row: 0, col: 3, letter: 'P', userLetter: '' },
    { row: 0, col: 4, letter: 'Y', userLetter: '' }
  ],
  [
    { row: 1, col: 0, letter: 'E', number: 2, userLetter: '' },
    { row: 1, col: 1, letter: '', isBlocked: true },
    { row: 1, col: 2, letter: '', isBlocked: true },
    { row: 1, col: 3, letter: '', isBlocked: true },
    { row: 1, col: 4, letter: '', isBlocked: true }
  ],
  [
    { row: 2, col: 0, letter: 'R', userLetter: '' },
    { row: 2, col: 1, letter: 'O', number: 3, userLetter: '' },
    { row: 2, col: 2, letter: 'C', userLetter: '' },
    { row: 2, col: 3, letter: 'K', userLetter: '' },
    { row: 2, col: 4, letter: '', isBlocked: true }
  ],
  [
    { row: 3, col: 0, letter: 'O', userLetter: '' },
    { row: 3, col: 1, letter: '', isBlocked: true },
    { row: 3, col: 2, letter: '', isBlocked: true },
    { row: 3, col: 3, letter: '', isBlocked: true },
    { row: 3, col: 4, letter: '', isBlocked: true }
  ]
];

export const CROSSWORD_CLUES = [
  { number: 1, direction: 'Across', clue: 'Feeling or showing pleasure and contentment (5 letters)', answer: 'HAPPY', explanation: 'HAPPY (tính từ) có 5 chữ cái, nghĩa là vui vẻ, hạnh phúc.' },
  { number: 2, direction: 'Down', clue: 'A person who risks lives to save others (4 letters)', answer: 'HERO', explanation: 'HERO (danh từ) gồm 4 chữ cái, nghĩa là người anh hùng.' },
  { number: 3, direction: 'Across', clue: 'A solid mass of geological material or genre of music (4 letters)', answer: 'ROCK', explanation: 'ROCK (danh từ) nghĩa là đá khối hoặc thể loại nhạc Rock.' }
];
