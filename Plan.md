# DỰ ÁN: ENGLISH NTP - NỀN TẢNG HỌC TIẾNG ANH AI THÔNG MINH

> **Tài liệu Kế hoạch Tổng thể, Quy chuẩn Kỹ thuật, Lộ trình Chi tiết & Nhật ký Tiến độ Project.**  
> *Lưu ý cho AI Agent / Developer: Đọc file này ở đầu mỗi phiên chat để hiểu toàn bộ bối cảnh, quy tắc và trạng thái dự án hiện tại.*

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

**English NTP** là nền tảng web học tiếng Anh đa tương tác tích hợp Trí tuệ nhân tạo (AI Gemini), mang lại trải nghiệm học tập cá nhân hóa toàn diện gồm các phân hệ:
1. **Từ vựng & Ngữ pháp (Vocabulary & Grammar):** Kho bài học phân cấp theo chuẩn CEFR (A1 -> C2), thẻ ghi nhớ (Flashcards), bài tập tương tác.
2. **Hệ thống Rank & Bài test phân cấp (Placement & Leveling System):** Đánh giá đầu vào, tích điểm XP, tăng hạng rank (Đồng, Bạc, Vàng, Kim Cương, Cao Thủ...), mở khóa bài học theo trình độ.
3. **Chatbot 1:1 Giao tiếp (Adam & Eva):** 
   - **Adam:** Nam gia sư/bạn học thân thiện, phong cách đời thường, tạo động lực, sửa lỗi giao tiếp nhẹ nhàng.
   - **Eva:** Nữ gia sư chuyên nghiệp, chuẩn mực academic/business, sửa kỹ từng phát âm & cấu trúc ngữ pháp.
   - Tích hợp **Voice Input (STT)** & **Voice Output (TTS)** giúp luyện nói 1:1 như với người thật.
4. **Shadowing English qua YouTube Video:** Nhập URL YouTube -> AI/App tách Transcript -> Đồng bộ phụ đề -> Luyện nghe, nhại giọng (Shadowing), thu âm & nhận phản hồi độ chính xác.
5. **AI Tutor Gia sư Tổng quản (Smart Central AI Tutor):** AI nắm toàn bộ dữ liệu học tập của người dùng (trình độ rank hiện tại, từ vựng đã thuộc/chưa thuộc, lỗi sai thường gặp), đưa ra lời khuyên & bài tập gợi ý riêng.

---

## 2. QUY NẮC PHÁT TRIỂN & NGUYÊN TẮC HOẠT ĐỘNG (DEVELOPMENT RULES)

1. **Nguyên tắc Chia nhỏ & Kiểm thử (Modular & Step-by-Step):**
   - Làm xong feature nào phải test hoàn chỉnh, fix sạch lỗi rồi mới chuyển sang feature tiếp theo.
   - Không viết code ồ ạt nhiều module cùng lúc.
2. **Nguyên tắc Giao diện (UI/UX Excellence):**
   - Áp dụng giao diện Hiện đại, Sang trọng (Dark Mode / Glassmorphism, Micro-animations, phối màu theo HSL harmonious).
   - Tối ưu trải nghiệm trên mọi thiết bị (Responsive).
3. **Nguyên tắc Quản lý Trạng thái & Dữ liệu (Clean Architecture):**
   - Tách biệt rõ ràng: UI Layer, Service Layer (Gemini API, Web Speech API, Youtube Parser), State Management, Local Storage / Database Layer.
4. **Nguyên tắc Cập nhật `Plan.md`:**
   - Mỗi khi hoàn thành 1 Task / Phase hoặc thay đổi kiến trúc, Agent bắt buộc phải cập nhật mục **6. NHẬT KÝ TIẾN ĐỘ (CHANGELOG)** trong file này.
5. **Nguyên tắc Kiểm thử & Git Commit/Push Tự động (Auto Test & Git Push):**
   - Sau khi code xong và kiểm thử (`npm run build`) thành công bất kỳ task hay tính năng nào, Agent bắt buộc phải tạo Git commit với thông điệp rõ ràng và chạy `git push` trực tiếp lên GitHub repository (`hoquan2007/EnglishNTP`) để tự động kích hoạt Vercel Deployment.

---

## 3. PHÂN TÍCH THỰC TẾ, KHÓ KHĂN & PHƯƠNG ÁN GIẢI QUYẾT

