const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZWRvcWF4dm9tenhuZHR3aGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzA2MTU3NSwiZXhwIjoyMTAyNjM3NTc1fQ.XoRqaTKl1YxwJ7ZmiKfHqDzXYsnEEmlcmMpzjZoFy3c';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const grammarExampleUpdates = [
  {
    id: '563dfa29-d52e-4f8b-b163-d4266699e9f1',
    jp: '① コナンくんは Bクラスの がくせいです。'
  },
  {
    id: '967be607-56c8-48fd-81be-d35e3dbc8417',
    jp: '② あの ひとは ベトナムの かしゅです。'
  },
  {
    id: '55293654-253e-4613-8bb4-dbcaaba76b9b',
    jp: '③ 「TBC アナウンサー」の さとう あかりです。'
  },
  {
    id: 'bdf73359-e75b-43c2-b164-1f00e8b914b4',
    jp: '① わたしは かんこくじんでは ありません。'
  },
  {
    id: '704f64ef-43ef-403e-ba33-7055d6db1cbc',
    jp: '② わたしは きょうしじゃ ありません。かいしゃいんです。'
  },
  {
    id: '1de7ab77-a60a-463f-a363-a9de51bf54c0',
    jp: '① A: リサさんは かんこくじんですか。'
  },
  {
    id: 'b4e841ce-b7c6-481e-a330-31c77cc04365',
    jp: 'B: いいえ、ちがいます。タイじんです。'
  },
  {
    id: 'dfcf9670-e2cc-43ac-913b-d7d2f876bd2a',
    jp: '② A: ヒエンさんは ベトナムじんですか。'
  },
  {
    id: '65bed737-2a87-4607-84c0-008581617d93',
    jp: '① A: あの ひとは だれですか。'
  },
  {
    id: 'a68c5a66-9b6f-4d71-9f8c-ce338d113b70',
    jp: '② A: コナンくんは なんさいですか。'
  },
  {
    id: 'f526d76d-6997-4586-8ff4-89feff01ff7c',
    jp: 'B: 7さいです。'
  },
  {
    id: '37007a5a-33ac-421b-b415-48862a5ec12b',
    jp: 'しんいちくんは がくせいです。ランさんも がくせいです。'
  }
];

const expansionDialogueUpdates = [
  {
    id: '877d745b-b640-4cdc-a517-db08c7964912',
    jp: 'おしごとは？'
  },
  {
    id: 'f34e41fc-9da4-4bd0-a2e4-5a43154ec555',
    jp: 'かしゅです。'
  },
  {
    id: '881c1fe9-7adc-4c7c-83b4-4b9329cb04e9',
    jp: 'はじめまして！'
  },
  {
    id: '8df8d36c-fed6-452d-9559-fd7104ad0319',
    jp: 'わたしは リキモです。',
    vi: 'Tôi là Rikimo. (Giới thiệu tên)'
  },
  {
    id: '78c8c39a-833a-4b63-9b4c-d245a585c7e6',
    jp: '[わたしは] ベトナムじんです。',
    vi: 'Tôi là người Việt Nam. (Giới thiệu quốc tịch)'
  },
  {
    id: '3566021e-c9f4-420c-b10c-e728d4028773',
    jp: '[わたしは] きょうしです。',
    vi: 'Tôi là giáo viên. (Giới thiệu nghề nghiệp)'
  }
];

const expansionUpdates = [
  {
    id: 'a706c52e-aa67-4644-b80f-475ef57c263b',
    formula: 'おしごとは？',
    notes: ['Lưu ý: Câu trả lời: [わたしは] ______ です。']
  },
  {
    id: '25eeb80f-075d-4910-9156-f491b0d35ad5',
    notes: [
      '* 「はじめまして！」 sử dụng trong lần đầu gặp mặt.',
      '* Có thể lược bỏ 「わたしは」 ở những câu sau.',
      '* Khi giới thiệu bản thân, người Nhật thường không giới thiệu tuổi.'
    ]
  }
];

async function updateAll() {
  console.log('--- Updating Grammar Examples ---');
  for (const item of grammarExampleUpdates) {
    const { error } = await supabase
      .from('lesson_grammar_examples')
      .update({ jp: item.jp })
      .eq('id', item.id);
    if (error) {
      console.error('Error updating grammar example:', item.id, error);
    } else {
      console.log('Updated grammar example:', item.id, '->', item.jp);
    }
  }

  console.log('\n--- Updating Expansion Dialogues ---');
  for (const item of expansionDialogueUpdates) {
    const updateObj = { jp: item.jp };
    if (item.vi) updateObj.vi = item.vi;
    const { error } = await supabase
      .from('lesson_expansion_dialogues')
      .update(updateObj)
      .eq('id', item.id);
    if (error) {
      console.error('Error updating expansion dialogue:', item.id, error);
    } else {
      console.log('Updated expansion dialogue:', item.id, '->', item.jp);
    }
  }

  console.log('\n--- Updating Expansions ---');
  for (const item of expansionUpdates) {
    const updateObj = {};
    if (item.formula !== undefined) updateObj.formula = item.formula;
    if (item.notes !== undefined) updateObj.notes = item.notes;
    const { error } = await supabase
      .from('lesson_expansions')
      .update(updateObj)
      .eq('id', item.id);
    if (error) {
      console.error('Error updating expansion:', item.id, error);
    } else {
      console.log('Updated expansion:', item.id);
    }
  }

  console.log('\nAll updates completed successfully!');
}

updateAll();
