/* File: script.js */
(() => {
  let currentLang = 'en';
  const container = document.getElementById('hospital-cards');
  const filters = document.querySelectorAll('.filter-nav button');
  const enBtn = document.getElementById('en-btn');
  const koBtn = document.getElementById('ko-btn');

  // Translations for header/filter labels/footer
  const translations = {
    en: {
      title: 'Busan Hospital Discovery',
      subtitle: 'Find the best hospitals and clinics across Busan.',
      'filter.All': 'All',
      'filter.General': 'General',
      'filter.Dental': 'Dental',
      'filter.Orthopedic': 'Orthopedic',
      'filter.Emergency': 'Emergency',
      footer: 'Emergency Hotline: 119 | Disclaimer: Information subject to change.',
      websiteLabel: 'Website',
    },
    ko: {
      title: '부산 병원 찾아보기',
      subtitle: '부산의 우수 병원과 의원을 찾아보세요.',
      'filter.All': '전체',
      'filter.General': '종합',
      'filter.Dental': '치과',
      'filter.Orthopedic': '정형',
      'filter.Emergency': '응급',
      footer: '응급 연락처: 119 | 정보는 변경될 수 있습니다.',
      websiteLabel: '웹사이트',
    },
  };

  // Generate a stable key for localStorage from each hospital’s English name
  function getHospitalKey(h) {
    const nameEn = typeof h.name === 'object' ? h.name.en : h.name;
    return `rating_${nameEn.replace(/\s+/g, '_')}`;
  }

  // Render a list of hospitals as cards, including the interactive star‐rating
  function renderCards(list) {
    container.innerHTML = '';

    list.forEach((h) => {
      // 1) Check if there’s already a saved rating in localStorage
      const key = getHospitalKey(h);
      const saved = localStorage.getItem(key);
      const ratingValue = saved !== null ? parseInt(saved, 10) : h.rating;

      // 2) Get the correct text for name/area/address based on currentLang
      const name = typeof h.name === 'object' ? h.name[currentLang] : h.name;
      const typesLabel = h.types
        .map((t) => translations[currentLang][`filter.${t}`] || t)
        .join(', ');
      const area = typeof h.area === 'object' ? h.area[currentLang] : h.area;
      const address =
        typeof h.address === 'object' ? h.address[currentLang] : h.address;
      const phone = h.phone;
      const website = h.website;
      const image = h.image;

      // 3) Build the card’s HTML scaffold, including an empty <div class="rating-input">
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${image}" alt="${name}" />
        <div class="card-content">
          <div class="card-summary">
            <h3>${name}</h3>
            <div class="rating-input" data-hospital-key="${key}"></div>
            <p class="info">${typesLabel} | ${area}</p>
          </div>
          <div class="more-info">
            <p class="info">${address}</p>
            <a href="tel:${phone}">${phone}</a>
            ${
              website
                ? `<a href="${website}" target="_blank">${translations[currentLang].websiteLabel}</a>`
                : ''
            }
          </div>
        </div>
      `;

      // 4) Populate that <div class="rating-input"> with five <i> stars
      const ratingDiv = card.querySelector('.rating-input');
      if (ratingDiv) {
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('i');
          // If i ≤ ratingValue, use a filled star; otherwise an outline
          if (i <= ratingValue) {
            star.className = 'fas fa-star filled-star';
          } else {
            star.className = 'far fa-star';
          }
          star.dataset.value = String(i);
          ratingDiv.appendChild(star);
        }

        // 5) Wire up mouseover/mouseout/click on each injected <i> tag
        ratingDiv.querySelectorAll('i').forEach((starIcon) => {
          const val = parseInt(starIcon.dataset.value, 10);

          // On mouseover: highlight stars 1…val
          starIcon.addEventListener('mouseover', () => {
            ratingDiv.querySelectorAll('i').forEach((s) => {
              const v = parseInt(s.dataset.value, 10);
              if (v <= val) {
                s.className = 'fas fa-star filled-star';
              } else {
                s.className = 'far fa-star';
              }
            });
          });

          // On mouseout: revert to the ratingValue saved in localStorage
          starIcon.addEventListener('mouseout', () => {
            const currentSaved = localStorage.getItem(key);
            const curVal = currentSaved !== null ? parseInt(currentSaved, 10) : 0;
            ratingDiv.querySelectorAll('i').forEach((s) => {
              const v = parseInt(s.dataset.value, 10);
              if (v <= curVal) {
                s.className = 'fas fa-star filled-star';
              } else {
                s.className = 'far fa-star';
              }
            });
          });

          // On click: store the new rating in localStorage & lock those stars in
          starIcon.addEventListener('click', () => {
            localStorage.setItem(key, String(val));
            ratingDiv.querySelectorAll('i').forEach((s) => {
              const v = parseInt(s.dataset.value, 10);
              if (v <= val) {
                s.className = 'fas fa-star filled-star';
              } else {
                s.className = 'far fa-star';
              }
            });
          });
        });
      }

      // 6) Existing expand/collapse logic for “more-info”
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.card.expanded').forEach((c) => {
          if (c !== card) c.classList.remove('expanded');
        });
        card.classList.toggle('expanded');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('expanded');
      });

      container.appendChild(card);
    });
  }

  // Filter‐button logic (unchanged)
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filterKey = btn.dataset.filter;
      const filtered =
        filterKey === 'All'
          ? hospitals
          : hospitals.filter((h) => h.types.includes(filterKey));
      renderCards(filtered);
    });
  });

  // Language toggle (unchanged)
  enBtn.addEventListener('click', () => changeLanguage('en'));
  koBtn.addEventListener('click', () => changeLanguage('ko'));

  function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-switch button').forEach((b) =>
      b.classList.remove('active')
    );
    (lang === 'en' ? enBtn : koBtn).classList.add('active');

    // Update all [data-i18n] text nodes
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[lang][key];
    });

    // Re‐render cards under the same filter
    const activeFilter = document.querySelector('.filter-nav .active').dataset.filter;
    const filtered =
      activeFilter === 'All'
        ? hospitals
        : hospitals.filter((h) => h.types.includes(activeFilter));
    renderCards(filtered);
  }

  // Collapse any expanded card if the user clicks outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.card.expanded').forEach((c) =>
      c.classList.remove('expanded')
    );
  });

  // Initial render: “en” + “All”
  renderCards(hospitals);
})();