### 3.1. Phân tích Tài nguyên & Nguồn lấy dữ liệu (Resources & Data Sources)
- **Dữ liệu Từ vựng (Vocabulary):**
  - *Nguồn:* Oxford 3000/5000 wordlist, CEFR Standard Datasets, Free Dictionary API (`api.dictionaryapi.dev` - lấy phiên âm IPA, audio chuẩn, định nghĩa, ví dụ).
  - *Giải pháp:* Đóng gói sẵn file JSON chuẩn hóa theo chủ đề (Daily Life, Business, Travel, IELTS) + Gọi API tra từ động khi người dùng click vào từ mới.
- **Dữ liệu Ngữ pháp (Grammar):**
  - *Nguồn:* Giáo trình grammar chuẩn A1-C2 (Thì, Câu bị động, Câu điều kiện, Mệnh đề quan hệ, v.v.).
  - *Giải pháp:* Lưu cấu trúc dạng JSON/Markdown linh hoạt, tích hợp bài tập trắc nghiệm & điền từ tự động sinh bằng Gemini AI.
- **Dữ liệu Video Shadowing:**
  - *Nguồn:* Đọc video từ YouTube Embed Iframe + Đọc phụ đề qua YouTube Transcript API / Transcript Services.
- **Nhận diện giọng nói (STT) & Đọc văn bản (TTS):**
  - *Giải pháp tối ưu 0đ:* Sử dụng **Web Speech API** chuẩn hóa trong trình duyệt Chrome/Edge/Safari (`webkitSpeechRecognition` & `speechSynthesis`). 
  - *Ưu điểm:* Cực kỳ nhanh, hoàn toàn miễn phí, không tốn API key, hỗ trợ giọng US/UK chuẩn.

### 3.2. Giải đáp thắc mắc: "Dùng tài khoản Gemini Pro (Gemini Advanced) làm API Chatbot được không?"
- **Sự thật kỹ thuật:**
  - Gói tài khoản trả phí **Gemini Advanced (Gemini Pro)** của bạn trên `gemini.google.com` là sản phẩm giao diện Web dành cho người dùng cuối, **Google không cung cấp API key trực tiếp từ gói tiêu dùng này**.
- **PHƯƠNG ÁN THAY THẾ HOÀN HẢO (CHÍNH THỨC & MIỄN PHÍ):**
  - Google cung cấp nền tảng **Google AI Studio** (`aistudio.google.com`).
  - Bạn chỉ cần dùng chính Tài khoản Google của bạn đăng nhập vào **Google AI Studio** để tạo **API Key**.
  - **Mức miễn phí (Free Tier) cực khủng:**
    - Model `gemini-1.5-flash`: **15 requests/phút**, **1,000,000 tokens/phút**, **1,500 requests/ngày** -> **HOÀN TOÀN MIỄN PHÍ**, quá thừa để phát triển, thử nghiệm và chạy ứng dụng web này!
    - Model `gemini-1.5-pro`: Dành cho các tác vụ suy luận sâu (như AI Gia sư phân tích lỗi sai phức tạp).
  - **Kết luận:** Bạn hoàn toàn dùng được chính tài khoản Google của mình qua Google AI Studio với API Gemini 1.5 Flash/Pro chuẩn 100%, ổn định và không tốn thêm chi phí!

### 3.3. Phân tích Ưu điểm, Nhược điểm & Khó khăn Kỹ thuật

| Yếu tố | Chi tiết phân tích |
| :--- | :--- |
| **Ưu điểm** | - Hệ sinh thái học tiếng Anh khép kín, cá nhân hóa sâu.<br>- Dùng Gemini 1.5 Flash siêu nhanh, context window 1M tokens hỗ trợ đưa toàn bộ lịch sử học tập vào context.<br>- Web Speech API miễn phí giúp luyện giao tiếp 1:1 không mất chi phí voice server. |
| **Nhược điểm / Khó khăn** | 1. **YouTube Subtitle Issue:** Một số video YouTube không có phụ đề (CC).<br>2. **Context Management:** AI Gia sư cần nhớ người dùng là ai, trình độ gì mà không làm tràn token hoặc chậm phản hồi.<br>3. **Đánh giá phát âm (Pronunciation Scoring):** Web Speech API chỉ biết đúng từ hay sai từ, chưa chấm chi tiết âm tiết. |
| **Biện pháp khắc phục** | 1. **YouTube CC:** Chỉ cho phép/gợi ý video có sẵn phụ đề (English CC) hoặc gợi ý playlist bài học chọn lọc; có tính năng check URL xem video có CC không.<br>2. **Context Optimization:** Lưu User Profile, Score, Weak Points trong `localStorage`/Database; mỗi lần gọi AI Gia sư chỉ truyền một bản "System Prompt Summary" nhỏ gọn (ngắn gọn, chính xác).<br>3. **Scoring Shadowing:** Dùng thuật toán Levenshtein Distance (String Similarity) so sánh câu nói người dùng thu âm với Transcript gốc để tính tỷ lệ % chính xác (0-100%). |

