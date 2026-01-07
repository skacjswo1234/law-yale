const API_BASE = '/api';

// 페이지 로드 시 인증 확인
const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
if (isLoggedIn) {
  showAdminScreen();
  showSection('consultations');
} else {
  showLoginScreen();
}

// 로그인
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      showAdminScreen();
      showSection('consultations');
    } else {
      console.error('Login error:', result);
      showError(result.error || '로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error('Login fetch error:', error);
    showError('로그인 중 오류가 발생했습니다: ' + error.message);
  }
});

// 로그아웃
function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'block';
  document.getElementById('adminScreen').style.display = 'none';
}

function showAdminScreen() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminScreen').style.display = 'block';
}

function showError(message) {
  const errorDiv = document.getElementById('loginError');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// 섹션 전환
function showSection(sectionName) {
  // 모든 섹션 숨기기
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // 모든 사이드바 아이템 비활성화
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });

  // 선택한 섹션 표시
  const section = document.getElementById(`${sectionName}Section`);
  if (section) {
    section.classList.add('active');
  }

  // 사이드바 아이템 활성화
  const sidebarItem = event?.target.closest('.sidebar-item');
  if (sidebarItem) {
    sidebarItem.classList.add('active');
  }

  // 모바일에서 사이드바 닫기
  if (window.innerWidth <= 768) {
    toggleSidebar();
  }

  // 섹션별 데이터 로드
  if (sectionName === 'consultations') {
    loadConsultations();
  } else if (sectionName === 'password') {
    // 비밀번호 변경 폼 초기화
    document.getElementById('passwordForm').reset();
  }
}

// 모바일 사이드바 토글
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (!sidebar) return;
  
  if (sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    if (overlay) overlay.style.display = 'none';
  } else {
    sidebar.classList.add('active');
    if (overlay) overlay.style.display = 'block';
  }
}

// 초기 섹션 표시
window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
  if (isLoggedIn) {
    const consultationsSection = document.getElementById('consultationsSection');
    if (consultationsSection) {
      consultationsSection.classList.add('active');
    }
    const sidebarItem = document.querySelector('.sidebar-item');
    if (sidebarItem) {
      sidebarItem.classList.add('active');
    }
  }
});



// 상담 신청 목록 로드
async function loadConsultations() {
  try {
    const status = document.getElementById('statusFilter')?.value || '';
    const url = status ? `${API_BASE}/consultations?status=${status}` : `${API_BASE}/consultations`;
    
    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      renderConsultationsTable(result.data);
    }
  } catch (error) {
    console.error('상담 신청 로드 오류:', error);
  }
}

// 날짜를 한국 시간으로 변환하는 함수
function formatKoreaTime(dateString) {
  if (!dateString) return '-';
  
  try {
    // 날짜 문자열을 Date 객체로 변환
    const date = new Date(dateString);
    
    // 유효하지 않은 날짜인 경우 원본 반환
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 날짜:', dateString);
      return dateString;
    }
    
    // Intl.DateTimeFormat을 사용하여 한국 시간대로 정확히 변환
    const options = {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
    const second = parts.find(p => p.type === 'second').value;
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  } catch (error) {
    console.error('날짜 변환 오류:', error, '원본:', dateString);
    return dateString;
  }
}

