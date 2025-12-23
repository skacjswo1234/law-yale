interface Env {
  DB: D1Database;
  ADMIN_PASSWORD?: string;
}

const ADMIN_PASSWORD = 'admin123'; // 실제 운영 환경에서는 환경 변수로 관리

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // OPTIONS 요청 처리
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // POST: 로그인
    if (method === 'POST') {
      const body = await request.json();
      const { password } = body;

      if (!password) {
        return new Response(
          JSON.stringify({ success: false, error: '비밀번호가 필요합니다.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // 단순 비밀번호 비교
      const correctPassword = env.ADMIN_PASSWORD || ADMIN_PASSWORD;
      if (password === correctPassword) {
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
    }

    return new Response(
      JSON.stringify({ success: false, error: '지원하지 않는 메서드입니다.' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
