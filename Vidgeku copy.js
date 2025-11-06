
  const STORAGE_KEY = 'car_reviews';

  const nameInput = document.querySelector('#name');
  const textInput = document.querySelector('#text');
  const sendBtn = document.querySelector('#send');
  const clearBtn = document.querySelector('#clear');
  const listEl = document.querySelector('#reviewsList');
  const avgScoreEl = document.querySelector('#avgScore');
  const countMetaEl = document.querySelector('#countMeta');
  const emptyHint = document.querySelector('#emptyHint');
  const stars = document.querySelectorAll('#rating .star');
  const ratingLabel = document.querySelector('#ratingLabel');

  let currentRating = 0;

  // --- зчитування і збереження ---
  function loadReviews() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveReviews(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // --- відображення відгуків ---
  function renderReviews() {
    const reviews = loadReviews();
    listEl.innerHTML = '';

    if (reviews.length === 0) {
      listEl.appendChild(emptyHint);
      avgScoreEl.textContent = '0.0';
      countMetaEl.textContent = '0 відгуків';
      return;
    }

    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    avgScoreEl.textContent = avg.toFixed(1);
    countMetaEl.textContent = `${reviews.length} відгуків`;

    reviews
      .sort((a, b) => b.time - a.time)
      .forEach(r => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <div class="top">
            <div class="avatar">${r.name[0].toUpperCase()}</div>
            <div class="who">
              <div class="name">${r.name}</div>
              <div class="when">${r.date}</div>
            </div>
            <div class="stars">
              ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </div>
          </div>
          <div class="text">${r.text}</div>
        `;
        listEl.appendChild(div);
      });
  }

  // --- робота зі зірками ---
  stars.forEach(star => {
    star.addEventListener('click', () => {
      currentRating = Number(star.dataset.value);
      highlightStars(currentRating);
    });
  });

  function highlightStars(n) {
    stars.forEach(s => {
      s.classList.toggle('filled', Number(s.dataset.value) <= n);
    });
    ratingLabel.textContent = n;
  }

  // --- події кнопок ---
  sendBtn.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'Анонім';
    const text = textInput.value.trim();
    if (!currentRating) return alert('Оберіть рейтинг');
    if (text.length < 3) return alert('Напишіть короткий відгук');

    const reviews = loadReviews();
    reviews.push({
      name,
      text,
      rating: currentRating,
      date: new Date().toLocaleString('uk-UA'),
      time: Date.now()
    });

    saveReviews(reviews);
    nameInput.value = '';
    textInput.value = '';
    highlightStars(0);
    currentRating = 0;
    renderReviews();
  });

  clearBtn.addEventListener('click', () => {
    nameInput.value = '';
    textInput.value = '';
    highlightStars(0);
    currentRating = 0;
  });

  // початкове завантаження
  renderReviews();


   