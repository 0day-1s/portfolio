const GITHUB_USERNAME = "0day-1s"; // ← replace with your real GitHub username

// --- Typing effect ---
const typedEl = document.getElementById("typed");
const phrases = [
  "I build clean, reliable software.",
  "I ship code that actually works.",
  "Available for internships & freelance work."
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// --- GitHub repos ---
const container = document.getElementById("projects-container");

async function loadGitHubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    );
    if (!response.ok) throw new Error("Could not fetch repos");

    const repos = await response.json();
    container.innerHTML = "";

    if (repos.length === 0) {
      container.innerHTML = "<p>No public repositories found.</p>";
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description ? repo.description : "No description provided."}</p>
        <p>⭐ ${repo.stargazers_count} &nbsp; ${repo.language ?? ""}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub →</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Couldn't load projects. Check the GitHub username in script.js.</p>";
  }
}

loadGitHubRepos();

// --- Stats counter animation (counts up when scrolled into view) ---
const statNumbers = document.querySelectorAll(".stat-number");

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200; // ms
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// --- Smooth scroll for nav links ---
document.querySelectorAll('.navbar nav a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// --- Fade-in on scroll for sections ---
const sections = document.querySelectorAll(".section");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => {
  section.classList.add("fade-in");
  sectionObserver.observe(section);
});