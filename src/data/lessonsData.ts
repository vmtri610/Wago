import { Lesson } from '@/types/lesson';

export const N5_LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Bài 1: Danh từ, Trợ từ & Mẫu câu giao tiếp cơ bản',
    shortTitle: 'Bài 1',
    description: 'Nội dung Bài 1: Từ vựng, các phần Mở rộng giao tiếp thực tế và các mẫu Ngữ pháp theo giáo trình.',
    grammarCount: 6,
    vocabulary: [
      // 1. Đại từ & Danh xưng
      { jp: 'わたし', romaji: 'watashi', vi: 'Tôi (ngôi thứ nhất)' },
      { jp: 'あなた', romaji: 'anata', vi: 'Bạn, anh, chị (ngôi thứ hai)' },
      { jp: 'あのひと', romaji: 'ano hito', vi: 'Người đó, anh kia, chị kia' },
      { jp: 'あのかた', romaji: 'ano kata', vi: 'Vị kia (cách nói lịch sự của あのひと)' },
      { jp: 'かれ', romaji: 'kare', vi: 'Anh ấy' },
      { jp: 'かのじょ', romaji: 'kanojo', vi: 'Cô ấy' },
      { jp: 'なまえ', romaji: 'namae', vi: 'Tên' },
      { jp: '～さん', romaji: '~san', vi: 'Hậu tố thêm sau tên người (lịch sự)' },
      { jp: '～ちゃん', romaji: '~chan', vi: 'Hậu tố thêm sau tên trẻ em (thân mật)' },
      { jp: 'だれ', romaji: 'dare', vi: 'Ai đó?' },
      { jp: 'どなた', romaji: 'donata', vi: 'Vị nào? (cách nói lịch sự của だれ)' },

      // 2. Nghề nghiệp, Nơi chốn
      { jp: 'しごと', romaji: 'shigoto', vi: 'Công việc' },
      { jp: 'きょうし', romaji: 'kyoushi', vi: 'Giáo viên (nghề nghiệp)' },
      { jp: 'せんせい', romaji: 'sensei', vi: 'Giáo viên, bác sĩ (xưng hô thể hiện sự tôn trọng)' },
      { jp: 'かいしゃいん', romaji: 'kaishain', vi: 'Nhân viên công ty' },
      { jp: 'ぎんこういん', romaji: 'ginkouin', vi: 'Nhân viên ngân hàng' },
      { jp: 'がくせい', romaji: 'gakusei', vi: 'Học sinh, sinh viên' },
      { jp: 'しゅっしん', romaji: 'shusshin', vi: 'Xuất thân, quê quán' },
      { jp: 'いしゃ', romaji: 'isha', vi: 'Bác sĩ' },
      { jp: 'エンジニア', romaji: 'enjinia', vi: 'Kỹ sư' },
      { jp: 'ナース', romaji: 'naasu', vi: 'Y tá' },
      { jp: 'かしゅ', romaji: 'kashu', vi: 'Ca sĩ' },
      { jp: 'はいゆう', romaji: 'haiyuu', vi: 'Diễn viên' },
      { jp: 'エディター', romaji: 'editaa', vi: 'Biên tập viên, người chỉnh sửa' },
      { jp: 'かいしゃ', romaji: 'kaisha', vi: 'Công ty' },
      { jp: 'だいがく', romaji: 'daigaku', vi: 'Đại học' },
      { jp: 'ぎんこう', romaji: 'ginkou', vi: 'Ngân hàng' },

      // 3. Quốc gia, Người nước, Ngôn ngữ (Toàn bộ Hiragana/Katakana)
      { jp: 'ベトナム', romaji: 'betonamu', vi: 'Việt Nam' },
      { jp: 'ベトナムじん', romaji: 'betonamujin', vi: 'Người Việt' },
      { jp: 'ベトナムご', romaji: 'betonamugo', vi: 'Tiếng Việt' },
      { jp: 'イギリス', romaji: 'igirisu', vi: 'Anh' },
      { jp: 'イギリスじん', romaji: 'igirisujin', vi: 'Người Anh' },
      { jp: 'えいご', romaji: 'eigo', vi: 'Tiếng Anh' },
      { jp: 'ちゅうごく', romaji: 'chuugoku', vi: 'Trung Quốc' },
      { jp: 'ちゅうごくじん', romaji: 'chuugokujin', vi: 'Người Trung' },
      { jp: 'ちゅうごくご', romaji: 'chuugokugo', vi: 'Tiếng Trung' },
      { jp: 'アメリカ', romaji: 'amerika', vi: 'Mỹ' },
      { jp: 'アメリカじん', romaji: 'amerikajin', vi: 'Người Mỹ' },
      { jp: 'かんこく', romaji: 'kankoku', vi: 'Hàn Quốc' },
      { jp: 'かんこくじん', romaji: 'kankokujin', vi: 'Người Hàn' },
      { jp: 'かんこくご', romaji: 'kankokugo', vi: 'Tiếng Hàn' },
      { jp: 'にほん', romaji: 'nihon', vi: 'Nhật Bản' },
      { jp: 'にほんじん', romaji: 'nihonjin', vi: 'Người Nhật' },
      { jp: 'にほんご', romaji: 'nihongo', vi: 'Tiếng Nhật' },
      { jp: 'ドイツ', romaji: 'doitsu', vi: 'Đức' },
      { jp: 'ドイツじん', romaji: 'doitsujin', vi: 'Người Đức' },
      { jp: 'ドイツご', romaji: 'doitsugo', vi: 'Tiếng Đức' }
    ],
    expansions: [
      {
        id: 'b1-exp-2',
        order: 'Mở rộng 2',
        title: 'Cách hỏi công việc',
        formula: 'おしごとは？',
        meaning: 'Nghề nghiệp của bạn là gì?',
        notes: [
          'Lưu ý: Câu trả lời: [わたし は] ______ です。'
        ],
        dialogue: [
          {
            id: 'b1-exp-2-d1',
            speaker: 'A',
            jp: 'おしごとは？',
            romaji: 'O-shigoto wa?',
            vi: 'Nghề nghiệp của bạn là gì?'
          },
          {
            id: 'b1-exp-2-d2',
            speaker: 'B',
            jp: 'かしゅです。',
            romaji: 'Kashu desu.',
            vi: 'Tôi là ca sĩ.'
          }
        ]
      },
      {
        id: 'b1-exp-3',
        order: 'Mở rộng 3',
        title: 'Cách giới thiệu bản thân',
        meaning: 'Trình tự giới thiệu bản thân khi lần đầu gặp gỡ.',
        notes: [
          '* 「はじめまして！」 sử dụng trong lần đầu gặp mặt.',
          '* Có thể lược bỏ 「わたし は」 ở những câu sau.',
          '* Khi giới thiệu bản thân, người Nhật thường không giới thiệu tuổi.'
        ],
        dialogue: [
          {
            id: 'b1-exp-3-1',
            jp: 'はじめまして！',
            romaji: 'Hajimemashite!',
            vi: 'Rất vui được gặp bạn!'
          },
          {
            id: 'b1-exp-3-2',
            jp: 'わたし は リキモです。',
            romaji: 'Watashi wa Rikimo desu.',
            vi: '(Giới thiệu tên)'
          },
          {
            id: 'b1-exp-3-3',
            jp: '[わたし は] ベトナムじんです。',
            romaji: '[Watashi wa] Betonamujin desu.',
            vi: '(Giới thiệu quốc tịch)'
          },
          {
            id: 'b1-exp-3-4',
            jp: '[わたし は] きょうしです。',
            romaji: '[Watashi wa] kyoushi desu.',
            vi: '(Giới thiệu nghề nghiệp)'
          },
          {
            id: 'b1-exp-3-5',
            jp: 'よろしく おねがいします。',
            romaji: 'Yoroshiku onegaishimasu.',
            vi: 'Rất mong được bạn giúp đỡ!'
          }
        ]
      }
    ],
    grammarPoints: [
      {
        id: 'b1-g2',
        order: '2',
        title: 'N1 の N2',
        meaning: 'N2 của/thuộc N1',
        usage: 'Dùng khi nói về nơi làm việc của bản thân.',
        formula: 'N1 の N2',
        notes: [
          'Trợ từ 「の」 mang nghĩa là "của" hoặc là "thuộc"',
          'Dùng để biểu thị danh từ đứng sau (N2) là 1 thành phần thuộc danh từ đứng trước (N1).'
        ],
        examples: [
          {
            id: 'b1-g2-ex1',
            jp: '① コナンくんは Bクラスの がくせいです。',
            romaji: 'Konan-kun wa B-kurasu no gakusei desu.',
            vi: 'Bạn Conan là học sinh của lớp B.'
          },
          {
            id: 'b1-g2-ex2',
            jp: '② あの ひとは ベトナムの かしゅです。',
            romaji: 'Ano hito wa Betonamu no kashu desu.',
            vi: 'Người kia là ca sĩ của Việt Nam.'
          },
          {
            id: 'b1-g2-ex3',
            jp: '③ 「TBC アナウンサー」の さとう あかりです。',
            romaji: '"TBC Anaunsaa" no Satou Akari desu.',
            vi: 'Tôi là Satou Akari của "TBC Announcer".'
          }
        ]
      },
      {
        id: 'b1-g3',
        order: '3',
        title: 'N1 は N2じゃ ありません。',
        meaning: 'N1 không phải là N2',
        usage: 'Dùng khi phủ nhận thông tin không chính xác.',
        formula: 'N1 は N2 じゃ ありません。 / では ありません。',
        notes: [
          '「じゃ ありません」 là đuôi câu phủ định.',
          '「では ありません」 lịch sự hơn 「じゃ ありません」。'
        ],
        examples: [
          {
            id: 'b1-g3-ex1',
            jp: '① わたしは かんこくじんでは ありません。',
            romaji: 'Watashi wa Kankokujin dewa arimasen.',
            vi: 'Tôi không phải là người Hàn.'
          },
          {
            id: 'b1-g3-ex2',
            jp: '② わたしは きょうしじゃ ありません。かいしゃいんです。',
            romaji: 'Watashi wa kyoushi ja arimasen. Kaishain desu.',
            vi: 'Tôi không phải là giáo viên. Tôi là nhân viên công ty.'
          }
        ]
      },
      {
        id: 'b1-g4',
        order: '4',
        title: 'N1 は 〜ですか？',
        meaning: 'Đặt câu hỏi cho đối phương',
        usage: 'Dùng khi muốn đặt câu hỏi cho đối phương.',
        formula: 'N1 は 〜ですか？',
        notes: [
          '「か」 là đuôi câu hỏi.',
          'Cần lên giọng ở chữ 「か」.'
        ],
        examples: []
      },
      {
        id: 'b1-g4-1',
        order: '4.1',
        title: 'N1 は N2 ですか。',
        meaning: 'N1 là N2 phải không?',
        usage: 'Dùng khi muốn xác nhận thông tin.',
        formula: 'N1 は N2 ですか。',
        responses: {
          affirmative: ['はい、そうです。', 'はい、N2です。'],
          negative: ['いいえ、ちがいます。', 'いいえ、N2じゃ ありません。', 'いいえ、N3です。']
        },
        notes: [
          'Câu trả lời:',
          '• Khẳng định: はい、そうです。 / はい、N2です。',
          '• Phủ định: いいえ、ちがいます。 / いいえ、N2じゃ ありません。 / いいえ、N3です。'
        ],
        examples: [
          {
            id: 'b1-g4-1-ex1',
            speaker: 'A',
            jp: '① A: リサさんは かんこくじんですか。',
            romaji: 'Risa-san wa Kankokujin desu ka.',
            vi: 'Lisa là người Hàn Quốc phải không?'
          },
          {
            id: 'b1-g4-1-ex2',
            speaker: 'B',
            jp: 'B: いいえ、ちがいます。タイじんです。',
            romaji: 'Iie, chigaimasu. Taijin desu.',
            vi: 'Không, không phải. Tôi là người Thái.'
          },
          {
            id: 'b1-g4-1-ex3',
            speaker: 'A',
            jp: '② A: ヒエンさんは ベトナムじんですか。',
            romaji: 'Hien-san wa Betonamujin desu ka.',
            vi: 'Bạn Hiền là người Việt Nam à?'
          },
          {
            id: 'b1-g4-1-ex4',
            speaker: 'B',
            jp: 'B: はい、そうです。',
            romaji: 'Hai, sou desu.',
            vi: 'Vâng, đúng vậy.'
          }
        ]
      },
      {
        id: 'b1-g4-2',
        order: '4.2',
        title: 'N1 は [Từ để hỏi] ですか？',
        meaning: 'N1 là (ai/bao nhiêu tuổi) ?',
        usage: 'Dùng khi muốn hỏi thông tin của người khác.',
        formula: 'N1 は [Từ để hỏi] ですか。',
        notes: [
          'Từ để hỏi: だれ ≒ どなた (ai?) | なんさい ≒ おいくつ (bao nhiêu tuổi?)',
          'Câu trả lời: [N1 は] N2 です。',
          'Không nên hỏi tuổi đối phương trong lần đầu gặp gỡ.'
        ],
        examples: [
          {
            id: 'b1-g4-2-ex1',
            speaker: 'A',
            jp: '① A: あの ひとは だれですか。',
            romaji: 'Ano hito wa dare desu ka.',
            vi: 'Người kia là ai vậy?'
          },
          {
            id: 'b1-g4-2-ex2',
            speaker: 'B',
            jp: 'B: リキミさんです。',
            romaji: 'Rikimi-san desu.',
            vi: '(Người kia) là bạn Rikimi.'
          },
          {
            id: 'b1-g4-2-ex3',
            speaker: 'A',
            jp: '② A: コナンくんは なんさいですか。',
            romaji: 'Konan-kun wa nansai desu ka.',
            vi: 'Conan bao nhiêu tuổi?'
          },
          {
            id: 'b1-g4-2-ex4',
            speaker: 'B',
            jp: 'B: 7さいです。',
            romaji: 'Nanasai desu.',
            vi: '(Em) 7 tuổi ạ.'
          }
        ]
      },
      {
        id: 'b1-g5',
        order: '5',
        title: 'N1 も 〜です。',
        meaning: 'N1 cũng là ...',
        usage: 'Dùng khi muốn nói thông tin tương đồng.',
        formula: 'N1 も 〜です。',
        notes: [
          '〜 là một thông tin đã xuất hiện trước đó.'
        ],
        examples: [
          {
            id: 'b1-g5-ex1',
            jp: 'しんいちくんは がくせいです。ランさんも がくせいです。',
            romaji: 'Shinichi-kun wa gakusei desu. Ran-san mo gakusei desu.',
            vi: 'Bạn Shinichi là học sinh. Bạn Ran cũng là học sinh.'
          }
        ]
      }
    ]
  }
];
