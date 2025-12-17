const reviewData = [
  { name: "김x수", rating: 5, comment: "빠르고 정확한 상담 덕분에 개인회생이 잘 진행되었습니다. 감사합니다!", date: "2024.01.15" },
  { name: "이x영", rating: 5, comment: "변호사님이 친절하게 설명해주셔서 이해하기 쉬웠어요. 추천합니다!", date: "2024.01.12" },
  { name: "박x호", rating: 5, comment: "처음이라 걱정이 많았는데, 차근차근 안내해주셔서 안심이 됐습니다.", date: "2024.01.10" },
  { name: "최x민", rating: 5, comment: "전문적이고 신속한 처리로 시간을 절약할 수 있었습니다. 만족합니다.", date: "2024.01.08" },
  { name: "정x진", rating: 5, comment: "상담부터 인가까지 전 과정을 꼼꼼하게 관리해주셔서 감사합니다.", date: "2024.01.05" },
  { name: "강x우", rating: 5, comment: "어려운 상황에서 희망을 주셔서 정말 감사합니다. 좋은 결과가 나왔어요.", date: "2024.01.03" },
  { name: "윤x희", rating: 5, comment: "전문 변호사님이 직접 상담해주셔서 신뢰가 갔습니다. 추천드려요!", date: "2024.01.01" },
  { name: "장x준", rating: 5, comment: "친절하고 상세한 설명 덕분에 제도 선택이 쉬웠습니다. 감사합니다.", date: "2023.12.28" },
  { name: "임x아", rating: 5, comment: "빠른 응대와 정확한 절차 안내로 부담이 많이 줄었습니다.", date: "2023.12.25" },
  { name: "한x성", rating: 5, comment: "처음 상담부터 마지막까지 꾸준히 도와주셔서 정말 감사드립니다.", date: "2023.12.22" },
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

const CHUNK_SIZE = 4;
const INTERVAL_MS = 2500;

function createItemElement(item) {
  const el = document.createElement("div");
  el.className = "realtime-item";

  const nameEl = document.createElement("span");
  nameEl.className = "realtime-name";
  nameEl.textContent = `이름: ${item.name}`;

  const phoneEl = document.createElement("span");
  phoneEl.className = "realtime-phone";
  phoneEl.textContent = `연락처: ${item.phone}`;

  const contentEl = document.createElement("span");
  contentEl.className = "realtime-content";
  contentEl.textContent = `문의내용: ${item.content}`;

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

  // 첫 번째 아이템 추가
  const firstItem = createItemElement(working[currentIndex]);
  firstItem.style.top = '0';
  container.appendChild(firstItem);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % working.length;
    
    // 기존 아이템 제거
    const oldItem = container.querySelector('.realtime-item');
    if (oldItem) {
      oldItem.style.animation = 'slideUpReverse 0.5s ease-out forwards';
      setTimeout(() => {
        if (oldItem.parentNode) {
          oldItem.parentNode.removeChild(oldItem);
        }
      }, 500);
    }

    // 새 아이템 추가 (아래에서 올라옴)
    const newItem = createItemElement(working[currentIndex]);
    newItem.style.top = '100%';
    container.appendChild(newItem);
    
    // 애니메이션 트리거
    setTimeout(() => {
      newItem.style.top = '0';
      newItem.style.animation = 'slideUp 0.5s ease-out forwards';
    }, 10);
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

function createReviewElement(review) {
  const el = document.createElement("div");
  el.className = "review-item";

  const header = document.createElement("div");
  header.className = "review-header";

  const nameEl = document.createElement("div");
  nameEl.className = "review-name";
  nameEl.textContent = review.name;

  const ratingEl = createStarRating(review.rating);

  header.appendChild(nameEl);
  header.appendChild(ratingEl);

  const commentEl = document.createElement("div");
  commentEl.className = "review-comment";
  commentEl.textContent = review.comment;

  const dateEl = document.createElement("div");
  dateEl.className = "review-date";
  dateEl.textContent = review.date;

  el.appendChild(header);
  el.appendChild(commentEl);
  el.appendChild(dateEl);
  return el;
}

function setupReviewSlider() {
  const container = document.getElementById("reviewSlider");
  if (!container) return;

  const working = [...reviewData, ...reviewData, ...reviewData];
  const fragment = document.createDocumentFragment();
  working.forEach(review => {
    fragment.appendChild(createReviewElement(review));
  });
  container.appendChild(fragment);

  let position = 0;
  const itemWidth = 300;
  const gap = 16;
  const moveDistance = itemWidth + gap;
  const visibleItems = 3;
  const resetPosition = -(reviewData.length) * moveDistance;

  function moveSlider() {
    position -= moveDistance;
    
    if (position <= resetPosition) {
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

  setInterval(moveSlider, 3000);
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
    bottomBarForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inquirySection = document.getElementById("inquiry");
      if (inquirySection) {
        inquirySection.scrollIntoView({ behavior: "smooth", block: "start" });
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

document.addEventListener("DOMContentLoaded", () => {
  setupReviewSlider();
  setupRealtimeList();
  setupImageCardAnimations();
  setupMobileMenu();
  setupSmoothScroll();
  setupTopButton();
  setupBottomBar();
  setupMobileConsultButton();
});


