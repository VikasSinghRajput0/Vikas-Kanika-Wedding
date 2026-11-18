/**
 * Kanika & Vikas Wedding - Custom Interactive Scripts
 * - "Tera Mera Lagan" (तेरा मेरा लग्न) Background Audio Player (Seamless Autoplay with Gesture Unlock)
 * - Dual Theme Switcher (Royal Vedic & Modern Minimalist)
 * - Live Countdown to Feb 01, 2027
 * - WhatsApp Instant RSVP
 * - Wishes & Blessings Wall
 * - Wedding Photo Drive & Multi-Select Gallery Upload Helper
 */

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
    // 2. Theme Switcher (Theme 1: Royal Vedic vs Theme 2: Minimalist)
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
    // 3. Live Countdown Timer (Target: 01 Feb 2027, 07:00 PM IST)
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
    // 4. Itinerary Tab Switching
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
    // 5. WhatsApp RSVP Form Integration
    // -------------------------------------------------------------
    const rsvpForm = document.getElementById("weddingRsvpForm");
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("rsvpName").value.trim();
            const phone = document.getElementById("rsvpPhone").value.trim();
            const guests = document.getElementById("rsvpGuests").value;
            const side = document.getElementById("rsvpSide").value;
            const message = document.getElementById("rsvpMessage").value.trim();

            if (!name) {
                alert("Please enter your name.");
                return;
            }

            const rsvpDetails = `Namaste! 🙏\n\n*Wedding RSVP for Kanika & Vikas (Feb 2027)*\n*Guest Name:* ${name}\n*Phone:* ${phone || 'N/A'}\n*Attending as:* ${side}\n*Number of Guests:* ${guests}\n*Message / Blessings:* ${message || 'Best wishes to the couple!'}`;

            const encoded = encodeURIComponent(rsvpDetails);
            const waUrl = `https://wa.me/918219877037?text=${encoded}`;
            window.open(waUrl, '_blank');

            const alertBox = document.getElementById("rsvpSuccessAlert");
            if (alertBox) {
                alertBox.style.display = "block";
                setTimeout(() => { alertBox.style.display = "none"; }, 5000);
            }
            rsvpForm.reset();
        });
    }

    // Direct WhatsApp Button
    const directWaBtn = document.getElementById("btnDirectWhatsApp");
    if (directWaBtn) {
        directWaBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const text = encodeURIComponent("Namaste! 🙏 We received your wedding invitation for Kanika & Vikas's wedding (Feb 2027, Hamirpur H.P.). Hearty congratulations and blessings to both families!");
            window.open(`https://wa.me/918219877037?text=${text}`, '_blank');
        });
    }

    // -------------------------------------------------------------
    // 6. Digital Shagun (GPay / UPI Copy Handler)
    // -------------------------------------------------------------
    const btnCopyUpi = document.getElementById("btnCopyUpi");
    if (btnCopyUpi) {
        btnCopyUpi.addEventListener("click", function () {
            const upiId = "vk440231-1@oksbi";
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(upiId).then(function () {
                    const originalHtml = btnCopyUpi.innerHTML;
                    btnCopyUpi.innerHTML = '<i class="fas fa-check text-success mr-1"></i> Copied!';
                    btnCopyUpi.classList.add("btn-success");
                    btnCopyUpi.classList.remove("btn-outline-warning");
                    setTimeout(function () {
                        btnCopyUpi.innerHTML = originalHtml;
                        btnCopyUpi.classList.remove("btn-success");
                        btnCopyUpi.classList.add("btn-outline-warning");
                    }, 2500);
                }).catch(function () {
                    prompt("Copy UPI ID:", upiId);
                });
            } else {
                prompt("Copy UPI ID:", upiId);
            }
        });
    }

    // -------------------------------------------------------------
    // 7. Wedding Photo Drive & Multi-Select Gallery Upload Helper
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
});
