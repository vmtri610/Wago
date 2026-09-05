import { Lesson } from '@/types/lesson';

export const N5_LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Bài 1: Danh từ, Trợ từ & Mẫu câu giao tiếp cơ bản',
    shortTitle: 'Bài 1',
    description: 'Nội dung Bài 1: Từ vựng, các phần Mở rộng giao tiếp thực tế và các mẫu Ngữ pháp theo giáo trình.',
    grammarCount: 7,
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
        id: 'b1-exp-1',
        order: 'Mở rộng 1',
        title: 'Cách hỏi tên',
        formula: 'お名前は？',
        meaning: 'Tên của bạn là gì?',
        notes: [
          'Lưu ý: Câu trả lời: [ わたし は ] ______ です。',
          'Tiền tố 「お」: thêm vào trước danh từ để thể hiện sự lịch sự.'
        ],
        dialogue: [
          {
            id: 'b1-exp-1-d1',
            speaker: 'A',
            jp: 'お名前は？',
            romaji: 'O-namae wa?',
            vi: 'Tên của bạn là gì?'
          },
          {
            id: 'b1-exp-1-d2',
            speaker: 'B',
            jp: 'ハンです。',
            romaji: 'Han desu.',
            vi: 'Tên tôi là Hằng.'
          }
        ]
      },
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
        id: 'b1-g1',
        order: '1',
        title: 'N1 は N2 です。',
        meaning: 'N1 là N2',
        usage: 'Dùng khi giới thiệu thông tin cá nhân (tên, tuổi, nghề nghiệp,...).',
        formula: 'N1 は N2 です。',
        notes: [
          'N1 là chủ ngữ, chủ đề của câu.',
          'N2 là vị ngữ (tên, quốc tịch, nghề nghiệp,...).',
          '「です」 là đuôi câu khẳng định (đứng chung hay riêng vẫn dịch là "là").',
          '「は」 là trợ từ, đọc là 「わ」.',
          '「。」 là dấu chấm câu.'
        ],
        examples: [
          {
            id: 'b1-g1-ex1',
            jp: '① わたしは かいしゃいんです。',
            romaji: 'Watashi wa kaishain desu.',
            vi: 'Tôi là nhân viên công ty.'
          },
          {
            id: 'b1-g1-ex2',
            jp: '② さとうさんは いしゃです。',
            romaji: 'Satou-san wa isha desu.',
            vi: 'Anh Satou là bác sĩ.'
          }
        ]
      },
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
  },
  {
    id: 2,
    title: 'Bài 2: Chỉ thị từ, Danh từ chỉ đồ vật & Quyền sở hữu',
    shortTitle: 'Bài 2',
    description: 'Nội dung Bài 2: Từ vựng đồ vật, chỉ thị từ これ/それ/あれ, mẫu câu hỏi cái gì và cấu trúc sở hữu の.',
    grammarCount: 4,
    vocabulary: [
      // A. Chỉ thị từ chỉ đồ vật
      { jp: 'これ', romaji: 'kore', vi: 'Cái này (chỉ vật ở gần người nói)' },
      { jp: 'それ', romaji: 'sore', vi: 'Cái đó (chỉ vật ở gần người nghe)' },
      { jp: 'あれ', romaji: 'are', vi: 'Cái kia (chỉ vật ở xa cả hai người)' },
      { jp: 'この～', romaji: 'kono ~', vi: '~ này' },
      { jp: 'その～', romaji: 'sono ~', vi: '~ đó' },
      { jp: 'あの～', romaji: 'ano ~', vi: '~ kia' },

      // B. Danh từ chỉ đồ vật
      { jp: 'かさ', romaji: 'kasa', vi: 'Ô, dù (傘)' },
      { jp: 'かばん', romaji: 'kaban', vi: 'Túi xách, cặp' },
      { jp: 'ノート', romaji: 'nooto', vi: 'Vở' },
      { jp: 'ほん', romaji: 'hon', vi: 'Sách (本)' },
      { jp: 'てちょう', romaji: 'techou', vi: 'Sổ tay (手帳)' },
      { jp: 'えんぴつ', romaji: 'enpitsu', vi: 'Bút chì' },
      { jp: 'ボールペン', romaji: 'boorupen', vi: 'Bút bi' },
      { jp: 'シャープペン', romaji: 'shaapupen', vi: 'Bút chì kim (シャープペンシル)' },
      { jp: 'カード', romaji: 'kaado', vi: 'Thẻ' },
      { jp: 'めいし', romaji: 'meishi', vi: 'Danh thiếp (名刺)' },
      { jp: 'けいたいでんわ', romaji: 'keitaidenwa', vi: 'Điện thoại di động (携帯電話)' },
      { jp: 'じしょ', romaji: 'jisho', vi: 'Từ điển (辞書)' },
      { jp: 'ざっし', romaji: 'zasshi', vi: 'Tạp chí (雑誌)' },
      { jp: 'しんぶん', romaji: 'shinbun', vi: 'Tờ báo, báo (新聞)' },
      { jp: 'つくえ', romaji: 'tsukue', vi: 'Bàn (机)' },
      { jp: 'いす', romaji: 'isu', vi: 'Ghế' },
      { jp: 'テレビ', romaji: 'terebi', vi: 'Ti vi' },
      { jp: 'コンピューター', romaji: 'konpyuutaa', vi: 'Máy tính' },
      { jp: 'パソコン', romaji: 'pasokon', vi: 'Laptop, máy tính xách tay' },
      { jp: 'ふでばこ', romaji: 'fudebako', vi: 'Hộp bút' },
      { jp: 'けしゴム', romaji: 'keshigomu', vi: 'Cục gôm, cục tẩy (消しゴム)' },
      { jp: 'かぎ', romaji: 'kagi', vi: 'Chìa khóa' },
      { jp: 'おかね', romaji: 'okane', vi: 'Tiền (お金)' },
      { jp: 'カメラ', romaji: 'kamera', vi: 'Máy ảnh' },
      { jp: 'くるま', romaji: 'kuruma', vi: 'Ô tô, xe hơi (車)' },
      { jp: 'コーヒー', romaji: 'koohii', vi: 'Cà phê' },
      { jp: 'とけい', romaji: 'tokei', vi: 'Đồng hồ (時計)' },
      { jp: 'バイク', romaji: 'baiku', vi: 'Xe máy' },
      { jp: 'スマホ', romaji: 'sumaho', vi: 'Điện thoại thông minh' },
      { jp: 'チョコレート', romaji: 'chokoreeto', vi: 'Sô cô la' },
      { jp: 'おみやげ', romaji: 'omiyage', vi: 'Quà lưu niệm, quà đặc sản (お土産)' },

      // C. Từ để hỏi
      { jp: 'なん', romaji: 'nan', vi: 'Cái gì? (何)' },

      // D. Từ vựng hội thoại
      { jp: 'あのう～', romaji: 'anou ~', vi: 'À, ờ,... (biểu thị sự ngại ngùng, do dự)' },
      { jp: 'どうぞ～', romaji: 'douzo ~', vi: 'Xin mời (mời ai đó ăn gì hoặc làm gì)' },
      { jp: 'これから おせわに なります', romaji: 'korekara osewani narimasu', vi: 'Từ nay tôi rất mong sự giúp đỡ của anh chị! (これから お世話に なります)' }
    ],
    expansions: [
      {
        id: 'b2-exp-1',
        order: 'Mở rộng',
        title: 'Câu hỏi chứa từ để hỏi (Sở hữu)',
        formula: 'だれの N ですか。',
        meaning: 'N là của ai?',
        notes: [
          'Lưu ý: Câu trả lời: N1 の [N] です。 (N2 của N1).',
          'N1 là danh từ chỉ người.'
        ],
        dialogue: [
          {
            id: 'b2-exp-1-d1',
            speaker: 'A',
            jp: 'それは だれの スマホですか。',
            romaji: 'Sore wa dare no sumaho desu ka.',
            vi: 'Đó là điện thoại của ai?'
          },
          {
            id: 'b2-exp-1-d2',
            speaker: 'B',
            jp: 'わたしの [スマホ] です。',
            romaji: 'Watashi no [sumaho] desu.',
            vi: '(Điện thoại) của tôi.'
          }
        ]
      }
    ],
    grammarPoints: [
      {
        id: 'b2-g1',
        order: '1',
        title: 'これ／それ／あれは N です。',
        meaning: 'Cái này / Cái đó / Cái kia là N',
        usage: 'Dùng khi muốn miêu tả vị trí của sự vật.',
        formula: 'これ／それ／あれ は N です。',
        notes: [
          '「これ」 chỉ vật ở gần người nói.',
          '「それ」 chỉ vật ở gần người nghe.',
          '「あれ」 chỉ vật ở xa cả người nói và người nghe.'
        ],
        examples: [
          {
            id: 'b2-g1-ex1',
            jp: '① これは どらやきです。',
            romaji: 'Kore wa dorayaki desu.',
            vi: 'Đây là bánh Dorayaki.'
          },
          {
            id: 'b2-g1-ex2',
            jp: '② それは かさです。',
            romaji: 'Sore wa kasa desu.',
            vi: 'Đó là cái ô.'
          }
        ]
      },
      {
        id: 'b2-g1-1',
        order: '1.1',
        title: 'これ／それ／あれは N ですか。',
        meaning: 'Cái này / Cái đó / Cái kia là N phải không?',
        usage: 'Dùng khi muốn xác nhận đồ vật.',
        formula: 'これ／それ／あれ は N ですか。',
        responses: {
          affirmative: ['はい、そうです。', 'はい、N です。'],
          negative: [
            'いいえ、ちがいます。N2 です。',
            'いいえ、N じゃ ありません。N2 です。',
            'いいえ、N では ありません。N2 です。'
          ]
        },
        notes: [
          'Câu trả lời:',
          '• Khẳng định: はい、そうです。 / はい、N です。',
          '• Phủ định: いいえ、ちがいます。N2 です。 / いいえ、N じゃ ありません。N2 です。 / いいえ、N では ありません。N2 です。'
        ],
        examples: [
          {
            id: 'b2-g1-1-ex1',
            speaker: 'A',
            jp: '① A: それは シャープペンシルですか。',
            romaji: 'Sore wa shaapupenshiru desu ka.',
            vi: 'Đó là cái bút chì kim phải không?'
          },
          {
            id: 'b2-g1-1-ex2',
            speaker: 'B',
            jp: 'B: はい、そうです。',
            romaji: 'Hai, sou desu.',
            vi: 'Vâng, đúng vậy.'
          },
          {
            id: 'b2-g1-1-ex3',
            speaker: 'A',
            jp: '② A: あれは ねこですか。',
            romaji: 'Are wa neko desu ka.',
            vi: 'Kia là con mèo phải không?'
          },
          {
            id: 'b2-g1-1-ex4',
            speaker: 'B',
            jp: 'B: いいえ、ちがいます。ふくろです。',
            romaji: 'Iie, chigaimasu. Fukuro desu.',
            vi: 'Không, không phải. Là cái túi.'
          }
        ]
      },
      {
        id: 'b2-g1-2',
        order: '1.2',
        title: 'これ／それ／あれは 何ですか。',
        meaning: 'Cái này / Cái đó / Cái kia là cái gì?',
        usage: 'Dùng khi muốn hỏi tên đồ vật.',
        formula: 'これ／それ／あれ は なんですか。',
        notes: [
          'Câu trả lời: [これ／それ／あれは] N です。'
        ],
        examples: [
          {
            id: 'b2-g1-2-ex1',
            speaker: 'A',
            jp: '① A: それは なんですか。',
            romaji: 'Sore wa nan desu ka.',
            vi: 'Cái đó là cái gì?'
          },
          {
            id: 'b2-g1-2-ex2',
            speaker: 'B',
            jp: 'B: [これは] スマホです。',
            romaji: '[Kore wa] sumaho desu.',
            vi: '(Cái này) là điện thoại thông minh.'
          },
          {
            id: 'b2-g1-2-ex3',
            speaker: 'A',
            jp: '② A: これは なんですか。',
            romaji: 'Kore wa nan desu ka.',
            vi: 'Cái này là cái gì?'
          },
          {
            id: 'b2-g1-2-ex4',
            speaker: 'B',
            jp: 'B: いぬです。',
            romaji: 'Inu desu.',
            vi: 'Là con chó.'
          }
        ]
      },
      {
        id: 'b2-g2',
        order: '2',
        title: 'N1 の N2',
        meaning: 'N2 của N1 (Sở hữu đồ vật)',
        usage: 'Dùng khi muốn nói về sở hữu của một đồ vật nào đó.',
        formula: 'N1 の N2',
        notes: [
          'N2 là đồ vật.',
          'N1 là chủ sở hữu của đồ vật đó (N1 là danh từ chỉ người).'
        ],
        examples: [
          {
            id: 'b2-g2-ex1',
            jp: 'これは わたしの スマホです。',
            romaji: 'Kore wa watashi no sumaho desu.',
            vi: 'Đây là điện thoại của tôi.'
          }
        ]
      }
    ]
  }
];
