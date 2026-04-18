document.addEventListener('DOMContentLoaded', () => {

// =========================
// Dynamic Year for Footer
// =========================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// =========================
// Hamburger Menu Toggle
// =========================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isExpanded = navLinks.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', isExpanded);
  });
}

// =========================
// Hero Image Carousel
// =========================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) slide.classList.add('active');
  });
}

function nextSlide() {
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Initialize carousel only if there are slides
if (slides.length > 0) {
  showSlide(0);
  setInterval(nextSlide, 5000);
}

// =========================
// Landing Page "Explore" Button (no auto-redirect)
// =========================
const exploreBtn = document.getElementById('explore-btn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    window.location.href = 'home.html';
  });
}

// =========================
// Scroll Reveal Animation
// =========================
const revealOptions = { threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, revealOptions);

document.querySelectorAll('section').forEach(section => {
  if (section.classList.contains('hero-section')) {
    section.classList.add('show');
  } else {
    revealObserver.observe(section);
  }
});

// =========================
// Counter Animation
// =========================
const counters = document.querySelectorAll('.count');

const animateCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  let count = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      counter.innerText = target;
      clearInterval(timer);
    } else {
      counter.innerText = Math.ceil(count);
    }
  }, 15);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.started) {
      entry.target.dataset.started = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 1.0 });

counters.forEach(c => counterObserver.observe(c));

// =========================
// Menu and Gallery Filtering
// =========================
const filterButtons = document.querySelectorAll('.menu-filters button, .gallery-filters button');
const menuCards = document.querySelectorAll('.menu-card');
const galleryItems = document.querySelectorAll('.gallery-grid [data-category]');
const menuSearch = document.getElementById('menu-search');
const gallerySearch = document.getElementById('gallery-search');

function filterMenu() {
  const searchTerm = menuSearch ? menuSearch.value.toLowerCase() : '';
  const activeFilter = document.querySelector('.menu-filters button.active')?.getAttribute('data-filter') || 'all';

  menuCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const matchesSearch = title.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || card.classList.contains(activeFilter);
    card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
  });
}

function filterGallery() {
  const searchTerm = gallerySearch ? gallerySearch.value.trim() : '';
  const lowerSearchTerm = searchTerm.toLowerCase();
  const activeFilter = document.querySelector('.gallery-filters button.active')?.getAttribute('data-filter') || 'all';

  galleryItems.forEach(item => {
    const figcaption = item.querySelector('figcaption');
    if (!figcaption) return;

    // Store original text to prevent cumulative HTML nesting issues
    if (!figcaption.dataset.originalText) {
      figcaption.dataset.originalText = figcaption.textContent;
    }
    const originalText = figcaption.dataset.originalText;
    const cat = item.getAttribute('data-category');

    const matchesSearch = originalText.toLowerCase().includes(lowerSearchTerm) || 
                          cat.toLowerCase().includes(lowerSearchTerm);
    const matchesFilter = activeFilter === 'all' || cat === activeFilter;

    if (matchesSearch && matchesFilter) {
      item.style.display = 'block';
      if (searchTerm !== '') {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        figcaption.innerHTML = originalText.replace(regex, '<mark>$1</mark>');
      } else {
        figcaption.textContent = originalText;
      }
    } else {
      item.style.display = 'none';
    }
  });
}

// =========================
// Category Count Badges
// =========================
function updateMenuCategoryCounts() {
  const menuFilters = document.querySelectorAll('.menu-filters button');
  if (menuFilters.length > 0 && menuCards.length > 0) {
    menuFilters.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const count = filter === 'all' 
        ? menuCards.length 
        : Array.from(menuCards).filter(card => card.classList.contains(filter)).length;
      
      let badge = btn.querySelector('.filter-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'filter-badge';
        btn.appendChild(badge);
      }
      badge.textContent = count;
    });
  }
}

function updateGalleryCategoryCounts() {
  const galleryFilters = document.querySelectorAll('.gallery-filters button');
  if (galleryFilters.length > 0 && galleryItems.length > 0) {
    galleryFilters.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const count = filter === 'all' 
        ? galleryItems.length 
        : Array.from(galleryItems).filter(item => item.getAttribute('data-category') === filter).length;
      
      let badge = btn.querySelector('.filter-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'filter-badge';
        btn.appendChild(badge);
      }
      badge.textContent = count;
    });
  }
}

updateMenuCategoryCounts();
updateGalleryCategoryCounts();

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const group = button.closest('.menu-filters, .gallery-filters');
    if (!group) return;
    group.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    if (group.classList.contains('menu-filters')) {
      filterMenu();
    }

    const filter = button.getAttribute('data-filter');

    // Gallery filter
    if (group.classList.contains('gallery-filters')) {
      filterGallery();
    }
  });
});

