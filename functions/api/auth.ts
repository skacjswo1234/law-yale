interface Env {
  DB: D1Database;
}

// 단순 비밀번호만 비교
const ADMIN_PASSWORD = 'admin123';

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const method = request.method;

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'POST만 지원합니다.' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body || {};

    // 비밀번호 단순 비교
    if (password === ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: '비밀번호가 올바르지 않습니다.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: '요청 처리 중 오류가 발생했습니다.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
