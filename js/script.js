// =====================
// DOM ELEMENT SELECTORS
// =====================
const themeToggle = document.getElementById('themeToggle');
const accentColorBtn = document.getElementById('accentColorBtn');
const accentColors = document.querySelector('.accent-colors');
const colorOptions = document.querySelectorAll('.accent-color');
const filterButtons = document.querySelectorAll('#projectsFilter .pivot-item');
const projects = document.querySelectorAll('#projectsContainer .col-4');
const navItems = document.querySelectorAll('.command-item');
const sections = document.querySelectorAll('section');

// =================
// THEME MANAGEMENT
// =================
function initializeTheme() {
  // Set initial theme based on preference or default to dark
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!localStorage.getItem('theme') && prefersDark) {
    document.body.classList.add('dark-theme');
  } else if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
  }
  updateThemeVariables();
}

function toggleTheme() {
  const isLightTheme = document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  updateThemeVariables();
  updateThemeIcon();
  forceRedraw();
}

function updateThemeVariables() {
  const isLightTheme = document.body.classList.contains('light-theme');
  const suffix = isLightTheme ? 'light' : 'dark';

  // Update all CSS variables
  const cssVars = {
    '--color-primary': `var(--color-primary-${suffix})`,
    '--color-primary-darken': `var(--color-primary-dark-${suffix})`,
    '--color-secondary': `var(--color-secondary-${suffix})`,
    '--color-tertiary': `var(--color-tertiary-${suffix})`,
    '--color-text-primary': `var(--color-text-primary-${suffix})`,
    '--color-text-secondary': `var(--color-text-secondary-${suffix})`,
    '--color-border': `var(--color-border-${suffix})`,
    '--color-bg': `var(--color-bg-${suffix})`,
    '--color-bg-acrylic': `var(--color-bg-acrylic-${suffix})`,
    '--color-bg-card': `var(--color-bg-card-${suffix})`,
    '--color-bg-header': `var(--color-bg-header-${suffix})`,
    '--color-bg-static': `var(--color-bg-static-${suffix})`,
    '--color-bg-dynamic': `var(--color-bg-dynamic-${suffix})`,
    '--color-shadow': `var(--color-shadow-${suffix})`,
    '--acrylic-bg': `var(--acrylic-bg-${suffix})`
  };

  Object.entries(cssVars).forEach(([varName, value]) => {
    document.documentElement.style.setProperty(varName, value);
  });

  // Update accent button
  accentColorBtn.style.backgroundColor = `var(--color-primary-${suffix})`;
}

function updateThemeIcon() {
  const icon = themeToggle.querySelector('i');
  const isLightTheme = document.body.classList.contains('light-theme');
  icon.classList.toggle('fa-moon', !isLightTheme);
  icon.classList.toggle('fa-sun', isLightTheme);
}

// =====================
// ACCENT COLOR MANAGEMENT
// =====================
function initializeAccentColor() {
  const savedColor = localStorage.getItem('accentColor') ||
    (document.body.classList.contains('light-theme') ? '#0078D4' : '#2899F5');

  updateAccentColor(savedColor);

  // Mark active color in picker
  colorOptions.forEach(color => {
    if (color.getAttribute('data-color') === savedColor) {
      color.classList.add('active');
    }
  });
}

