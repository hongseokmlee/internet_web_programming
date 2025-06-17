/* File: script.js */
(() => {
  let currentLang = 'en';
  const container = document.getElementById('hospital-cards');
  const filters = document.querySelectorAll('.filter-nav button');
  const enBtn = document.getElementById('en-btn');
  const koBtn = document.getElementById('ko-btn');

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

  function getHospitalKey(h) {
    const nameEn = typeof h.name === 'object' ? h.name.en : h.name;
    return `rating_${nameEn.replace(/\s+/g, '_')}`;
  }

  function renderCards(list) {
    container.innerHTML = '';

    list.forEach((h) => {
      const key = getHospitalKey(h);
      const saved = localStorage.getItem(key);
      const ratingValue = saved !== null ? parseInt(saved, 10) : h.rating;

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

      const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

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
            <a href="https://www.google.com/maps/search/?q=${encodeURIComponent(address)}" target="_blank" class="info">
              ${address}
            </a>
            <a href="tel:${phone}">${phone}</a>
            ${
              website
                ? `<a href="${website}" target="_blank">${translations[currentLang].websiteLabel}</a>`
                : ''
            }
            <div class="map-embed">
              <iframe
                src="${mapEmbedUrl}"
                width="100%"
                height="200"
                style="border:0; margin-top: 0.5rem;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      `;

      const ratingDiv = card.querySelector('.rating-input');
      if (ratingDiv) {
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('i');
          star.className = i <= ratingValue ? 'fas fa-star filled-star' : 'far fa-star';
          star.dataset.value = String(i);
          ratingDiv.appendChild(star);
        }

        ratingDiv.querySelectorAll('i').forEach((starIcon) => {
          const val = parseInt(starIcon.dataset.value, 10);

          starIcon.addEventListener('mouseover', () => {
            ratingDiv.querySelectorAll('i').forEach((s) => {
              const v = parseInt(s.dataset.value, 10);
              s.className = v <= val ? 'fas fa-star filled-star' : 'far fa-star';
            });
          });

          starIcon.addEventListener('mouseout', () => {
            const currentSaved = localStorage.getItem(key);
            const curVal = currentSaved !== null ? parseInt(currentSaved, 10) : 0;
            ratingDiv.querySelectorAll('i').forEach((s) => {
              const v = parseInt(s.dataset.value, 10);
              s.className = v <= curVal ? 'fas fa-star filled-star' : 'far fa-star';
            });
          });

          starIcon.addEventListener('click', () => {
            localStorage.setItem(key, String(val));
            ratingDiv.querySelectorAll('i').forEach((s) => {
              const v = parseInt(s.dataset.value, 10);
              s.className = v <= val ? 'fas fa-star filled-star' : 'far fa-star';
            });
          });
        });
      }

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

  enBtn.addEventListener('click', () => changeLanguage('en'));
  koBtn.addEventListener('click', () => changeLanguage('ko'));

  function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-switch button').forEach((b) =>
      b.classList.remove('active')
    );
    (lang === 'en' ? enBtn : koBtn).classList.add('active');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[lang][key];
    });

    const activeFilter = document.querySelector('.filter-nav .active').dataset.filter;
    const filtered =
      activeFilter === 'All'
        ? hospitals
        : hospitals.filter((h) => h.types.includes(activeFilter));
    renderCards(filtered);
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.card.expanded').forEach((c) =>
      c.classList.remove('expanded')
    );
  });

  renderCards(hospitals);
})();