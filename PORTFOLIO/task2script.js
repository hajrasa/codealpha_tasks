// mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("open");
});

// close the menu after tapping a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
  });
});

// fade sections in as they scroll into view
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => revealObserver.observe(el));

// give the nav a shadow once you scroll past the top
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = "0 4px 20px rgba(18, 22, 28, 0.06)";
  } else {
    nav.style.boxShadow = "none";
  }
});

// copy email button
const copyBtn = document.getElementById("copyBtn");
const emailLink = document.getElementById("emailLink");

copyBtn.addEventListener("click", async () => {
  const email = emailLink.textContent.trim();

  try {
    await navigator.clipboard.writeText(email);
  } catch (err) {
    // clipboard API not supported, fall back to the old copy method
    const tempInput = document.createElement("input");
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  const originalText = copyBtn.textContent;
  copyBtn.textContent = "Copied!";
  copyBtn.classList.add("copied");

  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.classList.remove("copied");
  }, 1800);
});

// footer year
document.getElementById("year").textContent = new Date().getFullYear();