function updateAccentColor(newColor) {
  const r = parseInt(newColor.substring(1, 3), 16);
  const g = parseInt(newColor.substring(3, 5), 16);
  const b = parseInt(newColor.substring(5, 7), 16);
  const rgb = `${r}, ${g}, ${b}`;

  // Update CSS variables
  const cssVars = {
    '--color-primary-rgb': rgb,
    '--color-primary-light': newColor,
    '--color-primary-dark': newColor,
    '--color-bg-dynamic-light': `rgba(${rgb}, 0.08)`,
    '--color-bg-dynamic-dark': `rgba(${rgb}, 0.12)`,
    '--acrylic-bg-light': `linear-gradient(to right bottom, rgba(${rgb}, 0.05), rgba(${rgb}, 0.01))`,
    '--acrylic-bg-dark': `linear-gradient(to right bottom, rgba(${rgb}, 0.1), transparent 70%)`,
    '--neon-shadow': `0 0 8px rgba(${rgb}, 0.7)`
  };

  // Calculate and set darker variant
  const darkerColor = shadeColor(newColor, -20);
  cssVars['--color-primary-dark-light'] = darkerColor;
  cssVars['--color-primary-dark-dark'] = darkerColor;

  Object.entries(cssVars).forEach(([varName, value]) => {
    document.documentElement.style.setProperty(varName, value);
  });

  // Update current theme's primary color
  const isLightTheme = document.body.classList.contains('light-theme');
  document.documentElement.style.setProperty('--color-primary', newColor);
  document.documentElement.style.setProperty('--color-primary-darken', darkerColor);
  document.documentElement.style.setProperty(
    '--color-bg-dynamic',
    `rgba(${rgb}, ${isLightTheme ? 0.08 : 0.12})`
  );

  // Update UI
  accentColorBtn.style.backgroundColor = newColor;
  localStorage.setItem('accentColor', newColor);
}

function renderAboutSection() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection || !appData.about) return;

  const aboutHeader = `
    <div class="about-header">
      <h2 class="section-title">${appData.about.title} <span class="gradient-text">Tarvix</span></h2>
      <p class="section-subtitle">${appData.about.subtitle}</p>
    </div>
  `;

  const renderCards = appData.about.cards.map(card => {
    const itemsHTML = card.items ? `
      <ul class="styled-list">
        ${card.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    ` : '';

    const tagsHTML = card.tags ? `
      <div class="tech-tags" style="margin-top: var(--spacing-l);">
        ${card.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    ` : '';

    return `
      <div class="about-card">
        <div class="card-icon">
          <i class="fas ${card.icon}" style="--fa-animation-duration: 2s;"></i>
        </div>
        <h3>${card.title}</h3>
        ${card.content ? `<p>${card.content}</p>` : ''}
        ${itemsHTML}
        ${tagsHTML}
      </div>
    `;
  }).join('');

  aboutSection.innerHTML = `
    <div class="grid">
      <div class="col-12">
        ${aboutHeader}
        <div class="about-grid">
          ${renderCards}
        </div>
      </div>
    </div>
  `;
}


// =====================
// PROJECTS FILTER
// =====================
function setupProjectsFilter() {
  const projectsContainer = document.getElementById('projectsContainer');
  const projectsFilter = document.getElementById('projectsFilter');
  const filterToggle = document.getElementById('filterToggle');
  const filterLabel = document.getElementById('filterLabel');

  if (!projectsContainer || !projectsFilter || !appData.projects) return;

  // Get distinct project categories for filtering
  const categories = new Set();
  appData.projects.forEach(project => {
    project.categories.forEach(category => categories.add(category));
  });

  // Remove current options and generate fresh set
  projectsFilter.innerHTML = '';

  // Create 'All Projects' option
  const allOption = document.createElement('li');
  const allFilter = document.createElement('a');
  allFilter.className = 'filter-option active';
  allFilter.setAttribute('data-filter', 'all');
  allFilter.textContent = 'All Projects';
  allOption.appendChild(allFilter);
  projectsFilter.appendChild(allOption);

  // Create options for each category
  categories.forEach(category => {
    const option = document.createElement('li');
    const filter = document.createElement('a');
    filter.className = 'filter-option';
    filter.setAttribute('data-filter', category);
    filter.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    option.appendChild(filter);
    projectsFilter.appendChild(option);
  });

  // Toggle dropdown
  filterToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    projectsFilter.classList.toggle('show');
    filterToggle.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
    projectsFilter.classList.remove('show');
    filterToggle.classList.remove('active');
  });

  // Project filtering function
  function filterProjects(filterValue) {
    const projects = projectsContainer.querySelectorAll('.col-4');

    projects.forEach(project => {
      const shouldShow = filterValue === 'all' ||
        project.getAttribute('data-tags').includes(filterValue);

      project.style.display = shouldShow ? 'block' : 'none';
    });

    // Update active option and label
    projectsFilter.querySelectorAll('.filter-option').forEach(option => {
      option.classList.remove('active');
    });
    
    const activeOption = projectsFilter.querySelector(`.filter-option[data-filter="${filterValue}"]`);
    if (activeOption) {
      activeOption.classList.add('active');
      filterLabel.textContent = activeOption.textContent;
    }
  }

  // Add click event to filter options
  projectsFilter.addEventListener('click', function(e) {
    const filterOption = e.target.closest('.filter-option');
    if (!filterOption) return;

    e.preventDefault();
    const filterValue = filterOption.getAttribute('data-filter');
    filterProjects(filterValue);
    
    // Close dropdown
    projectsFilter.classList.remove('show');
    filterToggle.classList.remove('active');
  });

  // Initialize with "all" filter

  filterProjects('all');
}

