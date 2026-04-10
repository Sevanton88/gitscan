/* ============================================================
   GitScan — GitHub Profile Analyzer
   app.js
   ============================================================
   Uses the public GitHub REST API (no auth needed).
   Rate limit: 60 requests/hour unauthenticated.
   ============================================================ */

const API = 'https://api.github.com';

/* ---------- Language color map ---------- */
const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  Python:      '#3572A5',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  SCSS:        '#c6538c',
  Rust:        '#dea584',
  Go:          '#00ADD8',
  Java:        '#b07219',
  'C++':       '#f34b7d',
  C:           '#555555',
  'C#':        '#178600',
  Ruby:        '#701516',
  PHP:         '#4F5D95',
  Swift:       '#F05138',
  Kotlin:      '#A97BFF',
  Shell:       '#89e051',
  Vue:         '#41b883',
  Dart:        '#00B4AB',
  Elixir:      '#6e4a7e',
  Haskell:     '#5e5086',
  Lua:         '#000080',
  R:           '#198CE7',
  Scala:       '#c22d40',
  Svelte:      '#ff3e00',
  Markdown:    '#083fa1',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || '#8b949e';
}

/* ---------- DOM ---------- */
const screens = {
  search:  document.getElementById('screen-search'),
  loading: document.getElementById('screen-loading'),
  error:   document.getElementById('screen-error'),
  profile: document.getElementById('screen-profile'),
};

const searchInput  = document.getElementById('search-input');
const searchBtn    = document.getElementById('search-btn');
const loadingText  = document.getElementById('loading-text');

/* ---------- Screen navigation ---------- */
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

/* ---------- Main search handler ---------- */
async function handleSearch(username) {
  username = username.trim().replace(/^@/, '');
  if (!username) return;

  showScreen('loading');
  loadingText.textContent = `Fetching @${username}...`;

  try {
    // 1 — user profile
    const userRes = await fetch(`${API}/users/${username}`);
    if (!userRes.ok) {
      showError(userRes.status === 404
        ? `No GitHub user found with username "${username}".`
        : `GitHub API error (${userRes.status}). Try again later.`
      );
      return;
    }
    const user = await userRes.json();

    loadingText.textContent = 'Fetching repositories...';

    // 2 — repos (up to 100, sorted by updated)
    const reposRes = await fetch(
      `${API}/users/${username}/repos?per_page=100&sort=updated`
    );
    const repos = reposRes.ok ? await reposRes.json() : [];

    renderProfile(user, repos);
    showScreen('profile');

  } catch (err) {
    showError('Network error. Check your internet connection and try again.');
    console.error(err);
  }
}

/* ---------- Error ---------- */
function showError(msg) {
  document.getElementById('error-msg').textContent = msg;
  showScreen('error');
}

