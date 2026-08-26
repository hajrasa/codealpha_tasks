/* ============================================================
   GALLERY LOGIC
   Sections:
   1. Photo data
   2. Rendering the grid
   3. Category filtering
   4. Lightbox open/close
   5. Lightbox navigation (next/prev, keyboard)
   ============================================================
   NOTE: Images are pulled live from a keyword-based placeholder
   photo service (loremflickr.com) so the gallery works out of the
   box without any images to upload. Swap each "src" below for
   your own photos when you're ready — everything else (grid,
   filters, lightbox, hover effects) will keep working unchanged.
============================================================ */

/* ---------------- 1. PHOTO DATA ---------------- */
const photos = [
  { title: "Ridge Line",        category: "nature",       src: "https://loremflickr.com/600/750/mountain,landscape?lock=1" },
  { title: "Morning Fog",       category: "nature",       src: "https://loremflickr.com/600/750/forest,mist?lock=2" },
  { title: "Coastal Light",     category: "nature",       src: "https://loremflickr.com/600/750/ocean,cliff?lock=3" },
  { title: "Glass & Steel",     category: "architecture", src: "https://loremflickr.com/600/750/skyscraper,city?lock=4" },
  { title: "Old Quarter",       category: "architecture", src: "https://loremflickr.com/600/750/architecture,street?lock=5" },
  { title: "Spiral Stair",      category: "architecture", src: "https://loremflickr.com/600/750/staircase,building?lock=6" },
  { title: "Field Fox",         category: "wildlife",     src: "https://loremflickr.com/600/750/fox,wildlife?lock=7" },
  { title: "Tall Grass",        category: "wildlife",     src: "https://loremflickr.com/600/750/lion,savanna?lock=8" },
  { title: "Wingspan",          category: "wildlife",     src: "https://loremflickr.com/600/750/eagle,bird?lock=9" },
  { title: "Market Alley",      category: "travel",       src: "https://loremflickr.com/600/750/market,travel?lock=10" },
  { title: "Desert Road",       category: "travel",       src: "https://loremflickr.com/600/750/desert,road?lock=11" },
  { title: "Harbor Town",       category: "travel",       src: "https://loremflickr.com/600/750/harbor,village?lock=12" },
  { title: "Citrus Bowl",       category: "food",         src: "https://loremflickr.com/600/750/citrus,fruit?lock=13" },
  { title: "Fresh Loaf",        category: "food",         src: "https://loremflickr.com/600/750/bread,bakery?lock=14" },
  { title: "Evening Table",     category: "food",         src: "https://loremflickr.com/600/750/dinner,table?lock=15" }
];

/* ---------------- 2. DOM REFERENCES ---------------- */
const galleryEl = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbTitle = document.getElementById("lbTitle");
const lbMeta = document.getElementById("lbMeta");
const lbCounter = document.getElementById("lbCounter");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let currentFilter = "all";
let currentIndex = 0; // index within the currently *visible* (filtered) photo set

/* ---------------- 3. RENDER GRID ---------------- */

function renderGallery() {
  galleryEl.innerHTML = "";

  photos.forEach((photo, index) => {
    const figure = document.createElement("figure");
    figure.className = "frame";
    figure.dataset.category = photo.category;
    figure.dataset.index = index;

    figure.innerHTML = `
      <div class="photo-inner">
        <img src="${photo.src}" alt="${photo.title}" loading="lazy" />
        <div class="overlay">
          <p class="cap-title">${photo.title}</p>
          <p class="cap-tag">${photo.category}</p>
        </div>
        <div class="view-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `;

    figure.addEventListener("click", () => openLightbox(index));
    galleryEl.appendChild(figure);
  });
}

/* ---------------- 4. CATEGORY FILTERING ---------------- */

function applyFilter(category) {
  currentFilter = category;

  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === category);
  });

  document.querySelectorAll(".frame").forEach(frame => {
    const matches = category === "all" || frame.dataset.category === category;
    frame.classList.toggle("hide", !matches);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

/* Helper: get the list of photo indices currently visible under the active filter */
function getVisibleIndices() {
  return photos
    .map((p, i) => i)
    .filter(i => currentFilter === "all" || photos[i].category === currentFilter);
}

/* ---------------- 5. LIGHTBOX ---------------- */

function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  const photo = photos[currentIndex];
  const visible = getVisibleIndices();
  const posInVisible = visible.indexOf(currentIndex) + 1;

  // Small crossfade: fade out, swap src, fade back in
  lbImage.classList.add("switching");
  setTimeout(() => {
    lbImage.src = photo.src;
    lbImage.alt = photo.title;
    lbTitle.textContent = photo.title;
    lbMeta.textContent = photo.category;
    lbCounter.textContent = `${posInVisible} / ${visible.length}`;
    lbImage.classList.remove("switching");
  }, 150);
}

// Move to next/previous image WITHIN the current filtered set
function showAdjacent(direction) {
  const visible = getVisibleIndices();
  const posInVisible = visible.indexOf(currentIndex);
  const nextPos = (posInVisible + direction + visible.length) % visible.length;
  currentIndex = visible[nextPos];
  updateLightboxImage();
}

lbNext.addEventListener("click", () => showAdjacent(1));
lbPrev.addEventListener("click", () => showAdjacent(-1));
lbClose.addEventListener("click", closeLightbox);

// Click outside the framed image closes the lightbox
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support: Esc to close, arrows to navigate
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;

  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowRight") showAdjacent(1);
  else if (e.key === "ArrowLeft") showAdjacent(-1);
});

/* ---------------- INIT ---------------- */
renderGallery();