// =====================
// FORM VALIDATION
// =====================
function setupFormValidation() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate form
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      let isValid = true;

      // Reset errors
      document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
      });

      // Validate name
      if (!name.value.trim()) {
        name.classList.add('error');
        isValid = false;
      }

      // Validate email
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        isValid = false;
      }

      // Validate message
      if (!message.value.trim()) {
        message.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Form is valid, submit it
        alert('Message sent successfully!');
        contactForm.reset();
      } else {
        // Show error message
        alert('Please fill all required fields correctly.');
      }
    });
  }
}

// =====================
// SMOOTH SCROLLING
// =====================
function setupSmoothScrolling() {
  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      // Update active nav item
      navItems.forEach(navItem => navItem.classList.remove('active', 'instant-active'));
      this.classList.add('active', 'instant-active');

      // Smooth scroll to section
      window.scrollTo({
        top: targetSection.offsetTop - 60,
        behavior: 'smooth'
      });

      // Final position check
      setTimeout(() => {
        this.classList.remove('instant-active');
        handleScroll();
      }, 1000);
    });
  });
}

// =====================
// SCROLL HANDLING
// =====================
function handleScroll() {
  const scrollPos = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const isAtPageBottom = scrollPos + windowHeight >= documentHeight - 50;

  // Reset all active states
  navItems.forEach(item => item.classList.remove('active'));

  // Check each section
  sections.forEach(section => {
    const sectionId = section.getAttribute('id');
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;
    const navItem = document.querySelector(`.command-item[href="#${sectionId}"]`);

    if ((scrollPos >= sectionTop && scrollPos < sectionBottom) ||
      (sectionId === 'contact' && isAtPageBottom)) {
      navItem?.classList.add('active');
    }
  });
}

// =====================
// UTILITY FUNCTIONS
// =====================
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);

  R = Math.min(255, R);
  G = Math.min(255, G);
  B = Math.min(255, B);

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
}

function forceRedraw() {
  document.body.style.animation = 'none';
  requestAnimationFrame(() => {
    document.body.style.animation = '';
  });
}