/* ---------- Render Profile ---------- */
function renderProfile(user, repos) {
  /* ── User card ── */
  document.getElementById('avatar').src          = user.avatar_url;
  document.getElementById('avatar').alt          = user.login;
  document.getElementById('user-name').textContent  = user.name || user.login;
  document.getElementById('user-login').textContent = '@' + user.login;
  document.getElementById('user-bio').textContent   = user.bio || '';

  document.getElementById('github-link').href =
    `https://github.com/${user.login}`;

  /* Meta items */
  setMeta('meta-location', 'location-text', user.location);
  setMeta('meta-company',  'company-text',  user.company);
  setMeta('meta-twitter',  'twitter-text',  user.twitter_username
    ? '@' + user.twitter_username : null);

  if (user.blog) {
    document.getElementById('meta-blog').style.display = 'flex';
    const link = document.getElementById('blog-link');
    link.href        = user.blog.startsWith('http') ? user.blog : 'https://' + user.blog;
    link.textContent = user.blog.replace(/^https?:\/\//, '');
  }

  const joined = new Date(user.created_at);
  document.getElementById('joined-text').textContent =
    'Joined ' + joined.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  /* Follow stats */
  document.getElementById('followers-val').textContent = fmtNum(user.followers);
  document.getElementById('following-val').textContent = fmtNum(user.following);
  document.getElementById('repos-val').textContent     = fmtNum(user.public_repos);

  /* ── Aggregate stats ── */
  const ownRepos = repos.filter(r => !r.fork);
  const totalStars    = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks    = ownRepos.reduce((s, r) => s + r.forks_count, 0);
  const totalWatchers = ownRepos.reduce((s, r) => s + r.watchers_count, 0);
  const totalSize     = ownRepos.reduce((s, r) => s + r.size, 0);

  document.getElementById('total-stars').textContent    = fmtNum(totalStars);
  document.getElementById('total-forks').textContent    = fmtNum(totalForks);
  document.getElementById('total-watchers').textContent = fmtNum(totalWatchers);
  document.getElementById('total-size').textContent     = fmtNum(Math.round(totalSize));

  /* ── Language breakdown ── */
  renderLanguages(ownRepos);

  /* ── Top repos by stars ── */
  const topRepos = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
  renderRepoList(topRepos);

  /* ── Recently updated ── */
  const recentRepos = [...repos]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
  renderRecentList(recentRepos);
}

/* ---------- Meta helper ---------- */
function setMeta(wrapId, textId, value) {
  const wrap = document.getElementById(wrapId);
  if (value) {
    wrap.style.display = 'flex';
    document.getElementById(textId).textContent = value;
  } else {
    wrap.style.display = 'none';
  }
}

/* ---------- Language Breakdown ---------- */
function renderLanguages(repos) {
  const counts = {};
  repos.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total  = sorted.reduce((s, [, n]) => s + n, 0);
  const top    = sorted.slice(0, 8); // max 8 languages shown

  document.getElementById('lang-repo-count').textContent =
    `${repos.length} repositories`;

  /* Bar */
  const bar = document.getElementById('lang-bar');
  bar.innerHTML = '';
  top.forEach(([lang, count]) => {
    const pct = (count / total) * 100;
    const seg = document.createElement('div');
    seg.className = 'lang-segment';
    seg.style.width      = pct + '%';
    seg.style.background = getLangColor(lang);
    seg.title = `${lang}: ${Math.round(pct)}%`;
    bar.appendChild(seg);
  });

  /* Legend */
  const legend = document.getElementById('lang-legend');
  legend.innerHTML = '';
  top.forEach(([lang, count]) => {
    const pct  = Math.round((count / total) * 100);
    const item = document.createElement('div');
    item.className = 'lang-item';
    item.innerHTML = `
      <span class="lang-dot" style="background:${getLangColor(lang)}"></span>
      <span>${lang}</span>
      <span class="lang-pct">${pct}%</span>
    `;
    legend.appendChild(item);
  });
}

/* ---------- Top Repos ---------- */
function renderRepoList(repos) {
  const list = document.getElementById('repo-list');
  list.innerHTML = '';

  if (!repos.length) {
    list.innerHTML = '<p style="color:var(--text-3);font-size:.8rem;">No public repositories found.</p>';
    return;
  }

  repos.forEach((repo, i) => {
    const a = document.createElement('a');
    a.className = 'repo-row';
    a.href      = repo.html_url;
    a.target    = '_blank';
    a.rel       = 'noopener';
    a.style.animationDelay = `${i * 0.05}s`;
    a.innerHTML = `
      <div class="repo-info">
        <div class="repo-name">${repo.name}</div>
        ${repo.description
          ? `<div class="repo-desc">${escHtml(repo.description)}</div>`
          : ''}
        <div class="repo-meta">
          ${repo.language
            ? `<div class="repo-lang">
                 <span class="repo-lang-dot" style="background:${getLangColor(repo.language)}"></span>
                 ${repo.language}
               </div>`
            : ''}
          <div class="repo-stat">⭐ ${fmtNum(repo.stargazers_count)}</div>
          <div class="repo-stat">🍴 ${fmtNum(repo.forks_count)}</div>
        </div>
      </div>
    `;
    list.appendChild(a);
  });
}

/* ---------- Recent Repos ---------- */
function renderRecentList(repos) {
  const list = document.getElementById('recent-list');
  list.innerHTML = '';

  repos.forEach(repo => {
    const a = document.createElement('a');
    a.className = 'recent-row';
    a.href      = repo.html_url;
    a.target    = '_blank';
    a.rel       = 'noopener';
    a.innerHTML = `
      <span class="recent-name">${repo.full_name}</span>
      <span class="recent-date">${timeAgo(repo.updated_at)}</span>
    `;
    list.appendChild(a);
  });
}

/* ---------- Helpers ---------- */
function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0)  return 'today';
  if (days === 1)  return 'yesterday';
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ---------- Event Listeners ---------- */
searchBtn.addEventListener('click', () => {
  handleSearch(searchInput.value);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch(searchInput.value);
});

// Suggestion pills
document.querySelectorAll('.suggestion-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    searchInput.value = pill.dataset.user;
    handleSearch(pill.dataset.user);
  });
});

// Back buttons
document.getElementById('back-btn').addEventListener('click', () => {
  showScreen('search');
  searchInput.value = '';
  searchInput.focus();
});

document.getElementById('error-back-btn').addEventListener('click', () => {
  showScreen('search');
  searchInput.focus();
});

/* ---------- Init ---------- */
showScreen('search');
searchInput.focus();
