interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
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
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: 'JSON 파싱 오류' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const { password } = body || {};

    if (!password) {
      return new Response(
        JSON.stringify({ success: false, error: '비밀번호가 필요합니다.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // DB에서 관리자 비밀번호 조회
    const result = await env.DB.prepare('SELECT pw FROM admins ORDER BY id LIMIT 1').first();
    
    if (!result) {
      return new Response(
        JSON.stringify({ success: false, error: '관리자 계정이 없습니다.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const dbPassword = (result as any)?.pw;
    
    if (!dbPassword) {
      return new Response(
        JSON.stringify({ success: false, error: '관리자 계정이 올바르지 않습니다.' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 비밀번호 비교
    if (password === dbPassword) {
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
      JSON.stringify({ 
        success: false, 
        error: error?.message || '요청 처리 중 오류가 발생했습니다.',
        details: error?.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
