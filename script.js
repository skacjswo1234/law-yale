const reviewData = [
  { name: "김x수", rating: 5, comment: "빠르고 정확한 상담 덕분에 개인회생이 잘 진행되었습니다. 감사합니다!", date: "2025.12.18" },
  { name: "이x영", rating: 5, comment: "변호사님이 친절하게 설명해주셔서 이해하기 쉬웠어요. 추천합니다!", date: "2025.11.25" },
  { name: "박x호", rating: 5, comment: "처음이라 걱정이 많았는데, 차근차근 안내해주셔서 안심이 됐습니다.", date: "2025.10.12" },
  { name: "최x민", rating: 5, comment: "전문적이고 신속한 처리로 시간을 절약할 수 있었습니다. 만족합니다.", date: "2025.09.08" },
  { name: "정x진", rating: 5, comment: "상담부터 인가까지 전 과정을 꼼꼼하게 관리해주셔서 감사합니다.", date: "2025.08.20" },
  { name: "강x우", rating: 5, comment: "어려운 상황에서 희망을 주셔서 정말 감사합니다. 좋은 결과가 나왔어요.", date: "2025.07.15" },
  { name: "윤x희", rating: 5, comment: "전문 변호사님이 직접 상담해주셔서 신뢰가 갔습니다. 추천드려요!", date: "2025.06.28" },
  { name: "장x준", rating: 5, comment: "친절하고 상세한 설명 덕분에 제도 선택이 쉬웠습니다. 감사합니다.", date: "2025.05.19" },
];

const dummyData = [
  { name: "이x은", phone: "010-xxxx-4523", content: "개인회생" },
  { name: "김x호", phone: "010-xxxx-7821", content: "개인회생" },
  { name: "박x수", phone: "010-xxxx-3094", content: "개인파산" },
  { name: "최x영", phone: "010-xxxx-5612", content: "개인회생" },
  { name: "정x민", phone: "010-xxxx-8945", content: "개인회생" },
  { name: "강x희", phone: "010-xxxx-2378", content: "개인파산" },
  { name: "윤x준", phone: "010-xxxx-6451", content: "개인회생" },
  { name: "장x진", phone: "010-xxxx-4789", content: "개인회생" },
  { name: "임x우", phone: "010-xxxx-1234", content: "개인회생" },
  { name: "한x지", phone: "010-xxxx-9876", content: "개인파산" },
  { name: "오x현", phone: "010-xxxx-3456", content: "개인회생" },
  { name: "서x율", phone: "010-xxxx-7890", content: "개인회생" },
  { name: "신x아", phone: "010-xxxx-2345", content: "개인파산" },
  { name: "조x성", phone: "010-xxxx-6789", content: "개인회생" },
  { name: "배x연", phone: "010-xxxx-4567", content: "개인회생" },
];

const CHUNK_SIZE = 3;
const INTERVAL_MS = 3000;

function createItemElement(item) {
  const el = document.createElement("div");
  el.className = "realtime-item";

  const nameEl = document.createElement("span");
  nameEl.className = "realtime-name";
  nameEl.textContent = item.name;

  const phoneEl = document.createElement("span");
  phoneEl.className = "realtime-phone";
  phoneEl.textContent = item.phone;

  const contentEl = document.createElement("span");
  contentEl.className = "realtime-content";
  contentEl.textContent = item.content;

  el.appendChild(nameEl);
  el.appendChild(phoneEl);
  el.appendChild(contentEl);
  return el;
}

function setupRealtimeList() {
  const container = document.getElementById("realtimeList");
  if (!container) return;

  const working = [...dummyData, ...dummyData, ...dummyData];
  let currentIndex = 0;

  // 초기 3개 아이템 추가
  for (let i = 0; i < CHUNK_SIZE; i++) {
    const item = createItemElement(working[currentIndex % working.length]);
    item.style.top = `${i * 33.33}%`;
    item.style.opacity = '1';
    container.appendChild(item);
    currentIndex++;
  }

  setInterval(() => {
    // 기존 3개 아이템 제거 (위로 올라가며 사라짐)
    const existingItems = Array.from(container.querySelectorAll('.realtime-item'));
    existingItems.forEach((item) => {
      item.style.transition = 'top 0.5s ease-out, opacity 0.5s ease-out';
      item.style.top = '-33.33%';
      item.style.opacity = '0';
    });

    // 새 3개 아이템 추가 (아래에서 올라옴)
    setTimeout(() => {
      existingItems.forEach(item => {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      });

      for (let i = 0; i < CHUNK_SIZE; i++) {
        const newItem = createItemElement(working[currentIndex % working.length]);
        newItem.style.top = '100%';
        newItem.style.opacity = '0';
        newItem.style.transition = 'top 0.5s ease-out, opacity 0.5s ease-out';
        container.appendChild(newItem);
        
        // 애니메이션 트리거
        requestAnimationFrame(() => {
          newItem.style.top = `${i * 33.33}%`;
          newItem.style.opacity = '1';
        });
        
        currentIndex++;
      }
    }, 500);
  }, INTERVAL_MS);
}