// =====================
// EVENT LISTENERS
// =====================
function setupEventListeners() {
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Accent color picker
  accentColorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    accentColors.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    accentColors.classList.remove('show');
  });

  colorOptions.forEach(color => {
    color.addEventListener('click', function () {
      updateAccentColor(this.getAttribute('data-color'));
      colorOptions.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Window events
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', () => setTimeout(handleScroll, 200));
}


function renderTeamMembers() {
  const teamContainer = document.getElementById('teamContainer');
  if (!teamContainer || !appData.team) return;

  teamContainer.innerHTML = '';

  appData.team.forEach(member => {
    const memberCard = document.createElement('div');
    memberCard.className = 'team-card';

    // Display condensed bio with intact formatting
    const formatBioPreview = (bio) => {
      if (!bio) return '';

      // Convert lines to HTML tags while preserving structure
      const lines = bio.split('\n');
      let preview = '';
      let lineCount = 0;

      for (let i = 0; i < lines.length && lineCount < 3; i++) {
        if (lines[i].trim() !== '') {
          preview += lines[i] + '<br>';
          lineCount++;
        }
      }

      return preview;
    };

    const bioPreview = formatBioPreview(member.bio);

    const specialtyItems = member.specialty ?
      member.specialty.split('•').map(item => item.trim()).filter(item => item) : [];

    const specialtyHTML = specialtyItems.map(item =>
      `<span>${item}</span>`
    ).join('');

    memberCard.innerHTML = `
      <div class="team-avatar">
        <img src="${member.avatar || 'assets/default-avatar.jpg'}" alt="${member.name}" loading="lazy">
      </div>
      <h3 class="team-name">${member.name}</h3>
      <p class="team-role">${member.role}</p>
      ${specialtyItems.length ? `
        <div class="team-specialty">
          ${specialtyHTML}
        </div>
      ` : ''}
      <div class="team-bio-preview">
        ${bioPreview}
      </div>
      <div class="team-view-btn">
        <button class="btn btn-primary" onclick="openTeamModal(${JSON.stringify(member).replace(/"/g, '&quot;')})">
          <i class="fas fa-arrow-right"></i> View Details
        </button>
      </div>
    `;

    teamContainer.appendChild(memberCard);
  });
}

// Modal function (in English as requested)
function openTeamModal(member) {
  const modal = document.getElementById('teamModal');
  const modalContent = document.getElementById('modalContent');
  const body = document.body;

  // Disable page scroll when modal is open
  body.style.overflow = 'hidden';

  // Format bio with proper line breaks and styling
  const formatBio = (bio) => {
    if (!bio) return '';

    return bio
      .replace(/\n\n/g, '</p><p class="bio-paragraph">') // Double newline becomes new paragraph
      .replace(/\n/g, '<br>') // Single newline becomes line break
      .replace(/✅/g, '<span class="bio-check">✅</span>')
      .replace(/🔹/g, '<span class="bio-bullet">🔹</span>');
  };

  // Generate skills HTML
  const skillsHTML = member.skills ? member.skills.map(skill => `
    <div class="skill-item">
      <span class="skill-name">${skill.name}</span>
      <div class="skill-bar">
        <div class="skill-level" style="width: ${skill.level}%"></div>
      </div>
      <span class="skill-percent">${skill.level}%</span>
    </div>
  `).join('') : '';

  // Generate experience HTML
  const experienceHTML = member.experience ? member.experience.map(exp => `
    <li><i class="fas fa-check-circle"></i> ${exp}</li>
  `).join('') : '';

  // Generate links HTML
  const linksHTML = member.links ? member.links.map(link => `
    <a href="${link.url}" class="team-social-link" target="_blank" rel="noopener noreferrer">
      <i class="${link.icon}"></i>
    </a>
  `).join('') : '';

  // Set modal content
  modalContent.innerHTML = `
    <div class="team-member-header">
      <div class="member-avatar">
        <img src="${member.avatar || 'assets/default-avatar.jpg'}" alt="${member.name}" loading="lazy">
      </div>
      <div class="member-basic-info">
        <h3>${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-specialty">${member.specialty || ''}</p>
      </div>
    </div>
    
    <div class="team-member-body">
      <div class="member-bio">
        <h4>Biography</h4>
        <div class="bio-content">
          <p class="bio-paragraph">${formatBio(member.bio)}</p>
        </div>
      </div>
      
      ${experienceHTML ? `
      <div class="member-experience">
        <h4>Key Experience</h4>
        <ul>${experienceHTML}</ul>
      </div>` : ''}
      
      ${skillsHTML ? `
      <div class="member-skills">
        <h4>Technical Skills</h4>
        ${skillsHTML}
      </div>` : ''}
      
      ${member.contribution ? `
      <div class="member-contribution">
        <h4>Contribution to Tarvix</h4>
        <p>${member.contribution}</p>
      </div>` : ''}
      
      ${member.education ? `
      <div class="member-education">
        <h4>Education</h4>
        <p><i class="fas fa-graduation-cap"></i> ${member.education}</p>
      </div>` : ''}
    </div>
    
    ${linksHTML ? `
    <div class="team-member-footer">
      <div class="member-social-links">
        ${linksHTML}
      </div>
    </div>` : ''}
  `;

  // Show modal
  modal.style.display = 'block';

  // Close modal function
  const closeModal = () => {
    modal.style.display = 'none';
    body.style.overflow = 'auto';
  };

  // Close when X is clicked
  document.querySelector('.close-modal').addEventListener('click', closeModal);

  // Close when clicking outside modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}
function renderContactSection() {
  if (!appData.contact || !appData.footer?.contactInfo) return;

  // Set contact header
  const contactTitle = document.getElementById('contactTitle');
  const contactSubtitle = document.getElementById('contactSubtitle');

  if (contactTitle && appData.contact.title) {
    contactTitle.textContent = appData.contact.title;
  }

  if (contactSubtitle && appData.contact.subtitle) {
    contactSubtitle.textContent = appData.contact.subtitle;
  }

  // Set contact info
  const contactInfoContent = document.getElementById('contactInfoContent');
  if (!contactInfoContent) return;

  const contactInfoHTML = appData.footer.contactInfo.map(info => `
    <div class="contact-info-item">
      <i class="${info.icon}"></i>
      <span>${info.text}</span>
    </div>
  `).join('');

  contactInfoContent.innerHTML = contactInfoHTML;
}

// =====================
// DATA MANAGEMENT
// =====================
let appData = {};

async function loadAppData() {
  try {
    const response = await fetch('assets/data/data.json');
    appData = await response.json();

    // Initialize all components with the loaded data
    renderAboutSection();
    renderTeamMembers();
    renderProjects();
    renderFooter();
    renderTechStack();
    renderContactSection();
    // Setup projects filter after projects are rendered
    setupProjectsFilter();
  } catch (error) {
    console.error('Error loading application data:', error);
  }
}

function renderProjects() {
  const projectsContainer = document.getElementById('projectsContainer');
  if (!projectsContainer || !appData.projects) return;

  projectsContainer.innerHTML = '';

  // Create projects grid container
  const projectsGrid = document.createElement('div');
  projectsGrid.className = 'projects-grid';
  projectsContainer.appendChild(projectsGrid);

  // Add all projects to the grid
  appData.projects.forEach(project => {
    const projectElement = document.createElement('div');
    projectElement.className = 'col-4';
    projectElement.setAttribute('data-tags', project.categories.join(' '));

    const tagsHTML = project.categories ? `
      <div class="project-tags">
        ${project.categories.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    ` : '';

    projectElement.innerHTML = `
      <div class="card project-card">
        <div class="card-header">
          <i class="${project.icon}"></i>
          ${project.title}
        </div>
        <div class="card-body">
          <p class="project-description">${project.description}</p>
          ${tagsHTML}
          <div style="margin-top: auto;">
            <button class="btn btn-primary card-btn" onclick="openProjectModal(${JSON.stringify(project).replace(/"/g, '&quot;')})">
              <i class="fas fa-info-circle"></i>
              View Details
            </button>
          </div>
        </div>
      </div>
    `;

    projectsGrid.appendChild(projectElement);
  });

  // Add show more/less button
  const showMoreBtn = document.createElement('button');
  showMoreBtn.className = 'btn btn-outline show-more-btn';
  showMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Show More Projects';
  projectsContainer.appendChild(showMoreBtn);

  // Toggle functionality
  showMoreBtn.addEventListener('click', function() {
    const isExpanded = projectsGrid.classList.toggle('expanded');
    this.innerHTML = isExpanded 
      ? '<i class="fas fa-chevron-up"></i> Show Less Projects' 
      : '<i class="fas fa-chevron-down"></i> Show More Projects';
    
    // Update the gradient visibility
    updateProjectsGradient();
  });

  // Function to update gradient based on theme
  function updateProjectsGradient() {
    const isExpanded = projectsGrid.classList.contains('expanded');
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg');
    const rgbValues = bgColor.match(/\d+/g);
    
    if (rgbValues && !isExpanded) {
      const gradient = `linear-gradient(to bottom, rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0) 0%, rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.9) 100%)`;
      projectsGrid.style.setProperty('--projects-gradient', gradient);
    }
  }

  // Initialize gradient
  updateProjectsGradient();

  // Update gradient when theme changes
  document.addEventListener('themeChanged', updateProjectsGradient);

  // Initially hide projects after 1 second
  setTimeout(() => {
    projectsGrid.classList.remove('expanded');
    updateProjectsGradient();
  }, 1000);
}


function openProjectModal(project) {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('projectModalContent');
  const body = document.body;

  // Disable page scroll when modal is open
  body.style.overflow = 'hidden';

  // Generate achievements HTML
  const achievementsHTML = project.achievements ? project.achievements.map(ach => `
    <li><i class="fas fa-check-circle" style="color: var(--color-primary);"></i> ${ach}</li>
  `).join('') : '';

  // Generate technologies HTML with icons
  const technologiesHTML = project.keyTechnologies ? project.keyTechnologies.map(tech => `
    <div class="tech-pill">
      <i class="${getTechIcon(tech.name)}" style="color: var(--color-primary);"></i>
      <span>${tech.name} : </span>
      ${tech.value ? `<span class="tech-value">${tech.value}</span>` : ''}
    </div>
  `).join('') : '';

  // Generate stats HTML
  const statsHTML = project.stats ? `
    <div class="project-section">
      <h4>Key Metrics</h4>
      <div class="modern-stats-grid">
        ${project.stats.map(stat => `
          <div class="modern-stat-card">
            <div class="modern-stat-value">${stat.value}</div>
            <div class="modern-stat-label">${stat.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Generate team HTML
  const teamHTML = project.teamMembers ? `
    <div class="project-team" style="display: flex; flex-direction: column; gap: var(--spacing-l);">
      ${project.teamMembers.map(member => `
        <div class="team-member">
          <div class="member-avatar">
            <img src="${member.avatar || 'assets/default-avatar.jpg'}" alt="${member.name}">
          </div>
          <div class="member-info">
            <span class="member-role">- ${member.role}:</span>
            <span class="member-name">${member.name}</span>
          </div>
        </div>
      `).join('')}
    </div>
  ` : '';

  // Generate links HTML
  const linksHTML = project.links ? `
    <div class="project-section">
      <h4>Project Links</h4>
      <div class="project-links">
        ${project.links.map(link => `
          <a href="${link.url}" class="btn ${link.icon.includes('github') ? 'btn-outline' : 'btn-primary'}" target="_blank" rel="noopener noreferrer">
            <i class="${link.icon}"></i>
            ${link.title}
          </a>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Set modal content
  modalContent.innerHTML = `
    <div class="project-header">
      <h2>${project.title}</h2>
      <p class="project-type">${project.projectType || 'Custom project'}</p>
    </div>
    
    <div class="project-section">
      <h4>Project Overview</h4>
      <p>${project.description}</p>
    </div>
    
    <div class="project-section">
      <h4>Project Goals</h4>
      <p>${project.goals || 'To deliver a high-quality solution meeting client requirements'}</p>
    </div>
    
    ${achievementsHTML ? `
    <div class="project-section">
      <h4>Key Achievements</h4>
      <ul class="styled-list">${achievementsHTML}</ul>
    </div>` : ''}
    
    ${statsHTML ? `
    <div class="project-section">
      <h4>Project Metrics</h4>
      ${statsHTML}
    </div>` : ''}
    
    ${technologiesHTML ? `
    <div class="project-section">
      <h4>Key Technologies</h4>
      <div class="project-technologies">
        ${technologiesHTML}
      </div>
    </div>` : ''}
    
    ${teamHTML ? `
    <div class="project-section">
      <h4>Some of the key contributors to this project:</h4>
      ${teamHTML}
    </div>` : ''}
    
    ${linksHTML}

  `;

  // Show modal
  modal.style.display = 'block';

  // Close modal function
  const closeModal = () => {
    modal.style.display = 'none';
    body.style.overflow = 'auto';
  };

  // Close when X is clicked
  modal.querySelector('.close-modal').addEventListener('click', closeModal);

  // Close when clicking outside modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Helper function to get appropriate icons for technologies
function getTechIcon(techName) {
  const icons = {
    'Flutter': 'fab fa-flutter',
    'Dart': 'fab fa-dart',
    'WebSockets': 'fas fa-plug',
    'Data Visualization': 'fas fa-chart-line',
    'Ethereum': 'fab fa-ethereum',
    'Solidity': 'fas fa-code',
    'Node.js': 'fab fa-node-js',
    'React': 'fab fa-react',
    // Add more mappings as needed
  };

  return icons[techName] || 'fas fa-check-circle';
}

function renderFooter() {
  if (!appData.footer) return;

  // Render social links
  const socialContainer = document.getElementById('footerSocial');
  if (socialContainer) {
    socialContainer.innerHTML = appData.footer.socialLinks.map(link => `
      <a href="${link.url}" class="social-link" aria-label="${link.label}">
        <i class="${link.icon}"></i>
      </a>
    `).join('');
  }

  // Render link groups
  const linksContainer = document.getElementById('footerLinks');
  if (linksContainer) {
    linksContainer.innerHTML = `
      <div class="footer-links-group">
        <h4 class="footer-links-title">Quick Links</h4>
        <ul class="footer-links">
          ${appData.footer.quickLinks.map(link => `
            <li><a href="${link.url}">${link.text}</a></li>
          `).join('')}
        </ul>
      </div>
      
      <div class="footer-links-group">
        <h4 class="footer-links-title">Contact</h4>
        <ul class="footer-links">
          ${appData.footer.contactInfo.map(info => `
            <li>
              <a href="${info.url || '#'}">
                <i class="${info.icon}"></i> ${info.text}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Render legal links
  const legalContainer = document.getElementById('footerLegal');
  if (legalContainer) {
    legalContainer.innerHTML = appData.footer.legalLinks.map(link => `
      <a href="${link.url}" class="legal-link">${link.text}</a>
    `).join('');
  }

  // Render copyright
  const copyrightContainer = document.getElementById('footerCopyright');
  if (copyrightContainer) {
    copyrightContainer.textContent = appData.footer.copyright;
  }
}

function renderTechStack() {
  const techStackSection = document.getElementById('tech');
  if (!techStackSection || !appData.techStack) return;

  // Clear existing content
  techStackSection.innerHTML = '';

  // Create container
  const container = document.createElement('div');
  container.className = 'grid';
  techStackSection.appendChild(container);

  // Create header
  const header = document.createElement('div');
  header.className = 'col-12';
  header.innerHTML = `
    <h2 class="section-title">Our Technology Stack</h2>
    <p class="section-subtitle">Integrated tools for end-to-end development</p>
  `;
  container.appendChild(header);

  // Create tech stack container
  const techContainer = document.createElement('div');
  techContainer.className = 'tech-stack-container';
  container.appendChild(techContainer);

  // Define categories in order we want them displayed
  const categories = [
    { id: 'frontend', title: 'Frontend', icon: 'fas fa-laptop-code' },
    { id: 'backend', title: 'Backend', icon: 'fas fa-server' },
    { id: 'design', title: 'Design', icon: 'fas fa-paint-brush' },
    { id: 'infrastructure', title: 'DevOps & Infrastructure', icon: 'fas fa-cloud' },
  ];

  // Render each category
  categories.forEach((category, index) => {
    if (appData.techStack && appData.techStack[category.id]) {
      // Category wrapper
      const categoryWrapper = document.createElement('div');
      categoryWrapper.className = 'tech-category-wrapper';
      
      // Category header
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'tech-category-header';
      categoryHeader.innerHTML = `
        <div class="category-title-container">
          <i class="${category.icon}"></i>
          <h3>${category.title}</h3>
        </div>
      `;
      categoryWrapper.appendChild(categoryHeader);

      // Items container
      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'tech-items-container';
      
      // Add tech items
      appData.techStack[category.id].forEach(tech => {
        const techItem = document.createElement('div');
        techItem.className = 'tech-card';
        techItem.innerHTML = `
          <div class="tech-card-icon">
            <i class="${tech.icon}"></i>
          </div>
          <div class="tech-card-name">${tech.name}</div>
        `;
        itemsContainer.appendChild(techItem);
      });

      categoryWrapper.appendChild(itemsContainer);
      techContainer.appendChild(categoryWrapper);

      // Add styled divider between categories (except after last one)
      if (index < categories.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'category-divider';
        divider.innerHTML = `
          <div class="divider-line"></div>
          <div class="divider-icon">
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="divider-line"></div>
        `;
        techContainer.appendChild(divider);
      }
    }
  });
}

// =====================
// INITIALIZATION
// =====================
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeAccentColor();
  setupProjectsFilter();
  setupFormValidation();
  setupSmoothScrolling();
  setupEventListeners();
  handleScroll();
  loadAppData();
});
