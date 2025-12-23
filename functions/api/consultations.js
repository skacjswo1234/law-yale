export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  // DB 바인딩 (바인딩 이름이 "law-yale-db")
  const db = env['law-yale-db'];

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // OPTIONS 요청 처리
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET: 상담 신청 목록 조회
    if (method === 'GET') {
      const status = url.searchParams.get('status');
      let query = 'SELECT * FROM consultations';
      let params = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const { results } = await db.prepare(query).bind(...params).all();

      return new Response(
        JSON.stringify({ success: true, data: results }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST: 상담 신청 생성
    if (method === 'POST') {
      const body = await request.json();

      if (!body.name || !body.phone || !body.inquiry_type) {
        return new Response(
          JSON.stringify({ success: false, error: '필수 필드가 누락되었습니다.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const result = await db.prepare(
        `INSERT INTO consultations (name, phone, inquiry_type, content, status)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(
          body.name,
          body.phone,
          body.inquiry_type,
          body.content || null,
          body.status || 'pending'
        )
        .run();

      return new Response(
        JSON.stringify({ success: true, id: result.meta.last_row_id }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // PUT: 상담 신청 수정
    if (method === 'PUT') {
      const body = await request.json();

      if (!body.id) {
        return new Response(
          JSON.stringify({ success: false, error: 'ID가 필요합니다.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await db.prepare(
        `UPDATE consultations 
         SET name = ?, phone = ?, inquiry_type = ?, content = ?, status = ?, notes = ?, updated_at = datetime('now', 'localtime')
         WHERE id = ?`
      )
        .bind(
          body.name,
          body.phone,
          body.inquiry_type,
          body.content || null,
          body.status || 'pending',
          body.notes || null,
          body.id
        )
        .run();

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // DELETE: 상담 신청 삭제
    if (method === 'DELETE') {
      const id = url.searchParams.get('id');

      if (!id) {
        return new Response(
          JSON.stringify({ success: false, error: 'ID가 필요합니다.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await db.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run();

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: '지원하지 않는 메서드입니다.' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