function renderConsultationsTable(consultations) {
  const table = document.getElementById('consultationsTable');
  
  if (consultations.length === 0) {
    table.innerHTML = '<p>등록된 상담 신청이 없습니다.</p>';
    return;
  }

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // 모바일: 카드 형태로 표시
    let html = '<div style="display: flex; flex-direction: column; gap: 16px;">';
    
      consultations.forEach(consultation => {
        const statusClass = `status-${consultation.status}`;
        const statusText = {
          'pending': '대기중',
          'contacted': '연락완료',
          'completed': '완료',
          'cancelled': '취소'
        }[consultation.status] || consultation.status;

        const inquiryTypeText = {
          'personal-rehabilitation': '개인회생',
          'personal-bankruptcy': '개인파산',
          'consultation': '상담 문의',
          'other': '기타'
        }[consultation.inquiry_type] || consultation.inquiry_type;

        html += `
          <div style="background: #FFFFFF; border: 1px solid #ddd; border-radius: 8px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
              <div>
                <div style="font-weight: 600; margin-bottom: 4px;">${consultation.name}</div>
                <div style="font-size: 0.9rem; color: #666;">${consultation.phone}</div>
              </div>
              <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; font-size: 0.85rem;">유형: </span>
              <span style="font-size: 0.85rem;">${inquiryTypeText}</span>
            </div>
          ${consultation.content ? `<div style="margin-bottom: 8px; font-size: 0.85rem; color: #666;">${consultation.content}</div>` : ''}
          <div style="margin-bottom: 12px; font-size: 0.8rem; color: #999;">${formatKoreaTime(consultation.created_at)}</div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary" onclick="editConsultation(${consultation.id})" style="flex: 1;">수정</button>
            <button class="btn btn-danger" onclick="deleteConsultation(${consultation.id})" style="flex: 1;">삭제</button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    table.innerHTML = html;
  } else {
    // PC: 테이블 형태로 표시
    let html = `
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>연락처</th>
              <th>문의 유형</th>
              <th>내용</th>
              <th>상태</th>
              <th>신청일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
    `;

    consultations.forEach(consultation => {
      const statusClass = `status-${consultation.status}`;
      const statusText = {
        'pending': '대기중',
        'contacted': '연락완료',
        'completed': '완료',
        'cancelled': '취소'
      }[consultation.status] || consultation.status;

      html += `
        <tr>
          <td>${consultation.id}</td>
        <td>${consultation.name}</td>
        <td>${consultation.phone}</td>
        <td>${{
          'personal-rehabilitation': '개인회생',
          'personal-bankruptcy': '개인파산',
          'consultation': '상담 문의',
          'other': '기타'
        }[consultation.inquiry_type] || consultation.inquiry_type}</td>
        <td style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${consultation.content || '-'}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>${formatKoreaTime(consultation.created_at)}</td>
          <td>
            <button class="btn btn-primary" onclick="editConsultation(${consultation.id})">수정</button>
            <button class="btn btn-danger" onclick="deleteConsultation(${consultation.id})">삭제</button>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table></div>';
    table.innerHTML = html;
  }
}

// 상담 신청 모달
async function editConsultation(id) {
  try {
    const response = await fetch(`${API_BASE}/consultations`);
    const result = await response.json();
    
    if (result.success) {
      const consultation = result.data.find(c => c.id === id);
      if (consultation) {
        document.getElementById('consultationId').value = consultation.id;
        document.getElementById('consultationName').value = consultation.name;
        document.getElementById('consultationPhone').value = consultation.phone;
        document.getElementById('consultationType').value = consultation.inquiry_type;
        document.getElementById('consultationContent').value = consultation.content || '';
        document.getElementById('consultationStatus').value = consultation.status;
        document.getElementById('consultationNotes').value = consultation.notes || '';
        
        document.getElementById('consultationModal').classList.add('active');
      }
    }
  } catch (error) {
    console.error('상담 신청 데이터 로드 오류:', error);
  }
}

function closeConsultationModal() {
  document.getElementById('consultationModal').classList.remove('active');
}

document.getElementById('consultationForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('consultationId').value;
  const data = {
    name: document.getElementById('consultationName').value,
    phone: document.getElementById('consultationPhone').value,
    inquiry_type: document.getElementById('consultationType').value,
    content: document.getElementById('consultationContent').value,
    status: document.getElementById('consultationStatus').value,
    notes: document.getElementById('consultationNotes').value,
  };

  try {
    if (id) {
      data.id = parseInt(id);
    }

    const response = await fetch(`${API_BASE}/consultations`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      closeConsultationModal();
      loadConsultations();
    } else {
      alert('저장 중 오류가 발생했습니다: ' + result.error);
    }
  } catch (error) {
    alert('저장 중 오류가 발생했습니다.');
  }
});

async function deleteConsultation(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    const response = await fetch(`${API_BASE}/consultations?id=${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      loadConsultations();
    } else {
      alert('삭제 중 오류가 발생했습니다: ' + result.error);
    }
  } catch (error) {
    alert('삭제 중 오류가 발생했습니다.');
  }
}

// 비밀번호 변경 폼 처리
document.getElementById('passwordForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    alert('새 비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (result.success) {
      alert('비밀번호가 변경되었습니다.');
      document.getElementById('passwordForm').reset();
    } else {
      alert('비밀번호 변경 중 오류가 발생했습니다: ' + (result.error || '알 수 없는 오류'));
    }
  } catch (error) {
    console.error('Password change error:', error);
    alert('비밀번호 변경 중 오류가 발생했습니다.');
  }
});
