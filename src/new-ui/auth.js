const STORAGE_KEY = "kino_users";
const SESSION_KEY = "kino_session_user";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function setSession(username) {
  localStorage.setItem(SESSION_KEY, username);
}

function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function passwordScore(pw) {
  const lengthOk = pw.length >= 8;
  const upperOk = /[A-Z]/.test(pw);
  const lowerOk = /[a-z]/.test(pw);
  const numberOk = /[0-9]/.test(pw);
  const symbolOk = /[^A-Za-z0-9]/.test(pw);
  const score = [lengthOk, upperOk, lowerOk, numberOk, symbolOk].filter(Boolean).length;
  return { score, lengthOk, upperOk, lowerOk, numberOk, symbolOk };
}

function scoreToUi(score) {
  if (score <= 2) return { label: "Svagt", className: "bg-danger", width: 25 };
  if (score === 3) return { label: "Okej", className: "bg-warning", width: 60 };
  return { label: "Starkt", className: "bg-success", width: 100 };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setMsg(el, text, ok) {
  if (!el) return;
  el.textContent = text || "";
  el.className = ok ? "text-success" : "text-danger";
}

function normalize(s) {
  return (s || "").trim();
}

function initSignup() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const msg = document.getElementById("signupMsg");
  const pwInput = document.getElementById("password");
  const pwBar = document.getElementById("pwBar");
  const pwLabel = document.getElementById("pwLabel");

  function updatePwUi() {
    const pw = normalize(pwInput?.value);
    const { score } = passwordScore(pw);
    const ui = scoreToUi(score);

    if (pwBar) {
      pwBar.className = `progress-bar ${ui.className}`;
      pwBar.style.width = `${ui.width}%`;
    }
    if (pwLabel) pwLabel.textContent = ui.label;
  }

  if (pwInput) {
    pwInput.addEventListener("input", updatePwUi);
    updatePwUi();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setMsg(msg, "", true);

    form.classList.add("was-validated");

    const fullName = normalize(form.fullName?.value);
    const username = normalize(form.username?.value);
    const email = normalize(form.email?.value);
    const password = form.password?.value ?? "";//remove normalisation as it can change users password
    const passwordConfirm = form.passwordConfirm?.value ?? "";//confirm password field


    const emailOk = isValidEmail(email);
    const pw = passwordScore(password);
    const pwStrongEnough = pw.score >= 4;

    if (!fullName || !username || !email || !password) {
      setMsg(msg, "Fyll i alla fält.", false);
      return;
    }

    if (!emailOk) {
      setMsg(msg, "E-postadressen verkar inte vara giltig.", false);
      return;
    }

    if (!pwStrongEnough) {
      setMsg(msg, "Välj ett starkare lösenord (minst 8 tecken, stora/små bokstäver, siffra och symbol).", false);
      return;
    }
    if (password !== passwordConfirm) {
      setMsg(msg, "Lösenorden matchar inte.", false);
      return;
    }//chck if password and confirm password match while submitting form



    const users = getUsers();

    const usernameTaken = users.some(u => (u.username || "").toLowerCase() === username.toLowerCase());
    if (usernameTaken) {
      setMsg(msg, "Användarnamnet är redan upptaget. Välj ett annat.", false);
      return;
    }

    const emailTaken = users.some(u => (u.email || "").toLowerCase() === email.toLowerCase());
    if (emailTaken) {
      setMsg(msg, "E-postadressen används redan. Logga in istället.", false);
      return;
    }

    users.push({
      fullName,
      username,
      email,
      password
    });

    saveUsers(users);
    setMsg(msg, "Konto skapat! Du skickas till inloggning...", true);

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 700);
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const msg = document.getElementById("loginMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setMsg(msg, "", true);

    form.classList.add("was-validated");

    const username = normalize(form.username?.value);
    const password = form.password?.value ?? "";//remove normalisation as it can change users password

    if (!username || !password) {
      setMsg(msg, "Fyll i användarnamn och lösenord.", false);
      return;
    }

    const users = getUsers();
    const found = users.find(u => (u.username || "").toLowerCase() === username.toLowerCase());

    if (!found) {
      setMsg(msg, "Fel användarnamn eller lösenord.", false);
      return;
    }

    if (found.password !== password) {
      setMsg(msg, "Fel användarnamn eller lösenord.", false);
      return;
    }

    setSession(found.username);
    setMsg(msg, "Inloggning lyckades! Skickar dig vidare...", true);

    setTimeout(() => {
      window.location.href = "./profile.html";
    }, 600);
  });
}

function initProfile() {
  const root = document.getElementById("profileRoot");
  if (!root) return;

  const username = getSession();
  if (!username) {
    window.location.href = "./login.html";
    return;
  }

  const users = getUsers();
  const user = users.find(u => (u.username || "").toLowerCase() === username.toLowerCase());

  if (!user) {
    clearSession();
    window.location.href = "./login.html";
    return;
  }

  const nameEl = document.getElementById("profileName");
  const usernameEl = document.getElementById("profileUsername");
  const emailEl = document.getElementById("profileEmail");

  if (nameEl) nameEl.textContent = user.fullName || "-";
  if (usernameEl) usernameEl.textContent = user.username || "-";
  if (emailEl) emailEl.textContent = user.email || "-";

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "../../index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSignup();
  initLogin();
  initProfile();
});

window.KinoAuth = {
  getUsers,
  saveUsers,
  setSession,
  getSession,
  clearSession,
  passwordScore,
  scoreToUi
};