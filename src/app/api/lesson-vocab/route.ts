import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

import { isAdminEmail } from '@/lib/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = 'update', id, lesson_id, old_jp, jp, romaji, vi, user_email } = body;

    // Check Admin authorization
    if (!isAdminEmail(user_email)) {
      return NextResponse.json(
        { success: false, error: 'Chỉ tài khoản admin (vominhtri1610@gmail.com) mới có quyền thao tác trên bài học.' },
        { status: 403 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // ACTION: DELETE
    if (action === 'delete') {
      let targetId = id;
      if (!targetId && lesson_id && old_jp) {
        const { data: found } = await supabaseAdmin
          .from('words')
          .select('id')
          .eq('lesson_id', lesson_id)
          .eq('jp', old_jp)
          .limit(1);
        if (found && found.length > 0) targetId = found[0].id;
      }

      if (!targetId) {
        return NextResponse.json({ success: false, error: 'Không tìm thấy từ vựng cần xóa' }, { status: 400 });
      }

      const { error: delErr } = await supabaseAdmin.from('words').delete().eq('id', targetId);
      if (delErr) {
        return NextResponse.json({ success: false, error: delErr.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'Đã xóa từ vựng bài học' });
    }

    // ACTION: ADD
    if (action === 'add') {
      if (!lesson_id || !jp || !vi) {
        return NextResponse.json({ success: false, error: 'Thiếu thông tin từ vựng mới' }, { status: 400 });
      }

      const newId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined;
      const { data: inserted, error: insErr } = await supabaseAdmin
        .from('words')
        .insert([{
          ...(newId ? { id: newId } : {}),
          lesson_id,
          jp: jp.trim(),
          romaji: romaji?.trim() || jp.trim(),
          vi: vi.trim(),
          order_index: 999
        }])
        .select();

      if (insErr) {
        return NextResponse.json({ success: false, error: insErr.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: inserted?.[0] });
    }

    // ACTION: UPDATE (Default)
    if (!jp || !vi) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin từ vựng' }, { status: 400 });
    }

    let targetId = id;
    if (!targetId && lesson_id && old_jp) {
      const { data: found } = await supabaseAdmin
        .from('words')
        .select('id')
        .eq('lesson_id', lesson_id)
        .eq('jp', old_jp)
        .limit(1);
      if (found && found.length > 0) {
        targetId = found[0].id;
      }
    }

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy ID từ vựng cần cập nhật' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('words')
      .update({
        jp: jp.trim(),
        romaji: romaji?.trim() || jp.trim(),
        vi: vi.trim()
      })
      .eq('id', targetId)
      .select();

    if (error) {
      console.error('Supabase admin update error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    console.error('API lesson-vocab error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
