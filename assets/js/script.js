'use strict';

// Element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
}

// Load partial HTML content
function loadPartial(elementId, url) {
  // 1) Return the fetch(...) promise chain so callers can do .then(...)
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      // 2) Insert the fetched HTML into the target element
      const el = document.getElementById(elementId);
      if (el) {
        el.innerHTML = html;
        console.log(`Loaded ${url} into #${elementId}`);
        
        // 3) Re-initialize interactive features on the newly inserted HTML
        initializePageElements();
      } else {
        console.error(`Element with ID "${elementId}" not found.`);
      }
    })
    .catch(err => console.error(`Error loading ${url}:`, err));
}

// Initialize all interactive elements
function initializePageElements() {
  // Sidebar functionality
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");
  
  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));
  }

  // Modal functionality
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");
  
  function toggleModal() {
    modalContainer?.classList.toggle("active");
    overlay?.classList.toggle("active");
  }

  // Close modal events
  if (modalCloseBtn && overlay) {
    modalCloseBtn.addEventListener("click", toggleModal);
    overlay.addEventListener("click", toggleModal);
  }

  // Filter functionality
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]"); // Corrected spelling
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const filterItems = document.querySelectorAll("[data-filter-item]");

  // Select dropdown toggle
  if (select) {
    select.addEventListener("click", () => elementToggleFunc(select));
  }

  // Filter function
  function filterFunc(selectedValue) {
    filterItems.forEach(item => {
      const category = item.dataset.category.toLowerCase();
      if (selectedValue === "all" || selectedValue === category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  const skillsList = document.querySelector(".skills-list.has-scrollbar");
  if (skillsList) {
    makeDraggable(skillsList);
  }

  // Select items click handling
  selectItems.forEach(item => {
    item.addEventListener("click", () => {
      const selectedValue = item.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = item.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  // Filter button handling
  if (filterBtn.length > 0) {
    let lastClickedBtn = filterBtn[0];
    filterBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedValue = btn.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = btn.innerText;
        filterFunc(selectedValue);
        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        btn.classList.add("active");
        lastClickedBtn = btn;
      });
    });
  }

  // Form validation
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  if (form && formBtn) {
    formInputs.forEach(input => {
      input.addEventListener("input", () => {
        formBtn.disabled = !form.checkValidity();
      });
    });
  }
}


// Add to script.js
function initializeNewsYearFilter() {
  const newsItems = document.querySelectorAll('.news-post-item');
  const filterList = document.getElementById('newsYearFilter');
  const selectList = document.querySelector('.select-list');
  
  // Extract unique years from news items
  const years = new Set();
  newsItems.forEach(item => {
    const dateElement = item.querySelector('time');
    if (dateElement) {
      const year = new Date(dateElement.getAttribute('datetime')).getFullYear();
      years.add(year);
    }
  });

  // Sort years in descending order
  const sortedYears = Array.from(years).sort((a, b) => b - a);

  // Generate filter buttons for desktop
  sortedYears.forEach(year => {
    const filterItem = document.createElement('li');
    filterItem.className = 'filter-item';
    filterItem.innerHTML = `<button data-filter-btn>${year}</button>`;
    filterList.appendChild(filterItem);

    // Generate select items for mobile
    const selectItem = document.createElement('li');
    selectItem.className = 'select-item';
    selectItem.innerHTML = `<button data-select-item>${year}</button>`;
    selectList.appendChild(selectItem);
  });

  // Add filter functionality
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedYear = btn.textContent;
      
      // Show/hide news items based on year
      newsItems.forEach(item => {
        const dateElement = item.querySelector('time');
        if (dateElement) {
          const itemYear = new Date(dateElement.getAttribute('datetime')).getFullYear().toString();
          if (selectedYear === 'All Years' || itemYear === selectedYear) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        }
      });
    });
  });

  // Add select functionality for mobile
  const selectBtn = document.querySelector('.filter-select');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-select-value]');

  selectBtn.addEventListener('click', () => {
    selectBtn.classList.toggle('active');
  });

  selectItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedYear = item.textContent;
      selectValue.textContent = selectedYear;
      selectBtn.classList.remove('active');
      
      // Trigger filter
      const correspondingFilterBtn = Array.from(filterButtons)
        .find(btn => btn.textContent === selectedYear);
      if (correspondingFilterBtn) {
        correspondingFilterBtn.click();
      }
    });
  });
}