function createStarRating(rating) {
  const stars = document.createElement("div");
  stars.className = "review-stars";
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("span");
    star.className = i < rating ? "star filled" : "star";
    star.textContent = "★";
    stars.appendChild(star);
  }
  return stars;
}

function createReviewCard(review) {
  const card = document.createElement("div");
  card.className = "review-card";

  const header = document.createElement("div");
  header.className = "review-card-header";

  const nameEl = document.createElement("div");
  nameEl.className = "review-card-name";
  nameEl.textContent = review.name;

  const ratingEl = createStarRating(review.rating);
  header.appendChild(nameEl);
  header.appendChild(ratingEl);

  const commentEl = document.createElement("div");
  commentEl.className = "review-card-comment";
  commentEl.textContent = review.comment;

  const dateEl = document.createElement("div");
  dateEl.className = "review-card-date";
  dateEl.textContent = review.date;

  card.appendChild(header);
  card.appendChild(commentEl);
  card.appendChild(dateEl);
  return card;
}

function setupReviewSlider() {
  const container = document.getElementById("reviewSlider");
  if (!container) return;

  // PC: 2~3개씩 보이고 가로 슬라이더
  if (window.innerWidth > 768) {
    const working = [...reviewData, ...reviewData];
    working.forEach(review => {
      container.appendChild(createReviewCard(review));
    });

    let position = 0;
    const cardWidth = 150;
    const gap = 16;
    const moveDistance = cardWidth + gap;

    setInterval(() => {
      position -= moveDistance;
      
      if (position <= -(reviewData.length * moveDistance)) {
        position = 0;
        container.style.transition = 'none';
        container.style.transform = `translateX(${position}px)`;
        setTimeout(() => {
          container.style.transition = 'transform 0.6s ease-in-out';
        }, 50);
      } else {
        container.style.transition = 'transform 0.6s ease-in-out';
        container.style.transform = `translateX(${position}px)`;
      }
    }, 3000);
  } 
  // 모바일: 1개씩 보이고 가로 슬라이더
  else {
    const working = [...reviewData, ...reviewData, ...reviewData];
    working.forEach(review => {
      container.appendChild(createReviewCard(review));
    });

    let position = 0;
    
    function getCardWidth() {
      const firstCard = container.querySelector('.review-card');
      if (firstCard) {
        return firstCard.offsetWidth;
      }
      return window.innerWidth - 32; // 패딩 고려
    }

    const gap = 16;
    
    function moveSliderMobile() {
      const cardWidth = getCardWidth();
      const moveDistance = cardWidth + gap;
      position -= moveDistance;
      
      if (position <= -(reviewData.length * moveDistance)) {
        position = 0;
        container.style.transition = 'none';
        container.style.transform = `translateX(${position}px)`;
        setTimeout(() => {
          container.style.transition = 'transform 0.6s ease-in-out';
        }, 50);
      } else {
        container.style.transition = 'transform 0.6s ease-in-out';
        container.style.transform = `translateX(${position}px)`;
      }
    }

    setInterval(moveSliderMobile, 3000);
  }
}

function setupImageCardAnimations() {
  const cards = document.querySelectorAll('.image-card');
  if (cards.length === 0) return;

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    observer.observe(card);
  });
}

function setupMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const menuClose = document.getElementById("mobileMenuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileMenuOverlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  function openMenu() {
    menuBtn.classList.add("active");
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
      }
    });
  });
}

function setupSmoothScroll() {
  const navLinks = document.querySelectorAll(".nav-link");
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = document.querySelector(".site-header").offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
}

