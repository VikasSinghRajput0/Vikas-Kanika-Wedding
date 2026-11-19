/**
 * Kanika & Vikas Wedding - Custom Interactive Scripts
 * - "Tera Mera Lagan" (तेरा मेरा लग्न) Background Audio Player (Seamless Autoplay with Gesture Unlock)
 * - Dual Theme Switcher (Royal Vedic & Modern Minimalist)
 * - Live Countdown to Feb 01, 2027
 * - Add to Calendar Helper (.ics & Google Calendar)
 * - Interactive FAQ Accordion
 * - Wedding Photo Drive & Multi-Select Gallery Upload Helper
 * - Flower Petal Shower Animation (पुष्प वर्षा)
 * - Native Web Share API / Copy Link Toast
 * - Wedding Hashtag 1-Click Copy
 * - Song Lyrics Modal
 * - Offline Service Worker Registration
 */

// Global HTML Escaping Utility
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Global Toast Notification System
function showWeddingToast(message, icon) {
    icon = icon || "✨";
    let toast = document.getElementById("weddingToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "weddingToast";
        toast.className = "wedding-toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size: 16px;">${icon}</span> <span>${escapeHtml(message)}</span>`;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// Flower Petal Shower Animation (पुष्प वर्षा)
function triggerPetalShower(count) {
    count = count || 36;
    let container = document.getElementById("petalShowerContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "petalShowerContainer";
        container.className = "petal-shower-canvas";
        document.body.appendChild(container);
    }

    const types = ["petal-rose", "petal-marigold", "petal-white"];
    for (let i = 0; i < count; i++) {
        const petal = document.createElement("div");
        const type = types[Math.floor(Math.random() * types.length)];
        petal.className = `petal-item ${type}`;

        const size = Math.floor(Math.random() * 14) + 12; // 12px to 26px
        petal.style.width = size + "px";
        petal.style.height = (size * 1.35) + "px";
        petal.style.left = (Math.random() * 100) + "vw";

        const duration = (Math.random() * 2.5 + 3.5).toFixed(1); // 3.5s to 6.0s
        const delay = (Math.random() * 1.5).toFixed(1);
        petal.style.animationDuration = duration + "s";
        petal.style.animationDelay = delay + "s";

        container.appendChild(petal);
        setTimeout(() => {
            petal.remove();
        }, (parseFloat(duration) + parseFloat(delay)) * 1000 + 400);
    }
}

// Native Web Share or Copy Link Helper
function shareWeddingWebsite() {
    const shareUrl = window.location.href.split('#')[0];
    const shareData = {
        title: "Kanika & Vikas Wedding | Auspicious Vivah",
        text: "With divine blessings of family and ancestors, cordially inviting you with family to celebrate the sacred marriage of Kanika & Vikas in Hamirpur, H.P. (01-03 Feb 2027).",
        url: shareUrl
    };

    if (navigator.share) {
        navigator.share(shareData).catch(() => {});
    } else {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showWeddingToast("Wedding invitation link copied to clipboard! 📋", "💍");
            }).catch(() => {
                prompt("Copy wedding website link:", shareUrl);
            });
        } else {
            prompt("Copy wedding website link:", shareUrl);
        }
    }
}

// Copy Hashtag Helper
function copyWeddingHashtag(tag) {
    tag = tag || "#KanikaWedsVikas";
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tag).then(() => {
            showWeddingToast(`Hashtag ${tag} copied to clipboard!`, "🏷️");
        }).catch(() => {
            showWeddingToast(`Tag: ${tag}`, "✨");
        });
    } else {
        showWeddingToast(`Tag: ${tag}`, "✨");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // -------------------------------------------------------------
    // 1. "Tera Mera Lagan" (तेरा मेरा लग्न) Audio Player
    // -------------------------------------------------------------
    const weddingAudio = document.getElementById("weddingAudio");
    const musicBar = document.getElementById("floatingMusicBar");
    const discIcon = document.getElementById("musicDiscIcon");
    const playBtnIcon = document.getElementById("musicPlayBtnIcon");
    const playToggleBtn = document.getElementById("btnMusicPlayToggle");
    const statusPill = document.getElementById("musicStatusPill");

    function updateAudioUI(playing) {
        if (playing) {
            if (discIcon) discIcon.classList.add("playing");
            if (playBtnIcon) playBtnIcon.className = "fas fa-pause";
            if (statusPill) {
                statusPill.innerText = "Playing 🎶";
                statusPill.style.background = "rgba(40, 167, 69, 0.75)";
            }
            if (musicBar) musicBar.classList.remove("pulse-glow");
        } else {
            if (discIcon) discIcon.classList.remove("playing");
            if (playBtnIcon) playBtnIcon.className = "fas fa-play";
            if (statusPill) {
                statusPill.innerText = "Tap to Play 🎵";
                statusPill.style.background = "rgba(229, 169, 59, 0.85)";
            }
            if (musicBar) musicBar.classList.add("pulse-glow");
        }
    }

    // Direct synchronization with native audio events ensures UI NEVER lies
    if (weddingAudio) {
        weddingAudio.volume = 0.95;

        weddingAudio.addEventListener("play", function () {
            updateAudioUI(true);
        });
        weddingAudio.addEventListener("playing", function () {
            updateAudioUI(true);
        });
        weddingAudio.addEventListener("pause", function () {
            updateAudioUI(false);
        });
        weddingAudio.addEventListener("ended", function () {
            weddingAudio.currentTime = 0;
            weddingAudio.play().catch(function () {});
        });
    }

    function startMusic() {
        if (!weddingAudio) return;
        weddingAudio.volume = 0.95;
        const p = weddingAudio.play();
        if (p !== undefined) {
            p.then(function () {
                updateAudioUI(true);
            }).catch(function () {
                // Browser policy blocked unmuted autoplay pending real user gesture
                updateAudioUI(false);
            });
        }
    }

    function pauseMusic() {
        if (!weddingAudio) return;
        weddingAudio.pause();
        updateAudioUI(false);
    }

    function toggleMusic() {
        if (!weddingAudio) return;
        if (weddingAudio.paused) {
            startMusic();
        } else {
            pauseMusic();
        }
    }

    // Attempt autoplay immediately
    startMusic();

    // Global gesture unlock: on the very first touch/click anywhere on the page, music starts!
    let isGestureUnlocked = false;
    const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];

    function globalGestureUnlock() {
        if (isGestureUnlocked) return;
        if (weddingAudio && weddingAudio.paused) {
            weddingAudio.volume = 0.95;
            const p = weddingAudio.play();
            if (p !== undefined) {
                p.then(function () {
                    isGestureUnlocked = true;
                    unlockEvents.forEach(function (evt) {
                        window.removeEventListener(evt, globalGestureUnlock, true);
                    });
                }).catch(function () {});
            }
        } else if (weddingAudio && !weddingAudio.paused) {
            isGestureUnlocked = true;
            unlockEvents.forEach(function (evt) {
                window.removeEventListener(evt, globalGestureUnlock, true);
            });
        }
    }

    unlockEvents.forEach(function (evt) {
        window.addEventListener(evt, globalGestureUnlock, { capture: true, passive: true });
    });

    // Toggle on floating music bar click
    if (musicBar) {
        musicBar.addEventListener("click", function (e) {
            // Don't toggle music if user clicked lyrics button
            if (e.target.closest("#btnSongLyrics")) return;
            e.preventDefault();
            toggleMusic();
        });
    }

    if (playToggleBtn) {
        playToggleBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // -------------------------------------------------------------
    // 2. Song Lyrics Modal
    // -------------------------------------------------------------
    const lyricsModal = document.getElementById("songLyricsModal");
    const btnOpenLyrics = document.getElementById("btnSongLyrics");
    const btnCloseLyrics = document.getElementById("btnCloseSongLyrics");

    if (btnOpenLyrics && lyricsModal) {
        btnOpenLyrics.addEventListener("click", function (e) {
            e.stopPropagation();
            lyricsModal.classList.add("show");
        });
    }

    if (btnCloseLyrics && lyricsModal) {
        btnCloseLyrics.addEventListener("click", function () {
            lyricsModal.classList.remove("show");
        });
    }

    if (lyricsModal) {
        lyricsModal.addEventListener("click", function (e) {
            if (e.target === lyricsModal) {
                lyricsModal.classList.remove("show");
            }
        });
    }

    // -------------------------------------------------------------
    // 3. Theme Switcher (Theme 1: Royal Vedic vs Theme 2: Minimalist)
    // -------------------------------------------------------------
    const btnVedic = document.getElementById("btnThemeVedic");
    const btnMinimalist = document.getElementById("btnThemeMinimalist");

    function setTheme(theme) {
        if (theme === "minimalist") {
            document.body.classList.add("mode-minimalist");
            if (btnMinimalist) btnMinimalist.classList.add("active");
            if (btnVedic) btnVedic.classList.remove("active");
            localStorage.setItem("wedding_theme", "minimalist");
        } else {
            document.body.classList.remove("mode-minimalist");
            if (btnVedic) btnVedic.classList.add("active");
            if (btnMinimalist) btnMinimalist.classList.remove("active");
            localStorage.setItem("wedding_theme", "vedic");
        }
    }

    if (btnVedic) {
        btnVedic.addEventListener("click", function () {
            setTheme("vedic");
        });
    }

    if (btnMinimalist) {
        btnMinimalist.addEventListener("click", function () {
            setTheme("minimalist");
        });
    }

    const savedTheme = localStorage.getItem("wedding_theme");
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // -------------------------------------------------------------
    // 4. Live Countdown Timer (Target: 01 Feb 2027, 07:00 PM IST)
    // -------------------------------------------------------------
    const weddingDate = new Date("2027-02-01T19:00:00+05:30").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const elDays = document.getElementById("countDays");
            const elHours = document.getElementById("countHours");
            const elMinutes = document.getElementById("countMinutes");
            const elSeconds = document.getElementById("countSeconds");

            if (elDays) elDays.innerText = String(days).padStart(2, '0');
            if (elHours) elHours.innerText = String(hours).padStart(2, '0');
            if (elMinutes) elMinutes.innerText = String(minutes).padStart(2, '0');
            if (elSeconds) elSeconds.innerText = String(seconds).padStart(2, '0');
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // -------------------------------------------------------------
    // 5. Itinerary Tab Switching
    // -------------------------------------------------------------
    const itineraryPills = document.querySelectorAll(".itinerary-pill");
    const itineraryPanels = document.querySelectorAll(".itinerary-tab-panel");

    itineraryPills.forEach(pill => {
        pill.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");

            itineraryPills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");

            itineraryPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.style.display = "block";
                } else {
                    panel.style.display = "none";
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 6. Interactive FAQ Accordion
    // -------------------------------------------------------------
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const header = item.querySelector(".faq-header");
        if (header) {
            header.addEventListener("click", function () {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });

    // -------------------------------------------------------------
    // 7. Flower Petal Shower Buttons
    // -------------------------------------------------------------
    const petalBtns = document.querySelectorAll(".btn-trigger-petals");
    petalBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            triggerPetalShower(42);
            showWeddingToast("पुष्प वर्षा • Best blessings to the couple! 🌸", "💐");
        });
    });

    // -------------------------------------------------------------
    // 8. Native Web Share / Share Website Buttons
    // -------------------------------------------------------------
    const shareBtns = document.querySelectorAll(".btn-share-wedding");
    shareBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            shareWeddingWebsite();
        });
    });

    // -------------------------------------------------------------
    // 9. Wedding Hashtag Copy Buttons
    // -------------------------------------------------------------
    const hashtagBtns = document.querySelectorAll(".btn-copy-hashtag");
    hashtagBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const tag = this.getAttribute("data-hashtag") || "#KanikaWedsVikas";
            copyWeddingHashtag(tag);
        });
    });

    // -------------------------------------------------------------
    // 10. Wedding Photo Drive Multi-Select Gallery Upload Helper
    // -------------------------------------------------------------
    const btnSelectPhotos = document.getElementById("btnSelectPhotos");
    const guestPhotoPicker = document.getElementById("guestPhotoPicker");
    const selectedPhotosContainer = document.getElementById("selectedPhotosContainer");
    const selectedThumbnails = document.getElementById("selectedThumbnails");
    const selectedCountBadge = document.getElementById("selectedCountBadge");
    const btnClearSelection = document.getElementById("btnClearSelection");

    if (btnSelectPhotos && guestPhotoPicker) {
        btnSelectPhotos.addEventListener("click", function () {
            guestPhotoPicker.click();
        });
    }

    if (guestPhotoPicker) {
        guestPhotoPicker.addEventListener("change", function (e) {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) {
                if (selectedPhotosContainer) selectedPhotosContainer.style.display = "none";
                return;
            }

            if (selectedCountBadge) {
                selectedCountBadge.innerText = `✨ ${files.length} Photo${files.length > 1 ? 's' : ''} Selected!`;
            }
            if (selectedPhotosContainer) {
                selectedPhotosContainer.style.display = "block";
            }
            if (selectedThumbnails) {
                selectedThumbnails.innerHTML = "";
                files.slice(0, 12).forEach(function (file) {
                    if (file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = function (evt) {
                            const item = document.createElement("div");
                            item.className = "photo-preview-item";
                            item.innerHTML = `<img src="${evt.target.result}" alt="${escapeHtml(file.name)}">`;
                            selectedThumbnails.appendChild(item);
                        };
                        reader.readAsDataURL(file);
                    } else {
                        const item = document.createElement("div");
                        item.className = "photo-preview-item d-flex align-items-center justify-content-center bg-light text-muted";
                        item.innerHTML = `<i class="fas fa-video fa-lg text-primary"></i>`;
                        selectedThumbnails.appendChild(item);
                    }
                });
                if (files.length > 12) {
                    const moreItem = document.createElement("div");
                    moreItem.className = "photo-preview-item d-flex align-items-center justify-content-center bg-warning text-dark font-weight-bold";
                    moreItem.innerText = `+${files.length - 12} more`;
                    selectedThumbnails.appendChild(moreItem);
                }
            }
        });
    }

    if (btnClearSelection && guestPhotoPicker) {
        btnClearSelection.addEventListener("click", function () {
            guestPhotoPicker.value = "";
            if (selectedPhotosContainer) selectedPhotosContainer.style.display = "none";
            if (selectedThumbnails) selectedThumbnails.innerHTML = "";
        });
    }

    // -------------------------------------------------------------
    // 11. Offline Service Worker Registration
    // -------------------------------------------------------------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js').catch(function () {});
        });
    }
});