---

## 4. CÔNG NGHỆ BỘ KHUNG (TECH STACK RECOMMENDED)

- **Frontend Framework:** React (Vite) + TypeScript (cho tốc độ phản hồi mượt mà, cấu trúc code rõ ràng, dễ bảo trì).
- **Styling:** Vanilla CSS Custom Properties + Modern Glassmorphism Design System (CSS Modules / TailwindCSS if needed).
- **Icons & UI Effects:** Lucide React icons, Framer Motion (cho micro-animations), Canvas Confetti (cho hiệu ứng thăng rank/hoàn thành bài).
- **AI Integration:** `@google/generative-ai` (Gemini SDK).
- **Media & Speech:** Web Speech API, YouTube Iframe Player API.
- **State Management & Storage:** Zustand / React Context + LocalStorage (IndexedDB nếu lưu audio cache).

---

## 5. LỘ TRÌNH PHÁT TRIỂN CHIA NHỎ (PHASED ROADMAP)

### PHASE 1: KHỞI TẠO DỰ ÁN & DESIGN SYSTEM + KHUNG ỨNG DỤNG CORE
- **Task 1.1:** Khởi tạo project React + TypeScript (Vite), cấu hình Clean Code Architecture.
- **Task 1.2:** Xây dựng Design System (Bảng màu Neon/Dark Mode, Typography, Components Core: Button, Card, Modal, Input, Badge, Progress Bar).
- **Task 1.3:** Xây dựng Layout ứng dụng: Sidebar Navigation, Header (Hiển thị Rank, XP, Streak, Avatar), Main Layout.
- **Task 1.4:** Thiết kế Data Models (TypeScript Interfaces): `User`, `Word`, `GrammarLesson`, `Rank`, `TestResult`, `ChatMessage`.

### PHASE 2: PHÂN HỆ TỪ VỰNG, NGỮ PHÁP & HỆ THỐNG RANK / LEVEL TEST
- **Task 2.1:** Bài Test Phân Trình Độ (Placement Test) A1-C2 (Trắc nghiệm + Điền từ + Nghe) để xếp rank khởi đầu.
- **Task 2.2:** Hệ thống Rank & Gamification (Đồng -> Bạc -> Vàng -> Kim Cương -> Cao Thủ, XP System, Daily Streak, Bảng thành tích).
- **Task 2.3:** Phân hệ Học Từ Vựng (Flashcard lật 3D, Phát âm audio, Bài tập nối từ, Ghi nhớ SRS).
- **Task 2.4:** Phân hệ Học Ngữ Pháp (Lý thuyết minh họa, Bài tập điền từ, Giải thích đáp án chi tiết).

### PHASE 3: CHATBOT AI GIAO TIẾP 1:1 (ADAM & EVA)
- **Task 3.1:** Cấu hình Gemini API Key Service (`gemini-1.5-flash`) tích hợp Google AI Studio Key.
- **Task 3.2:** Thiết kế Persona & System Prompts độc lập cho **Adam** (Bạn học thân thiện) và **Eva** (Cô giáo chuẩn mực).
- **Task 3.3:** Xây dựng UI Chat Room 1:1 (Avatar động, hiệu ứng bong bóng chat, phân biệt tin nhắn voice/text).
- **Task 3.4:** Tích hợp Voice Input (STT - Web Speech API) & Voice Output (TTS - Web Speech API) hỗ trợ luyện nói thực tế.
- **Task 3.5:** Tính năng "Instant Grammar Correction" (AI tự phát hiện lỗi sai trong câu nói của user và gợi ý cách nói tự nhiên hơn).

### PHASE 4: PHÂN HỆ YOUTUBE SHADOWING ENGLISH
- **Task 4.1:** Nhập URL YouTube -> Fetch Transcript & nhúng YouTube Iframe Player API.
- **Task 4.2:** Đồng bộ phụ đề theo mốc thời gian (Interactive Transcript: bấm vào câu nào video nhảy đến đó).
- **Task 4.3:** Chế độ Shadowing (Phát từng câu -> Tự động dừng -> Người dùng thu âm nhại lại -> Tiếp tục).
- **Task 4.4:** Thuật toán chấm điểm Shadowing (So sánh Voice Text vs Transcript Text theo % Levenshtein Distance + Highlight từ phát âm sai/đúng).