// Make a container draggable horizontally
function makeDraggable(element) {
  let isDown = false;
  let startX;
  let scrollLeft;

  element.addEventListener('mousedown', (e) => {
    isDown = true;
    element.classList.add('active');
    startX = e.pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  element.addEventListener('mouseleave', () => {
    isDown = false;
    element.classList.remove('active');
  });

  element.addEventListener('mouseup', () => {
    isDown = false;
    element.classList.remove('active');
  });

  element.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - element.offsetLeft;
    const walk = (x - startX) * 1; // Adjust scroll speed if needed
    element.scrollLeft = scrollLeft - walk;
  });

  // Touch Events for Mobile Compatibility
  element.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - element.offsetLeft;
    scrollLeft = element.scrollLeft;
  });

  element.addEventListener('touchend', () => {
    isDown = false;
  });

  element.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - element.offsetLeft;
    const walk = (x - startX) * 1; // Adjust scroll speed if needed
    element.scrollLeft = scrollLeft - walk;
  });
}

// Event delegation for dynamically loaded content
document.addEventListener("click", (event) => {
  // Handle testimonial items
  const testimonialItem = event.target.closest("[data-testimonials-item]");
  if (testimonialItem) {
    const modalImg = document.querySelector("[data-modal-img]");
    const modalTitle = document.querySelector("[data-modal-title]");
    const modalText = document.querySelector("[data-modal-text]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const overlay = document.querySelector("[data-overlay]");

    if (modalImg && modalTitle && modalText && modalContainer && overlay) {
      const avatar = testimonialItem.querySelector("[data-testimonials-avatar]");  // Fixed: using testimonialItem
      const title = testimonialItem.querySelector("[data-testimonials-title]");    // Fixed: using testimonialItem
      const text = testimonialItem.querySelector("[data-testimonials-text]");      // Fixed: using testimonialItem

      modalImg.src = avatar?.src || "";
      modalImg.alt = avatar?.alt || "";
      modalTitle.innerHTML = title?.innerHTML || "";
      modalText.innerHTML = text?.innerHTML || "";

      modalContainer.classList.add("active");
      overlay.classList.add("active");
    }
  }

  const closeBtn = event.target.closest("[data-modal-close-btn]");
  const overlay = event.target.closest("[data-overlay]");
  
  if (closeBtn || overlay) {
    const modalContainer = document.querySelector("[data-modal-container]");
    const modalOverlay = document.querySelector("[data-overlay]");
    
    if (modalContainer && modalOverlay) {
      modalContainer.classList.remove("active");
      modalOverlay.classList.remove("active");
    }
  }

  // Handle skill keyword clicks
  const skillItem = event.target.closest("[data-skill-item]");
  if (skillItem) {
    const modalTitle = document.querySelector("[data-skill-modal-title]");
    const modalText = document.querySelector("[data-skill-modal-text]");
    const modalContainer = document.querySelector("[data-skill-modal-container]");
    const overlay = document.querySelector("[data-skill-overlay]");
    const closeBtn = document.querySelector("[data-skill-modal-close-btn]");

    if (modalTitle && modalText && modalContainer && overlay) {
      const skillName = skillItem.querySelector("[data-skill-name]");
      const skillText = skillItem.querySelector(".skill-text");

      modalTitle.innerHTML = skillName?.innerHTML || "";
      modalText.innerHTML = skillText?.innerHTML || "";
      
      modalContainer.classList.add("active");
      overlay.classList.add("active");

      // Close modal handlers
      const closeModal = () => {
        modalContainer.classList.remove("active");
        overlay.classList.remove("active");
      };

      closeBtn?.addEventListener("click", closeModal);
      overlay?.addEventListener("click", closeModal);
    }
  }

  const projectItem = event.target.closest("[data-project-item]");
  if (projectItem) {
    const avatar = projectItem.querySelector("[data-project-avatar]");
    const displayTitle = projectItem.querySelector("[data-modal-display-title]");
    const projectText = projectItem.querySelector("[data-project-text]");
    
    const modalBg = document.querySelector("[data-project-modal-bg]");
    const modalTitle = document.querySelector("[data-project-modal-title]");
    const modalTextContainer = document.querySelector("[data-project-modal-text]");
    const modalContainer = document.querySelector("[data-project-modal-container]");
    const overlay = document.querySelector("[data-project-overlay]");

    if (modalBg && modalTitle && modalTextContainer && modalContainer && overlay) {
      // Blurred background & big title
      modalBg.style.backgroundImage = `url(${avatar?.src || ""})`;
      modalTitle.innerHTML = displayTitle?.innerHTML || "";

      // Insert the text from the hidden `.project-text`
      modalTextContainer.innerHTML = projectText?.innerHTML || "";

      // Show modal
      modalContainer.classList.add("active");
      overlay.classList.add("active");
    }
  }

  // Handle project modal close
  const projectCloseBtn = event.target.closest("[data-project-modal-close-btn]");
  const projectOverlay = event.target.closest("[data-project-overlay]");
  if (projectCloseBtn || projectOverlay) {
    const modalContainer = document.querySelector("[data-project-modal-container]");
    const modalOverlay = document.querySelector("[data-project-overlay]");
    if (modalContainer && modalOverlay) {
      modalContainer.classList.remove("active");
      modalOverlay.classList.remove("active");
    }
  }

  // Handle navigation
  const navLink = event.target.closest("[data-nav-link]");
  if (navLink) {
    const targetPage = navLink.textContent.trim().toLowerCase();
    const pages = document.querySelectorAll("[data-page]");
    const navigationLinks = document.querySelectorAll("[data-nav-link]");

    let pageFound = false;

    pages.forEach((page, index) => {
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        navigationLinks[index].classList.add("active");
        window.scrollTo(0, 0);
        pageFound = true;
      } else {
        page.classList.remove("active");
        navigationLinks[index].classList.remove("active");
      }
    });

    if (!pageFound) {
      console.warn(`No page found with data-page="${targetPage}"`);
    }
  }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load all partials
  loadPartial('sidebar', './assets/html/sidebar.html');
  loadPartial('about', './assets/html/about.html');
  loadPartial('resume', './assets/html/resume.html');
  
  loadPartial('portfolio', './assets/html/portfolio.html')
    .then(() => {
      // After portfolio.html is loaded and #project-list is present
      initializeProjectFiles();
    });

    loadPartial('news', './assets/html/news.html')
    .then(() => {
      // Initialize news section specific elements
      initializeNewsFiles();
    });
  loadPartial('contact', './assets/html/contact.html');

  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-nav-link]')) {
        const circle = document.querySelector('.circle');
        if (e.target.textContent === 'Resume') {
            circle.classList.add('animate');
        } else {
            circle.classList.remove('animate');
        }
    }
});

  // Initialize any elements that exist in the initial HTML
  initializePageElements();

  // Initialize draggable functionality for service items once they're loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.classList.contains('service')) {
            const serviceList = node.querySelector('.service-list');
            if (serviceList && !serviceList.dataset.draggable) {
              makeDraggable(serviceList);
              serviceList.dataset.draggable = 'true';
              console.log('Draggable functionality initialized for .service-list');
            }
          }
        }
      });
    });
  });

  const newsPosts = document.querySelectorAll('.news-post-item');

  function initializeProjectFiles() {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;
  
    // 1. Fetch the JSON file containing the array of project paths
    fetch('./assets/html/project_files.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch projectFiles.json: ${response.statusText}`);
        }
        return response.json(); // Parse JSON
      })
      .then(filesArray => {
        // 2. Now 'filesArray' is an array of strings with each HTML partial path
        return Promise.all(
          filesArray.map(filePath => {
            return fetch(filePath)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
                }
                return response.text();
              })
              .then(html => {
                projectList.insertAdjacentHTML('beforeend', html);
              });
          })
        );
      })
      .then(() => {
        // 3. Possibly re-initialize your page elements if needed
        initializePageElements();
      })
      .catch(err => console.error("Error loading project files:", err));
  }

  function initializeNewsFiles() {
    const newsList = document.getElementById('newsList');
    if (!newsList) return;
  
    fetch('./assets/html/news/news_files.json')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch news_files.json: ${response.statusText}`);
        return response.json();
      })
      .then(filesArray => {
        return Promise.all(
          filesArray.map(filePath => 
            fetch(filePath)
              .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                return response.text();
              })
              .then(content => {
                newsList.insertAdjacentHTML('beforeend', content);
              })
          )
        ).then(() => {
          // Initialize modal after all news items are loaded
          initializeNewsModal();
          initializeNewsYearFilter();
        });
      })
      .catch(error => console.error('Error loading news:', error));
  }



  function initializeImageModal() {
    const imageModal = document.querySelector("[data-image-modal]");
    const modalImage = document.querySelector("[data-modal-image]");
    const modalClose = document.querySelector("[data-modal-close]");
  
    if (!imageModal || !modalImage || !modalClose) {
      console.error('Missing image modal elements');
      return;
    }
  
    const openImageModal = (src) => {
      modalImage.src = src;
      imageModal.classList.add("active");
    };
  
    const closeImageModal = () => {
      imageModal.classList.remove("active");
    };
  
    modalClose.addEventListener("click", closeImageModal);
    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) {
        closeImageModal();
      }
    });
  
    // Add click listeners to all project images
    document.querySelectorAll("[data-project-avatar]").forEach(img => {
      img.addEventListener("click", () => {
        openImageModal(img.src);
      });
    });
  }
  
  
  function initializeNewsModal() {
    const modalContainer = document.querySelector("[data-news-modal-container]");
    const modalCloseBtn = document.querySelector("[data-news-modal-close-btn]");
    const overlay = document.querySelector("[data-news-overlay]");
    const modalTitle = document.querySelector("[data-news-modal-title]");
    const modalText = document.querySelector("[data-news-modal-text]");
    const modalBg = document.querySelector("[data-news-modal-bg]");
  
    if (!modalContainer || !modalCloseBtn || !overlay || !modalTitle || !modalText || !modalBg) {
      console.error('Missing modal elements');
      return;
    }
  
    const toggleNewsModal = function() {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  
    // Add click listeners to all news items
    document.querySelectorAll("[data-news-item]").forEach(item => {
      item.addEventListener("click", function() {
        console.log('News item clicked'); // Debug
        const newsAvatar = this.querySelector("[data-news-avatar]");
        const newsTitle = this.querySelector("[data-news-title]");
        const newsText = this.querySelector("[data-news-text]");
  
        if (!newsAvatar || !newsTitle || !newsText) {
          console.error('Missing required elements in news item');
          return;
        }
  
        modalTitle.innerHTML = newsTitle.textContent;
        modalText.innerHTML = newsText.innerHTML;
        modalBg.style.backgroundImage = `url(${newsAvatar.src})`;
        
        toggleNewsModal();
      });
    });
  
    modalCloseBtn.addEventListener("click", toggleNewsModal);
    overlay.addEventListener("click", toggleNewsModal);
  }

  


  observer.observe(document.querySelector('.main-content'), { childList: true, subtree: true });
});