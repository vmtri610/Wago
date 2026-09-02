import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminEmail } from '@/lib/admin';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ymedoqaxvomzxndtwhbt.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZWRvcWF4dm9tenhuZHR3aGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzA2MTU3NSwiZXhwIjoyMTAyNjM3NTc1fQ.XoRqaTKl1YxwJ7ZmiKfHqDzXYsnEEmlcmMpzjZoFy3c';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = 'update', id, lesson_id, title, meaning, usage, formula, notes, user_email } = body;

    // Check Admin authorization
    if (!isAdminEmail(user_email)) {
      return NextResponse.json(
        { success: false, error: 'Chỉ tài khoản admin (vominhtri1610@gmail.com) mới có quyền chỉnh sửa ngữ pháp.' },
        { status: 403 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // ACTION: DELETE
    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ success: false, error: 'Thiếu ID điểm ngữ pháp cần xóa' }, { status: 400 });
      }

      // Delete child examples first if needed
      await supabaseAdmin.from('lesson_grammar_examples').delete().eq('grammar_id', id);
      const { error: delErr } = await supabaseAdmin.from('lesson_grammar').delete().eq('id', id);

      if (delErr) {
        return NextResponse.json({ success: false, error: delErr.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'Đã xóa điểm ngữ pháp' });
    }

    // ACTION: ADD
    if (action === 'add') {
      if (!lesson_id || !title || !meaning) {
        return NextResponse.json({ success: false, error: 'Thiếu thông tin điểm ngữ pháp mới' }, { status: 400 });
      }

      const { data: inserted, error: insErr } = await supabaseAdmin
        .from('lesson_grammar')
        .insert([{
          lesson_id,
          order_label: body.order_label || '1',
          title: title.trim(),
          meaning: meaning.trim(),
          usage: usage ? usage.trim() : null,
          formula: formula ? formula.trim() : null,
          notes: Array.isArray(notes) ? notes : [],
          responses: {},
          order_index: 999
        }])
        .select();

      if (insErr) {
        return NextResponse.json({ success: false, error: insErr.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: inserted?.[0] });
    }

    // ACTION: UPDATE (Default)
    if (!id || !title || !meaning) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin cập nhật ngữ pháp' }, { status: 400 });
    }

    const updatePayload: any = {
      title: title.trim(),
      meaning: meaning.trim(),
      usage: usage !== undefined ? (usage ? usage.trim() : null) : undefined,
      formula: formula !== undefined ? (formula ? formula.trim() : null) : undefined,
      notes: Array.isArray(notes) ? notes : undefined,
      updated_at: new Date().toISOString()
    };

    // Remove undefined keys
    Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

    const { data, error } = await supabaseAdmin
      .from('lesson_grammar')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase admin update grammar error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy điểm ngữ pháp trong cơ sở dữ liệu để cập nhật' }, { status: 404 });
    }

    // Handle updating examples if provided
    if (body.examples && Array.isArray(body.examples)) {
      await supabaseAdmin.from('lesson_grammar_examples').delete().eq('grammar_id', id);

      const exampleRows = body.examples
        .filter((ex: any) => ex.jp && ex.jp.trim() && ex.vi && ex.vi.trim())
        .map((ex: any, idx: number) => ({
          grammar_id: id,
          speaker: ex.speaker || null,
          jp: ex.jp.trim(),
          romaji: ex.romaji?.trim() || ex.jp.trim(),
          vi: ex.vi.trim(),
          order_index: idx + 1
        }));

      if (exampleRows.length > 0) {
        const { error: exErr } = await supabaseAdmin.from('lesson_grammar_examples').insert(exampleRows);
        if (exErr) {
          console.error('Lỗi cập nhật ví dụ ngữ pháp:', exErr.message);
        }
      }
    }

    return NextResponse.json({ success: true, data: data?.[0] });
  } catch (err: any) {
    console.error('API lesson-grammar error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