function setupTopButton() {
  const btnTop = document.getElementById("btnTop");
  const btnTopMobile = document.getElementById("btnTopMobile");
  
  if (btnTop) {
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  
  if (btnTopMobile) {
    btnTopMobile.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function setupBottomBar() {
  const bottomBarForm = document.getElementById("bottomBarForm");
  if (bottomBarForm) {
    bottomBarForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById("bottomBarName").value,
        phone: document.getElementById("bottomBarPhone").value,
        inquiry_type: document.getElementById("bottomBarType").value,
        content: "",
        status: "pending"
      };

      try {
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          bottomBarForm.reset();
          showSuccessModal();
        } else {
          alert("상담 신청 중 오류가 발생했습니다: " + (result.error || "알 수 없는 오류"));
        }
      } catch (error) {
        console.error("Error submitting consultation:", error);
        alert("상담 신청 중 오류가 발생했습니다.");
      }
    });
  }
}

function showSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.style.display = "flex";
  }
}

function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function setupInquiryForm() {
  const inquiryForm = document.querySelector(".inquiry-form");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        inquiry_type: document.getElementById("inquiryType").value,
        content: document.getElementById("content").value || "",
        status: "pending"
      };

      // 동의 체크박스 확인
      const agreeCheckbox = document.getElementById("agree");
      if (!agreeCheckbox.checked) {
        alert("개인정보 수집 및 이용에 동의해주세요.");
        return;
      }

      try {
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          inquiryForm.reset();
          showSuccessModal();
        } else {
          alert("상담 신청 중 오류가 발생했습니다: " + (result.error || "알 수 없는 오류"));
        }
      } catch (error) {
        console.error("Error submitting consultation:", error);
        alert("상담 신청 중 오류가 발생했습니다.");
      }
    });
  }
}

function setupMobileConsultButton() {
  const mobileConsultBtn = document.getElementById("mobileConsultBtn");
  if (mobileConsultBtn) {
    mobileConsultBtn.addEventListener("click", () => {
      const inquirySection = document.getElementById("inquiry");
      if (inquirySection) {
        inquirySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
}

function setupPetalsAnimation() {
  const containers = document.querySelectorAll('.petals-container');
  
  containers.forEach(container => {
    function createPetal() {
      const petal = document.createElement('div');
      petal.className = 'petal';
      const startX = Math.random() * 200 - 100;
      const drift = (Math.random() - 0.5) * 80;
      petal.style.left = `${50 + startX / 2}%`;
      petal.style.setProperty('--drift', `${drift}px`);
      petal.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(petal);
      
      setTimeout(() => {
        petal.remove();
      }, 3000);
    }
    
    // 초기 꽃가루 생성
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createPetal(), i * 200);
    }
    
    // 지속적으로 꽃가루 생성
    setInterval(() => {
      createPetal();
    }, 400);
  });
}

function setupMouseDragCircle() {
  const dragCircle = document.getElementById("mouseDragCircle");
  const heroSection = document.querySelector(".section-1");
  
  if (!dragCircle || !heroSection) return;

  let isScrolling = false;
  let scrollTimeout;

  function updateCirclePosition(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // 히어로 섹션 내부에 있을 때만 표시
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      dragCircle.style.left = x + 'px';
      dragCircle.style.top = y + 'px';
      dragCircle.classList.add('active');
    } else {
      dragCircle.classList.remove('active');
    }
  }

  // 마우스 움직임 추적
  heroSection.addEventListener('mousemove', updateCirclePosition);

  // 마우스가 섹션을 벗어날 때
  heroSection.addEventListener('mouseleave', () => {
    dragCircle.classList.remove('active');
  });

  // 휠 이벤트로 활성화
  heroSection.addEventListener('wheel', (e) => {
    isScrolling = true;
    dragCircle.classList.add('active');
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      if (!heroSection.matches(':hover')) {
        dragCircle.classList.remove('active');
      }
    }, 500);
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  setupReviewSlider();
  setupRealtimeList();
  setupImageCardAnimations();
  setupMobileMenu();
  setupSmoothScroll();
  setupTopButton();
  setupBottomBar();
  setupInquiryForm();
  setupMobileConsultButton();
  setupMouseDragCircle();
  setupPetalsAnimation();
});


