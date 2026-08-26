// Theme JavaScript for Sense and Style

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize search functionality
  initSearch();
  
  // Initialize cart functionality
  initCart();
  
  // Initialize accessibility features
  initAccessibility();
  
  // Initialize smooth scrolling
  initSmoothScrolling();
});

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      const isHidden = mobileMenu.classList.contains('hidden');
      
      mobileMenu.classList.toggle('hidden');
      mobileMenuToggle.setAttribute('aria-label', isHidden ? 'Close menu' : 'Open menu');
      mobileMenuToggle.setAttribute('aria-expanded', !isHidden);
      
      // Update icon
      mobileMenuToggle.innerHTML = isHidden ? 
        `{% render 'icon-close' %}` : 
        `{% render 'icon-menu' %}`;
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isHidden ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          mobileMenuToggle.setAttribute('aria-label', 'Open menu');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileMenuToggle.innerHTML = `{% render 'icon-menu' %}`;
          document.body.style.overflow = '';
        }
      }
    });
  }
}

// Search Functionality
function initSearch() {
  const searchToggle = document.getElementById('search-toggle');
  const searchContainer = document.getElementById('search-container');
  const searchInput = document.querySelector('#search-container input[type="search"]');
  
  if (searchToggle && searchContainer) {
    searchToggle.addEventListener('click', function() {
      const isHidden = searchContainer.classList.contains('hidden');
      
      searchContainer.classList.toggle('hidden');
      
      if (!isHidden && searchInput) {
        searchInput.focus();
      }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(event) {
      if (!searchToggle.contains(event.target) && !searchContainer.contains(event.target)) {
        if (!searchContainer.classList.contains('hidden')) {
          searchContainer.classList.add('hidden');
        }
      }
    });
  }
}

// Cart Functionality
function initCart() {
  // Update cart count when items are added/removed
  document.addEventListener('cart:updated', function(event) {
    const cartCountElement = document.querySelector('.js-cart-icon span');
    if (cartCountElement && event.detail && event.detail.cart) {
      cartCountElement.textContent = event.detail.cart.item_count;
    }
  });
  
  // Add to cart functionality for product cards
  document.addEventListener('click', function(event) {
    if (event.target.matches('.add-to-cart-button')) {
      event.preventDefault();
      const productId = event.target.dataset.productId;
      const variantId = event.target.dataset.variantId;
      
      if (productId && variantId) {
        addToCart(variantId, 1);
      }
    }
  });
}

// Add to Cart Function
function addToCart(variantId, quantity) {
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: variantId,
      quantity: quantity
    })
  })
  .then(response => response.json())
  .then(data => {
    // Trigger cart updated event
    document.dispatchEvent(new CustomEvent('cart:updated', {
      detail: { cart: data }
    }));
    
    // Show success message
    showNotification('Product added to cart!', 'success');
  })
  .catch(error => {
    console.error('Error adding to cart:', error);
    showNotification('Error adding product to cart', 'error');
  });
}

// Accessibility Features
function initAccessibility() {
  // Skip to content functionality
  const skipLink = document.querySelector('.skip-to-content-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Keyboard navigation for mobile menu
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const mobileMenu = document.getElementById('mobile-menu');
      const searchContainer = document.getElementById('search-container');
      
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }
      
      if (searchContainer && !searchContainer.classList.contains('hidden')) {
        searchContainer.classList.add('hidden');
      }
    }
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  // Smooth scroll for anchor links
  document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) {
      event.preventDefault();
      const target = document.querySelector(event.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Initialize lazy loading
initLazyLoading();
