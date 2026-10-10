
document.addEventListener("DOMContentLoaded", () => {
  const pages = [...document.querySelectorAll(".page")];
  const pageNumber = document.getElementById("pageNumber");
  const progressBar = document.getElementById("progressBar");
  const bottomPrev = document.getElementById("bottomPrev");
  const bottomNext = document.getElementById("bottomNext");

  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");

  const toast = document.getElementById("toast");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");

  let currentPage = 0;
  let isAnimating = false;
  let typingTimer = null;
  let toastTimer = null;
  let lightboxIndex = 0;
  let wishDone = false;

  const pageNames = [
    "Cover",
    "Birthday wishes",
    "Photo gallery",
    "Our timeline",
    "Things I adore",
    "A letter for you",
    "Make a wish",
    "The end"
  ];

  const photos = [
    { src: "images/foto 1.jpg", caption: "our little moment ♡" },
    { src: "images/foto 2.jpg", caption: "my favorite memory" },
    { src: "images/foto 3.jpg", caption: "you make me smile" },
    { src: "images/foto 4.jpg", caption: "a day to remember" },
    { src: "images/foto 5.jpg", caption: "just us things" },
    { src: "images/foto 6.jpg", caption: "little happiness" },
    { src: "images/foto7.jpg", caption: "a memory to keep" },
    { src: "images/foto8.jpg", caption: "one of my favorites" },
    { src: "images/foto9.jpg", caption: "you & me ♡" },
    { src: "images/foto10.jpg", caption: "always worth remembering" }
  ];

  const letterText =
`Selamat ulang tahun, Sayang. ♡

Makasih sudah hadir dan menjadi bagian dari hari-hariku. Aku senang bisa mengenal kamu, mendengar cerita kamu, tertawa bareng, dan menyimpan banyak momen kecil yang berarti.

Di usia baru ini, aku berharap kamu selalu diberi kesehatan, ketenangan, keberanian untuk mengejar hal yang kamu impikan, dan orang-orang baik yang menyayangimu.

Kalau suatu hari kamu capek, semoga kamu ingat kalau kamu nggak harus selalu kuat setiap saat. Pelan-pelan juga nggak apa-apa. Aku akan terus belajar jadi pasangan yang lebih baik, mendengarkan kamu, dan menghargai hal-hal kecil tentang kita.

Semoga hubungan kita terus dipenuhi kejujuran, tawa, pengertian, dan kenangan baru yang bisa kita simpan bersama.

Happy birthday, Sayang. Semoga hari ini membuat kamu merasa seistimewa dirimu. Aku sayang kamu. ♡`;

  // =========================
  // NOTIFIKASI
  // =========================

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // =========================
  // MUSIK
  // =========================

  // Volume musik 70%.
  music.volume = 0.40;

  function updateMusicButton(playing) {
    musicToggle.classList.toggle("playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicLabel.textContent = playing ? "Jeda musik" : "Putar musik";
  }

  async function playMusic() {
    if (!music.paused) {
      updateMusicButton(true);
      return true;
    }

    try {
      await music.play();
      updateMusicButton(true);
      return true;
    } catch (error) {
      updateMusicButton(false);
      return false;
    }
  }

  function pauseMusic() {
    music.pause();
    updateMusicButton(false);
  }

  // Coba autoplay ketika halaman dibuka.
  // Browser HP mungkin memblokirnya.
  playMusic();

  // Tombol musik play/pause.
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      const success = await playMusic();

      if (!success) {
        showToast("Musik belum bisa diputar. Coba tekan lagi ya ♡");
      }
    } else {
      pauseMusic();
    }
  });

  music.addEventListener("play", () => updateMusicButton(true));
  music.addEventListener("pause", () => updateMusicButton(false));

  music.addEventListener("error", () => {
    updateMusicButton(false);
    showToast("Cek file audio/musik.mp3 dulu ya, wak.");
  });

  // =========================
  // NAVIGASI HALAMAN
  // =========================

  function updateControls() {
    pageNumber.textContent = pageNames[currentPage];

    progressBar.style.width =
      `${(currentPage / (pages.length - 1)) * 100}%`;

    bottomPrev.disabled = currentPage === 0 || isAnimating;
    bottomNext.disabled =
      currentPage === pages.length - 1 || isAnimating;

    bottomNext.textContent =
      currentPage === pages.length - 2
        ? "Tutup buku →"
        : "Berikutnya →";
  }

  function showPage(index, direction = 1) {
    if (
      isAnimating ||
      index < 0 ||
      index >= pages.length ||
      index === currentPage
    ) {
      return;
    }

    isAnimating = true;

    const oldPage = pages[currentPage];
    const newPage = pages[index];

    pages.forEach(page => {
      page.classList.remove("entering-from-back");
      page.setAttribute("aria-hidden", "true");
    });

    newPage.classList.add("entering-from-back");
    newPage.classList.add("active");
    newPage.setAttribute("aria-hidden", "false");

    // Paksa browser membaca posisi awal animasi.
    void newPage.offsetWidth;

    oldPage.classList.remove("active");
    oldPage.classList.add("leaving");

    requestAnimationFrame(() => {
      newPage.classList.remove("entering-from-back");
    });

    currentPage = index;
    updateControls();

    if (index === 5) {
      startTypingLetter();
    }

    setTimeout(() => {
      oldPage.classList.remove("leaving");
      isAnimating = false;
      updateControls();
    }, 620);
  }

  function nextPage() {
    if (currentPage < pages.length - 1) {
      showPage(currentPage + 1, 1);
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      showPage(currentPage - 1, -1);
    }
  }

  // Sampul: buka buku dan coba putar musik.
  // Hanya satu listener untuk tombol ini, supaya tidak dobel.
  document.querySelector(".open-book").addEventListener("click", () => {
    nextPage();
    playMusic();
  });

  document.querySelectorAll(".next").forEach(button => {
    button.addEventListener("click", nextPage);
  });

  document.querySelectorAll(".prev").forEach(button => {
    button.addEventListener("click", previousPage);
  });

  bottomNext.addEventListener("click", nextPage);
  bottomPrev.addEventListener("click", previousPage);

  document.getElementById("readAgain").addEventListener("click", () => {
    if (currentPage !== 0) {
      showPage(0, -1);
    }
  });

  document.getElementById("closeBook").addEventListener("click", () => {
    if (isAnimating || currentPage === 0) return;

    const closing = pages[currentPage];

    closing.classList.add("leaving");
    closing.classList.remove("active");
    isAnimating = true;

    setTimeout(() => {
      closing.classList.remove("leaving");

      pages.forEach(page => {
        page.setAttribute("aria-hidden", "true");
      });

      pages[0].classList.add("active");
      pages[0].setAttribute("aria-hidden", "false");

      currentPage = 0;
      isAnimating = false;

      updateControls();
    }, 620);
  });

  document.addEventListener("keydown", event => {
    if (lightbox.classList.contains("open")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") changeLightbox(1);
      if (event.key === "ArrowLeft") changeLightbox(-1);
      return;
    }

    if (event.key === "ArrowRight") nextPage();
    if (event.key === "ArrowLeft") previousPage();

    if (
      event.key === "Home" &&
      currentPage !== 0 &&
      !isAnimating
    ) {
      showPage(0, -1);
    }
  });

  // =========================
  // GALERI FOTO / LIGHTBOX
  // =========================

  function openLightbox(index) {
    lightboxIndex = index;
    renderLightbox();

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function renderLightbox() {
    const photo = photos[lightboxIndex];

    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.caption;
    lightboxCaption.textContent = photo.caption;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImage.src = "";
    document.body.style.overflow = "";
  }

  function changeLightbox(delta) {
    lightboxIndex =
      (lightboxIndex + delta + photos.length) % photos.length;

    renderLightbox();
  }

  document.querySelectorAll(".polaroid").forEach(button => {
    button.addEventListener("click", () => {
      openLightbox(Number(button.dataset.photo));
    });
  });

  document.getElementById("lightboxClose")
    .addEventListener("click", closeLightbox);

  document.getElementById("lightboxPrev")
    .addEventListener("click", () => changeLightbox(-1));

  document.getElementById("lightboxNext")
    .addEventListener("click", () => changeLightbox(1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // =========================
  // ANIMASI MENGETIK SURAT
  // =========================

  let letterStarted = false;

  function startTypingLetter() {
    if (letterStarted) return;

    letterStarted = true;

    const target = document.getElementById("typedLetter");
    const cursor = document.getElementById("typingCursor");
    const showAll = document.getElementById("showLetter");

    let index = 0;
    const speed = 19;

    function typeNext() {
      if (index >= letterText.length) {
        cursor.hidden = true;
        showAll.hidden = true;
        return;
      }

      target.textContent += letterText.charAt(index++);
      typeTimerScroll();

      typingTimer = setTimeout(typeNext, speed);
    }

    function typeTimerScroll() {
      const paper = document.querySelector(".letter-paper");
      paper.scrollTop = paper.scrollHeight;
    }

    typeNext();

    showAll.addEventListener("click", () => {
      clearTimeout(typingTimer);

      target.textContent = letterText;
      cursor.hidden = true;
      showAll.hidden = true;

      document.querySelector(".letter-paper").scrollTop = 0;
    }, { once: true });
  }

  // =========================
  // WISH BUTTON + CONFETTI
  // =========================

  function launchConfetti() {
    const colors = [
      "#e77d9c",
      "#f5c4d2",
      "#f3d989",
      "#ffffff",
      "#c67ba2",
      "#eaa8b8"
    ];

    for (let i = 0; i < 95; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;

      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.setProperty(
        "--drift",
        `${Math.random() * 220 - 110}px`
      );

      piece.style.setProperty(
        "--fall-time",
        `${2 + Math.random() * 2.2}s`
      );

      piece.style.animationDelay = `${Math.random() * 0.65}s`;

      document.body.appendChild(piece);

      setTimeout(() => piece.remove(), 5000);
    }
  }

  document.getElementById("wishButton").addEventListener("click", () => {
    if (wishDone) {
      showToast("Semoga semua harapan baikmu satu per satu terwujud ♡");
      return;
    }

    wishDone = true;

    document.getElementById("wishMessage").hidden = false;
    document.getElementById("wishButton").textContent = "Wish sent! ♡";

    launchConfetti();
  });

  // =========================
  // PLACEHOLDER FOTO KOSONG
  // =========================

  document.querySelectorAll(".polaroid img").forEach((img, index) => {
    img.addEventListener("error", () => {
      img.alt = `Tambahkan images/foto${index + 1}.jpg`;
      img.style.objectFit = "contain";
      img.style.padding = "12px";

      img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="210">
            <rect width="100%" height="100%" fill="#f8e8ed"/>
            <text x="50%" y="45%" font-family="sans-serif" font-size="15" text-anchor="middle" fill="#b7798d">Foto ${index + 1}</text>
            <text x="50%" y="57%" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#b7798d">images/foto${index + 1}.jpg</text>
          </svg>`
        );
    }, { once: true });
  });

  // =========================
  // MULAI WEBSITE
  // =========================

  updateControls();
});
