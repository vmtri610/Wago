import { Lesson } from '@/types/lesson';

export const N5_LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Bài 1: Danh từ, Trợ từ & Mẫu câu giao tiếp cơ bản',
    shortTitle: 'Bài 1',
    description: 'Nội dung Bài 1: Từ vựng, các phần Mở rộng giao tiếp thực tế và các mẫu Ngữ pháp theo giáo trình.',
    grammarCount: 6,
    vocabulary: [
      { jp: '私 (わたし)', romaji: 'watashi', vi: 'Tôi' },
      { jp: '韓国人 (かんこくじん)', romaji: 'kankokujin', vi: 'Người Hàn' },
      { jp: '教師 (きょうし)', romaji: 'kyoushi', vi: 'Giáo viên' },
      { jp: '会社員 (かいしゃいん)', romaji: 'kaishain', vi: 'Nhân viên công ty' },
      { jp: '学生 (がくせい)', romaji: 'gakusei', vi: 'Học sinh' },
      { jp: '歌手 (かしゅ)', romaji: 'kashu', vi: 'Ca sĩ' },
      { jp: 'ベトナム人 (ベトナムじん)', romaji: 'Betonamujin', vi: 'Người Việt Nam' },
      { jp: 'タイ人 (タイじん)', romaji: 'Taijin', vi: 'Người Thái' },
      { jp: 'あの人 (あのひと)', romaji: 'ano hito', vi: 'Người kia' },
      { jp: 'だれ ≒ どなた', romaji: 'dare / donata', vi: 'Ai' },
      { jp: '何歳 (なんさい) ≒ おいくつ', romaji: 'nansai / oikutsu', vi: 'Bao nhiêu tuổi' },
      { jp: '7歳 (ななさい)', romaji: 'nanasai', vi: '7 tuổi' },
      { jp: 'お仕事 (おしごと)', romaji: 'oshigoto', vi: 'Nghề nghiệp' },
      { jp: 'Bクラス', romaji: 'B-kurasu', vi: 'Lớp B' },
      { jp: 'はじめまして', romaji: 'hajimemashite', vi: 'Rất vui được gặp bạn' },
      { jp: 'よろしく おねがいします', romaji: 'yoroshiku onegaishimasu', vi: 'Rất mong được bạn giúp đỡ' }
    ],
    expansions: [
      {
        id: 'b1-exp-2',
        order: 'Mở rộng 2',
        title: 'Cách hỏi công việc',
        formula: 'お仕事は？',
        meaning: 'Nghề nghiệp của bạn là gì?',
        notes: [
          'Lưu ý: Câu trả lời: [私 は] ______ です。'
        ],
        dialogue: [
          {
            id: 'b1-exp-2-d1',
            speaker: 'A',
            jp: 'お仕事は？',
            romaji: 'O-shigoto wa?',
            vi: 'Nghề nghiệp của bạn là gì?'
          },
          {
            id: 'b1-exp-2-d2',
            speaker: 'B',
            jp: '歌手です。',
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
          '* Có thể lược bỏ 「私 は」 ở những câu sau.',
          '* Khi giới thiệu bản thân, người Nhật thường không giới thiệu tuổi.'
        ],
        dialogue: [
          {
            id: 'b1-exp-3-1',
            jp: 'はじめまして！*',
            romaji: 'Hajimemashite!',
            vi: 'Rất vui được gặp bạn!'
          },
          {
            id: 'b1-exp-3-2',
            jp: '私 は リキモです。',
            romaji: 'Watashi wa Rikimo desu.',
            vi: '(Giới thiệu tên)'
          },
          {
            id: 'b1-exp-3-3',
            jp: '[私 は] ベトナム人です。',
            romaji: '[Watashi wa] Betonamujin desu.',
            vi: '(Giới thiệu quốc tịch)'
          },
          {
            id: 'b1-exp-3-4',
            jp: '[私 は] 教師です。',
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
            jp: '① コナンくんは Bクラスの 学生です。',
            romaji: 'Konan-kun wa B-kurasu no gakusei desu.',
            vi: 'Bạn Conan là học sinh của lớp B.'
          },
          {
            id: 'b1-g2-ex2',
            jp: '② あの 人は ベトナムの 歌手です。',
            romaji: 'Ano hito wa Betonamu no kashu desu.',
            vi: 'Người kia là ca sĩ của Việt Nam.'
          },
          {
            id: 'b1-g2-ex3',
            jp: '③ 「TBC アナウンサー」の 佐藤 あかりです。',
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
            jp: '① 私は 韓国人では ありません。',
            romaji: 'Watashi wa Kankokujin dewa arimasen.',
            vi: 'Tôi không phải là người Hàn.'
          },
          {
            id: 'b1-g3-ex2',
            jp: '② 私は 教師じゃ ありません。会社員です。',
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
            jp: '① A: リサさんは 韓国人ですか。',
            romaji: 'Risa-san wa Kankokujin desu ka.',
            vi: 'Lisa là người Hàn Quốc phải không?'
          },
          {
            id: 'b1-g4-1-ex2',
            speaker: 'B',
            jp: 'B: いいえ、ちがいます。タイ人です。',
            romaji: 'Iie, chigaimasu. Taijin desu.',
            vi: 'Không, không phải. Tôi là người Thái.'
          },
          {
            id: 'b1-g4-1-ex3',
            speaker: 'A',
            jp: '② A: ヒエンさんは ベトナム人ですか。',
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
            jp: '① A: あの 人は だれですか。',
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
            jp: '② A: コナンくんは 何歳ですか。',
            romaji: 'Konan-kun wa nansai desu ka.',
            vi: 'Conan bao nhiêu tuổi?'
          },
          {
            id: 'b1-g4-2-ex4',
            speaker: 'B',
            jp: 'B: 7歳です。',
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
            jp: '新一くんは 学生です。ランさんも 学生です。',
            romaji: 'Shinichi-kun wa gakusei desu. Ran-san mo gakusei desu.',
            vi: 'Bạn Shinichi là học sinh. Bạn Ran cũng là học sinh.'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '1. SỐ ĐẾM (Bảng số đếm, số thập phân & phân số)',
    shortTitle: 'Số đếm',
    description: 'Bảng tra cứu và học toàn bộ số đếm từ 0 đến 100,000,000, các biến âm đặc biệt, số thập phân và phân số theo giáo trình.',
    grammarCount: 3,
    vocabulary: [
      { jp: 'ゼロ / れい', romaji: 'zero / rei', vi: 'Số 0' },
      { jp: 'いち', romaji: 'ichi', vi: 'Số 1' },
      { jp: 'に', romaji: 'ni', vi: 'Số 2' },
      { jp: 'さん', romaji: 'san', vi: 'Số 3' },
      { jp: 'よん / し', romaji: 'yon / shi', vi: 'Số 4' },
      { jp: 'ご', romaji: 'go', vi: 'Số 5' },
      { jp: 'ろく', romaji: 'roku', vi: 'Số 6' },
      { jp: 'なな / しち', romaji: 'nana / shichi', vi: 'Số 7' },
      { jp: 'はち', romaji: 'hachi', vi: 'Số 8' },
      { jp: 'きゅう / く', romaji: 'kyuu / ku', vi: 'Số 9' },
      { jp: 'じゅう', romaji: 'juu', vi: 'Số 10' },
      { jp: 'じゅういち', romaji: 'juuichi', vi: 'Số 11' },
      { jp: 'じゅうに', romaji: 'juuni', vi: 'Số 12' },
      { jp: 'じゅうさん', romaji: 'juusan', vi: 'Số 13' },
      { jp: 'じゅうよん / じゅうし', romaji: 'juuyon / juushi', vi: 'Số 14' },
      { jp: 'じゅうご', romaji: 'juugo', vi: 'Số 15' },
      { jp: 'じゅうろく', romaji: 'juuroku', vi: 'Số 16' },
      { jp: 'じゅうなな / じゅうしち', romaji: 'juunana / juushichi', vi: 'Số 17' },
      { jp: 'じゅうはち', romaji: 'juuhachi', vi: 'Số 18' },
      { jp: 'じゅうきゅう / じゅうく', romaji: 'juukyuu / juuku', vi: 'Số 19' },
      { jp: 'にじゅう', romaji: 'nijuu', vi: 'Số 20' },
      { jp: 'さんじゅう', romaji: 'sanjuu', vi: 'Số 30' },
      { jp: 'よんじゅう', romaji: 'yonjuu', vi: 'Số 40' },
      { jp: 'ごじゅう', romaji: 'gojuu', vi: 'Số 50' },
      { jp: 'ろくじゅう', romaji: 'rokujuu', vi: 'Số 60' },
      { jp: 'ななじゅう / しちじゅう', romaji: 'nanajuu / shichijuu', vi: 'Số 70' },
      { jp: 'はちじゅう', romaji: 'hachijuu', vi: 'Số 80' },
      { jp: 'きゅうじゅう', romaji: 'kyuujuu', vi: 'Số 90' },
      { jp: 'ひゃく', romaji: 'hyaku', vi: 'Số 100' },
      { jp: 'にひゃく', romaji: 'nihyaku', vi: 'Số 200' },
      { jp: 'さんびゃく', romaji: 'sanbyaku', vi: 'Số 300' },
      { jp: 'よんひゃく', romaji: 'yonhyaku', vi: 'Số 400' },
      { jp: 'ごひゃく', romaji: 'gohyaku', vi: 'Số 500' },
      { jp: 'ろっぴゃく', romaji: 'roppyaku', vi: 'Số 600' },
      { jp: 'ななひゃく', romaji: 'nanahyaku', vi: 'Số 700' },
      { jp: 'はっぴゃく', romaji: 'happyaku', vi: 'Số 800' },
      { jp: 'きゅうひゃく', romaji: 'kyuuhyaku', vi: 'Số 900' },
      { jp: 'せん', romaji: 'sen', vi: 'Số 1,000' },
      { jp: 'にせん', romaji: 'nisen', vi: 'Số 2,000' },
      { jp: 'さんぜん', romaji: 'sanzen', vi: 'Số 3,000' },
      { jp: 'よんせん', romaji: 'yonsen', vi: 'Số 4,000' },
      { jp: 'ごせん', romaji: 'gosen', vi: 'Số 5,000' },
      { jp: 'ろくせん', romaji: 'rokusen', vi: 'Số 6,000' },
      { jp: 'ななせん', romaji: 'nanasen', vi: 'Số 7,000' },
      { jp: 'はっせん', romaji: 'hassen', vi: 'Số 8,000' },
      { jp: 'きゅうせん', romaji: 'kyuusen', vi: 'Số 9,000' },
      { jp: 'いちまん', romaji: 'ichiman', vi: '10,000 (1 vạn)' },
      { jp: 'じゅうまん', romaji: 'juuman', vi: '100,000 (10 vạn)' },
      { jp: 'ひゃくまん', romaji: 'hyakuman', vi: '1,000,000 (1 triệu)' },
      { jp: 'せんまん', romaji: 'senman', vi: '10,000,000 (10 triệu)' },
      { jp: 'いちおく', romaji: 'ichioku', vi: '100,000,000 (1 ức)' },
      { jp: 'じゅうななてんご', romaji: 'juunana ten go', vi: '17.5' },
      { jp: 'れいてんはちじゅうさん', romaji: 'rei ten hachijuusan', vi: '0.83' },
      { jp: 'にぶんの いち', romaji: 'nibun no ichi', vi: '1/2' },
      { jp: 'よんぶんの さん', romaji: 'yonbun no san', vi: '3/4' }
    ],
    expansions: [
      {
        id: 'so-dem-exp-1',
        order: 'Mở rộng 1',
        title: 'Quy tắc đọc Số thập phân (Dấu phẩy: てん)',
        formula: '[Số trước dấu phẩy] + てん + [Số sau dấu phẩy]',
        meaning: 'Dùng từ 「てん」 để biểu thị dấu chấm/phẩy thập phân.',
        notes: [
          '17.5 → じゅうなな (17) + てん (.) + ご (5) = じゅうななてんご',
          '0.83 → れい (0) + てん (.) + はちじゅうさん (83) = れいてんはちじゅうさん'
        ],
        dialogue: [
          {
            id: 'so-dem-exp-1-d1',
            jp: '17.5',
            romaji: 'juunana ten go',
            vi: 'じゅうななてんご (Mười bảy phẩy năm)'
          },
          {
            id: 'so-dem-exp-1-d2',
            jp: '0.83',
            romaji: 'rei ten hachijuusan',
            vi: 'れいてんはちじゅうさん (Không phẩy tám mươi ba)'
          }
        ]
      },
      {
        id: 'so-dem-exp-2',
        order: 'Mở rộng 2',
        title: 'Quy tắc đọc Phân số ([Mẫu số] ぶんの [Tử số])',
        formula: '[Mẫu số] + ぶんの + [Tử số]',
        meaning: 'Đọc mẫu số trước, sau đó đến 「ぶんの」, rồi đến tử số.',
        notes: [
          '1/2 → に (2) + ぶんの + いち (1) = にぶんの いち',
          '3/4 → よん (4) + ぶんの + さん (3) = よんぶんの さん'
        ],
        dialogue: [
          {
            id: 'so-dem-exp-2-d1',
            jp: '1/2',
            romaji: 'nibun no ichi',
            vi: 'にぶんの いち (Một phần hai)'
          },
          {
            id: 'so-dem-exp-2-d2',
            jp: '3/4',
            romaji: 'yonbun no san',
            vi: 'よんぶんの さん (Ba phần tư)'
          }
        ]
      }
    ],
    grammarPoints: [
      {
        id: 'so-dem-gp-1',
        order: '1',
        title: 'Quy tắc biến âm Hàng Trăm (百 - ひゃく)',
        meaning: '300 (びゃく), 600 (ろっぴゃく), 800 (はっぴゃく)',
        usage: 'Hàng trăm thông thường đọc là 「ひゃく」, nhưng các số 300, 600, 800 có biến âm đặc biệt cần nhớ kỹ.',
        formula: 'Số + ひゃく / びゃく / ぴゃく',
        notes: [
          '300: さんびゃく (sanbyaku) - biến âm sang 「びゃく」',
          '600: ろっぴゃく (roppyaku) - biến âm xúc âm 「ろっぴゃく」',
          '800: はっぴゃく (happyaku) - biến âm xúc âm 「はっぴゃく」',
          'Các số còn lại đều giữ nguyên đuôi 「ひゃく」: 100 (ひゃく), 200 (にひゃく), 400 (よんひゃく), 500 (ごひゃく), 700 (ななひゃく), 900 (きゅうひゃく)'
        ],
        examples: [
          {
            id: 'so-dem-gp-1-ex1',
            jp: '300: さんびゃく',
            romaji: 'sanbyaku',
            vi: 'Ba trăm'
          },
          {
            id: 'so-dem-gp-1-ex2',
            jp: '600: ろっぴゃく',
            romaji: 'roppyaku',
            vi: 'Sáu trăm'
          },
          {
            id: 'so-dem-gp-1-ex3',
            jp: '800: はっぴゃく',
            romaji: 'happyaku',
            vi: 'Tám trăm'
          }
        ]
      },
      {
        id: 'so-dem-gp-2',
        order: '2',
        title: 'Quy tắc biến âm Hàng Nghìn (千 - せん)',
        meaning: '3,000 (さんぜん), 8,000 (はっせん)',
        usage: 'Hàng nghìn thông thường đọc là 「せん」, nhưng số 3,000 và 8,000 có biến âm.',
        formula: 'Số + せん / ぜん / っせん',
        notes: [
          '3,000: さんぜん (sanzen) - biến âm đục sang 「ぜん」',
          '8,000: はっせん (hassen) - biến âm xúc âm 「はっせん」',
          'Các số còn lại giữ nguyên: 1,000 (せん), 2,000 (にせん), 4,000 (よんせん), 5,000 (ごせん), 6,000 (ろくせん), 7,000 (ななせん), 9,000 (きゅうせん)'
        ],
        examples: [
          {
            id: 'so-dem-gp-2-ex1',
            jp: '3,000: さんぜん',
            romaji: 'sanzen',
            vi: 'Ba nghìn'
          },
          {
            id: 'so-dem-gp-2-ex2',
            jp: '8,000: はっせん',
            romaji: 'hassen',
            vi: 'Tám nghìn'
          }
        ]
      },
      {
        id: 'so-dem-gp-3',
        order: '3',
        title: 'Quy tắc các số có 2 cách đọc (4, 7, 9)',
        meaning: '4 (よん / し), 7 (なな / しち), 9 (きゅう / く)',
        usage: 'Tuỳ theo từng ngữ cảnh hoặc hàng chục/đơn vị mà số 4, 7, 9 có cách đọc tương ứng.',
        formula: '4 = よん / し, 7 = なな / しち, 9 = きゅう / く',
        notes: [
          'Số 4: 4 (よん、し), 14 (じゅうよん、じゅうし), 40 (よんじゅう)',
          'Số 7: 7 (なな、しち), 17 (じゅうなな、じゅうしち), 70 (ななじゅう、しちじゅう)',
          'Số 9: 9 (きゅう、く), 19 (じゅうきゅう、じゅうく), 90 (きゅうじゅう)'
        ],
        examples: [
          {
            id: 'so-dem-gp-3-ex1',
            jp: '4: よん / し | 14: じゅうよん / じゅうし | 40: よんじゅう',
            romaji: 'yon / shi | juuyon / juushi | yonjuu',
            vi: 'Số 4, 14, 40'
          },
          {
            id: 'so-dem-gp-3-ex2',
            jp: '7: なな / しち | 17: じゅうなな / じゅうしち | 70: ななじゅう / しちじゅう',
            romaji: 'nana / shichi | juunana / juushichi | nanajuu / shichijuu',
            vi: 'Số 7, 17, 70'
          },
          {
            id: 'so-dem-gp-3-ex3',
            jp: '9: きゅう / く | 19: じゅうきゅう / じゅうく | 90: きゅうじゅう',
            romaji: 'kyuu / ku | juukyuu / juuku | kyuujuu',
            vi: 'Số 9, 19, 90'
          }
        ]
      }
    ]
  }
];