if (menuSearch) {
  menuSearch.addEventListener('input', filterMenu);
}

if (gallerySearch) {
  gallerySearch.addEventListener('input', filterGallery);
}

// =========================
// Simple Lightbox for Gallery
// =========================
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img alt="Preview">';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

// Delegate to support future dynamically added images
function bindGalleryLightbox(root = document) {
  root.querySelectorAll('.gallery-grid img').forEach(img => {
    if (img.dataset.lbBound) return;
    img.dataset.lbBound = '1';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('open');
    });
  });
}

bindGalleryLightbox();

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxClose) {
    lightbox.classList.remove('open');
    lightboxImg.removeAttribute('src');
  }
});

// =========================
// Floating WhatsApp Button
// =========================
const whatsappBtn = document.querySelector('.floating-whatsapp');
if (whatsappBtn) {
  whatsappBtn.addEventListener('mouseover', () => {
    whatsappBtn.style.transform = 'scale(1.2)';
  });
  whatsappBtn.addEventListener('mouseleave', () => {
    whatsappBtn.style.transform = 'scale(1)';
  });
}

// =========================
// Smooth Scroll for Nav Links
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetSelector = this.getAttribute('href');
    const target = document.querySelector(targetSelector);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// =========================
// FAQ Accordion Toggle
// =========================
const faqQuestions = document.querySelectorAll('.faq-question');
if (faqQuestions.length > 0) {
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items for a cleaner accordion effect
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) item.classList.add('active');
    });
  });
}

// =========================
// Staggered Scroll Reveal
// =========================
const staggeredItems = document.querySelectorAll('.staggered-reveal figure');
const staggeredObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add delay based on index for staggered effect
      setTimeout(() => {
        entry.target.classList.add('show');
      }, (index % 3) * 150); 
    }
  });
}, { threshold: 0.1 });

staggeredItems.forEach(item => staggeredObserver.observe(item));

// =========================
// Testimonials Slider
// =========================
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonials-slider .dot');
let currentTestimonial = 0;

function showTestimonial(index) {
  testimonialSlides.forEach((slide, i) => {
    slide.classList.remove('active');
    testimonialDots[i].classList.remove('active');
  });
  testimonialSlides[index].classList.add('active');
  testimonialDots[index].classList.add('active');
}

function nextTestimonial() {
  if (testimonialSlides.length === 0) return;
  currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
  showTestimonial(currentTestimonial);
}

if (testimonialSlides.length > 0) {
  setInterval(nextTestimonial, 6000);
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => { currentTestimonial = index; showTestimonial(index); });
  });
}

// =========================
// Cake Size Guide Modal
// =========================
const sizeGuideBtn = document.getElementById('size-guide-btn');
const sizeGuideModal = document.getElementById('size-guide-modal');
const closeModal = document.querySelector('.close-modal');

if (sizeGuideBtn && sizeGuideModal) {
  const toggleModal = (show) => {
    sizeGuideModal.classList.toggle('open', show);
    document.body.style.overflow = show ? 'hidden' : '';
  };

  sizeGuideBtn.addEventListener('click', () => toggleModal(true));
  
  closeModal.addEventListener('click', () => toggleModal(false));
  
  sizeGuideModal.addEventListener('click', (e) => {
    if (e.target === sizeGuideModal) toggleModal(false);
  });
  
  // Support Escape key for accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sizeGuideModal.classList.contains('open')) toggleModal(false);
  });
}

// =========================
// Landing Page Background Cross-fade
// =========================
function initLandingBgSlider() {
  const bgSlides = document.querySelectorAll('.landing-bg-slides .bg-slide');
  if (bgSlides.length === 0) return;

  let currentBg = 0;
  setInterval(() => {
    bgSlides[currentBg].classList.remove('active');
    currentBg = (currentBg + 1) % bgSlides.length;
    bgSlides[currentBg].classList.add('active');
  }, 6000); // 6 seconds per slide for a relaxed feel
}

initLandingBgSlider();

// =========================
// Contact Page Clipboard
// =========================
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const textToCopy = btn.getAttribute('data-copy');
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 2000);
    });
  });
});

// =========================
// Contact Form AJAX Submission
// =========================
const contactForm = document.querySelector('.contact-form');
const successMessage = document.getElementById('contact-success');

if (contactForm && successMessage) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4081', '#e63673', '#ffffff']
        });
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (err) {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
      alert('Oops! There was a problem submitting your form. Please check your connection or contact us via WhatsApp.');
    }
  });
}

}); // End DOMContentLoaded
