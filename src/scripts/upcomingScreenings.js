export function setupUpcomingScreenings() {
  const init = async () => {
    const container = document.querySelector('.upcoming-screenings__list');
    if (!container) return;

    showMessage(container, 'Laddar...', 'loading');
    
    try {
      const { data: days } = await fetchJSON('/api/upcoming-screenings');

      if (!days || !days.length) {
        showMessage(container, 'Inga visningar för de kommande fem dagarna', 'empty');
        return;
      }

      container.textContent = '';
      const rendered = renderUpcomingScreenings(days);

      if (rendered) {
        container.appendChild(rendered);
      }
      
    } catch (err) {
      console.error('Failed to render screenings:', err);
      showMessage(
        container,
        'Visningar kunde inte laddas.', 'error'
      );
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}


function renderUpcomingScreenings(days) {
  const container = document.createElement('div');

  days.forEach(day => {
    const dayEl = renderDay(day);
    if (dayEl) {                   
      container.appendChild(dayEl);  
    }
  });
  
  return container.childElementCount ? container : null;
}

function renderDay(day) {
  if (!day?.date || !Array.isArray(day.screenings)) return null;

  const dayEl = document.createElement('div');
  dayEl.className = 'upcoming-screenings__day';

  const h3 = document.createElement('h3');
  h3.className = 'upcoming-screenings__date';
  h3.textContent = formatDate(day.date);
  dayEl.appendChild(h3);

  day.screenings.forEach(screening => {
    const screeningEl = renderScreening(screening);
    if (screeningEl) {
      dayEl.appendChild(screeningEl);
    }
  });

  return dayEl;
}

function renderScreening({ startTime, room }) {
  const p = document.createElement('p');
  p.className = 'upcoming-screenings__screening';

  const date = new Date(startTime);

  if (isNaN(date)) {
    console.error("Invalid date:", startTime);
    return null;
  }

  p.textContent = formatTime(date, room);

  return p;
}
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('sv-SE', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(date, room) {
  const time = date.toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${time} - ${room}`;
}

function showMessage(container, message, type) {
  container.textContent = '';

  const p = document.createElement('p');
  p.textContent = message;
  p.classList.add(type);

  container.appendChild(p);
}
