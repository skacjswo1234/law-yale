export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (method !== 'PUT') {
    return new Response(
      JSON.stringify({ success: false, error: 'PUT만 지원합니다.' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body || {};

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ success: false, error: '현재 비밀번호와 새 비밀번호가 필요합니다.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // DB에서 현재 비밀번호 조회
    const db = env['law-yale-db'];
    const result = await db.prepare('SELECT pw FROM admins ORDER BY id LIMIT 1').first();

    if (!result || !result.pw) {
      return new Response(
        JSON.stringify({ success: false, error: '관리자 계정이 없습니다.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 현재 비밀번호 확인
    if (currentPassword !== result.pw) {
      return new Response(
        JSON.stringify({ success: false, error: '현재 비밀번호가 올바르지 않습니다.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 새 비밀번호로 업데이트
    await db.prepare('UPDATE admins SET pw = ? WHERE id = (SELECT id FROM admins ORDER BY id LIMIT 1)')
      .bind(newPassword)
      .run();

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error?.message || '요청 처리 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