### PHASE 5: AI TUTOR GIA SƯ TỔNG QUẢN (CENTRAL LEARNING ANALYTICS)
- **Task 5.1:** Hệ thống ghi vết học tập (Tracking Engine): Lưu các từ vựng yếu, bài ngữ pháp hay sai, phản hồi từ Adam/Eva.
- **Task 5.2:** Xây dựng Widget AI Gia sư ở góc màn hình / Dashboard chính.
- **Task 5.3:** AI Gia sư đề xuất lộ trình hàng ngày (Daily Recommended Tasks) dựa trên điểm yếu thực tế.

### PHASE 6: KIỂM THỬ, TỐI ƯU & HOÀN THIỆN
- **Task 6.1:** Kiểm thử toàn bộ User Flow (Từ lúc làm Test phân rank đến học vocabulary, chat 1:1, shadowing).
- **Task 6.2:** Tối ưu Responsive, hiệu năng load page, xử lý lỗi kết nối API key.
- **Task 6.3:** Viết Walkthrough & Đóng gói sản phẩm.

---

## 6. NHẬT KÝ TIẾN ĐỘ VÀ THAY ĐỔI (CHANGELOG & STATUS)

| Ngày | Nội dung hoạt động / Cập nhật | Trạng thái |
| :--- | :--- | :--- |
| **2026-07-27** | Khởi tạo file `Plan.md`. Hoàn thành phân tích kiến trúc, tài nguyên, giải đáp thắc mắc Gemini API và lập lộ trình chi tiết. | **ĐÃ HOÀN THÀNH KẾ HOẠCH** |
| **2026-07-27** | **HOÀN THÀNH PHASE 1:** Khởi tạo project React + TypeScript + Vite, xây dựng Design System (Dark Glassmorphism, Ranks: Đồng -> Cao Thủ), Data Models (User, Word, Grammar, Chat, Shadowing), Header, Sidebar Navigation, Dashboard & Settings Modal với Gemini API Config. Build thành công 100%. | **HOÀN THÀNH PHASE 1** |
| **2026-07-27** | Khởi tạo & Push thành công repository `tphongzz/EnglishNTP` lên GitHub. Bổ sung **Rule 5** (Bắt buộc chạy test `npm run build` + `git commit` + `git push` tự động sau mỗi task để Vercel auto-deploy). | **SYNC GITHUB & RULE UPDATED** |
| **2026-07-27** | **HOÀN THÀNH PHASE 2:** Xây dựng Phân hệ Placement Test (A1-C2, xếp rank & nhận XP bonus), Phân hệ Từ Vựng (Flashcards lật 3D, Web Speech Audio, Bộ lọc CEFR/Topic, Mini-Game Nối từ), Phân hệ Ngữ Pháp (Lý thuyết minh họa, ví dụ song ngữ audio, bài tập trắc nghiệm giải thích chi tiết), Hệ thống Toast thông báo thăng Rank & cộng XP. Build clean 100% & đã push GitHub main. | **HOÀN THÀNH PHASE 2** |
| **2026-07-27** | **HOÀN THÀNH PHASE 3:** Xây dựng Phân hệ Chatbot AI Giao tiếp 1:1 với 2 Persona độc lập (Adam - Bạn học thân thiện & Eva - Cô giáo chuẩn mực), tích hợp Gemini 1.5/2.0 Flash SDK (`@google/generative-ai`) kết hợp Smart Mock Offline Fallback, tích hợp Web Speech STT (nhận diện giọng nói mic) & TTS (phát âm thanh trả lời), tính năng Instant Grammar Correction (phát hiện & giải thích lỗi sai ngữ pháp bằng Tiếng Việt), Topic Starter Pills gợi ý hội thoại & thưởng +15 XP sau mỗi 3 lượt trò chuyện. Build clean 100% & đã push GitHub main. | **HOÀN THÀNH PHASE 3** |
| **2026-07-27** | **HOÀN THÀNH PHASE 4:** Xây dựng Phân hệ YouTube Shadowing English: Tích hợp YouTube Iframe Player API với điều khiển tốc độ/phát lại, Phụ đề tương tác đồng bộ mốc thời gian (Interactive Transcript with click-to-seek), Thu âm giọng nói nhại giọng (Web Speech STT), Thuật toán chấm điểm độ chính xác % phát âm (Levenshtein Distance & Word-by-word match), Highlight từ đúng/sai chi tiết, Khả năng nhập URL YouTube tùy chỉnh & Gemini AI transcript generator. Build clean 100% & đã push GitHub main. | **HOÀN THÀNH PHASE 4** |
| **2026-07-27** | **HOÀN THÀNH PHASE 5:** Xây dựng Phân hệ Smart Central AI Tutor (Dr. NTP): Tích hợp Tracking Engine tự động theo dõi từ vựng yếu, bài tập ngữ pháp sai, điểm Shadowing & lỗi chat từ Adam/Eva; Báo cáo phân tích học tập cá nhân hóa; Đề xuất lộ trình hàng ngày (Daily Recommended Tasks) chuyển trang 1-click; Phòng Sửa Điểm Yếu (Weakness Remediation Lab) sinh bài tập tự động +40 XP; Chat 1:1 chuyên sâu với Dr. NTP có Voice STT/TTS; Floating AI Tutor Widget góc màn hình xuyên suốt các phân hệ. Build clean 100% & đã push GitHub main. | **HOÀN THÀNH PHASE 5** |
| **2026-07-27** | **HOÀN THÀNH PHASE 6:** Kiểm thử toàn bộ User Flow (Placement Test -> Vocabulary -> Grammar -> Chatbot 1:1 -> Shadowing -> Central AI Tutor), Tối ưu Responsive CSS cho Mobile/Tablet, hoàn thiện xử lý ngoại lệ & Smart Offline Fallback khi không có API Key, chạy `npm run build` đạt 100% clean build, đóng gói walkthrough và push thành công repository `hoquan2007/EnglishNTP` lên GitHub. | **HOÀN THÀNH PHASE 6 & DỰ ÁN 100%** |
| **2026-07-27** | **HOÀN THÀNH TÍCH HỢP 4 NHÓM API MỞ RỘNG:** Test & tích hợp thành công: 1) Free Dictionary API, FreeDictionaryAPI.com (Wiktionary), Datamuse API (Autocomplete & Related words), Merriam-Webster Key; 2) LanguageTool HTTP API (Check lỗi ngữ pháp/chính tả real-time) & Sapling AI / Flesch-Kincaid Readability stats; 3) Azure Speech SDK & SpeechSuper API + Client Levenshtein Pronunciation Assessment Engine; 4) Interactive Subtitles 1-click word lookup & YouTube IFrame Player integration. Build clean 100% & auto-sync GitHub. | **HOÀN THÀNH 4 NHÓM API EXTENDED** |
| **2026-07-27** | **NÂNG CẤP TOÀN BỘ NỘI DUNG & MINI-GAMES:** 1) Mở rộng kho từ vựng CEFR phong phú 100+ từ (A1-C2, 13 chủ đề) + Tra cứu Datamuse Autocomplete & Wiktionary; 2) Mở rộng 15+ bài học ngữ pháp chuyên sâu A1-C1 có audio ví dụ & quiz củng cố; 3) Tích hợp 3 Mini-Games tương tác (Nối từ Match, Xếp từ xáo trộn Unscramble, Speed Quiz 10s); 4) Bộ đề Placement Test 20 câu đánh giá 4 kỹ năng (Vocabulary, Grammar, Reading, Listening) có giải thích chi tiết. Build clean 100% & đã push GitHub main. | **HOÀN THÀNH NÂNG CẤP FULL CONTENT & MINI-GAMES** |
| **2026-07-27** | **PHÁ BỎ GIỚI HẠN TỪ VỰNG 5000+ & SINH TỪ VỰNG NGẪU NHIÊN VÔ HẠN THEO RANK:** 1) Xóa bỏ 100% giới hạn tìm kiếm từ vựng: Tra bất kỳ từ tiếng Anh nào (ví dụ: `hello`, `serendipity`...) hệ thống tự động bóc tách online thời gian thực và nạp trực tiếp thành Thẻ Lật 3D học tập; 2) Xây dựng Nút `🎲 Sinh Từ Ngẫu Nhiên Vô Hạn (Rank)` tự động lấy các từ phổ biến chuẩn cấp độ CEFR thích ứng theo Rank học viên (Bronze -> A1, Silver -> A2, Gold -> B1/B2...). Build clean 100% & auto-sync GitHub. | **HOÀN THÀNH PHÁ BỎ GIỚI HẠN TỪ VỰNG 100%** |

---
*Dự án Nền tảng Học Tiếng Anh AI English NTP đã phá bỏ hoàn toàn giới hạn 5000 từ vựng và tự động nạp/sinh từ vựng ngẫu nhiên vô hạn theo Rank học viên.*



