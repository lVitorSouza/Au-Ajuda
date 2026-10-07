"use strict";

const screens = Array.from(document.querySelectorAll('.screen'));
const audioTalkback = document.getElementById('audio-talkback');
const mainImage = document.getElementById('main-image');
const locationHint = document.getElementById('location-hint');

let currentScreen = 'home';
let previousScreen = 'mapa';
let currentZoom = 1;

// Banco de dados adaptado com os botões e vídeos MP4 diretos
const locationDB = {
    // === VÍDEOS MP4 DOS ANDARES ===
    "vídeo térreo": {
        title: "Vídeo do Térreo",
        thumb: "https://i.postimg.cc/SNjDn8WD/1000480957.jpg",
        videoSrc: "terreo.mp4", // Troque para o caminho do seu MP4
        desc: "Tour completo de navegação do Térreo em vídeo."
    },
    "vídeo 1° andar": {
        title: "Vídeo do 1º Andar",
        thumb: "https://i.postimg.cc/t4wYy1b0/1000481184.jpg",
        videoSrc: "1 andar.mp4", // Troque para o caminho do seu MP4
        desc: "Tour completo de navegação do 1º Andar em vídeo."
    },
    "vídeo 2° andar": {
        title: "Vídeo do 2º Andar",
        thumb: "https://i.postimg.cc/d1Rb3dcZ/1000208146.jpg",
        videoSrc: "2 andar.mp4", // Troque para o caminho do seu MP4
        desc: "Tour completo de navegação do 2º Andar em vídeo."
    },
    "vídeo 3° andar": {
        title: "Vídeo do 3º Andar",
        thumb: "https://i.postimg.cc/KcqcxSGW/IMG-6153.jpg",
        videoSrc: "3 andar.mp4", // Troque para o caminho do seu MP4
        desc: "Tour completo de navegação do 3º Andar em vídeo."
    },

    // === LOCAIS DO TÉRREO ===
    "espaço de convivencia": {
        title: "Espaço de Convivência",
        thumb: "https://i.postimg.cc/kg8V6t0g/IMG-2862.jpg",
        images: ["https://i.postimg.cc/Sx8X2zBQ/IMG-2863.jpg", "https://i.postimg.cc/kg8V6t0g/IMG-2862.jpg"],
        desc: "Imagens do caminho até o Espaço de Convivência."
    },
    "central de informacoes e matriculas": {
        title: "Central de Informações",
        thumb: "https://i.postimg.cc/ZK0VW3rB/1000480941.jpg",
        images: ["https://i.postimg.cc/kg8V6t0X/IMG-2864.jpg", "https://i.postimg.cc/9FzJDTGP/1000480955.jpg"],
        desc: "Imagens do caminho até a Central de Informações."
    },
    "cantina": {
        title: "Cantina",
        thumb: "https://i.postimg.cc/kMTTMwt7/1000480920.jpg",
        images: ["https://i.postimg.cc/2j00jTBj/1000480924.jpg", "https://i.postimg.cc/kMTTMwt7/1000480920.jpg"],
        desc: "Imagens do caminho até a Cantina."
    },
    "biblioteca": {
        title: "Biblioteca",
        thumb: "https://i.postimg.cc/nV33VTQH/1000480921.jpga",
        images: ["https://i.postimg.cc/CMccMJfL/1000480919.jpga", "https://i.postimg.cc/nV33VTQH/1000480921.jpga"],
        desc: "Imagens do caminho até a Biblioteca."
    },
    "banheiro masculino e feminino": {
        title: "Banheiros (Fem/Masc)",
        thumb: "https://i.postimg.cc/yddwXKmN/IMG-2877.jpg",
        images: ["https://i.postimg.cc/3RRPChXd/IMG-2878.jpg", "https://i.postimg.cc/yddwXKmN/IMG-2877.jpg"],
        desc: "Imagens indicando os Banheiros do Térreo."
    },
    "salao de beleza": {
        title: "Salão de Beleza",
        thumb: "https://i.postimg.cc/mD5Kmnj7/IMG-2879.jpg",
        images: ["https://i.postimg.cc/MTFg9Ltk/IMG-2881.jpg", "https://i.postimg.cc/mD5Kmnj7/IMG-2879.jpg"],
        desc: "Imagens do caminho até o Salão de Beleza."
    },
    "cozinhaescola": {
        title: "Cozinha Escola",
        thumb: "https://i.postimg.cc/Y9sTdPRT/IMG-2882.jpg",
        images: ["https://i.postimg.cc/ydb2LGn4/IMG-2883.jpg", "https://i.postimg.cc/Y9sTdPRT/IMG-2882.jpg"],
        desc: "Imagens do caminho até a Cozinha Escola."
    },
    "laboratorio de optica": {
        title: "Laboratório de Óptica",
        thumb: "https://i.postimg.cc/sXNbTLKR/IMG-2884.jpg",
        images: ["https://i.postimg.cc/mk1JJSp6/IMG-2885.jpg", "https://i.postimg.cc/sXNbTLKR/IMG-2884.jpg"],
        desc: "Imagens do caminho para o Laboratório de Óptica."
    },
    "estacionamento inferior": {
        title: "Estacionamento Inferior",
        thumb: "https://i.postimg.cc/yY2g8Trp/IMG-2857.jpgr",
        images: ["https://i.postimg.cc/sDbQgJ06/IMG-2858.jpg", "https://i.postimg.cc/yY2g8Trp/IMG-2857.jpg"],
        desc: "Imagens do caminho até o Estacionamento Inferior."
    },
    "estacionamento superior": {
        title: "Estacionamento Superior",
        thumb: "https://i.postimg.cc/13xXQ3fv/IMG-2853.jpg",
        images: ["https://i.postimg.cc/Z5knS5Cj/IMG-2854.jpg", "https://i.postimg.cc/13xXQ3fv/IMG-2853.jpg"],
        desc: "Imagens do caminho até o Estacionamento Superior."
    },
    "sala de reunioes": {
        title: "Sala de Reuniões",
        thumb: "https://i.postimg.cc/qq6SSGD9/IMG-2886.jpg",
        images: ["https://i.postimg.cc/qq6SSGD9/IMG-2886.jpg", "https://i.postimg.cc/sDbQgJ0w/IMG-2859.jpg"],
        desc: "Imagens do caminho até a Sala de Reuniões."
    },

    // === LOCAIS 1º ANDAR ===
    "salas de aula": { 
        title: "Salas de Aula",
        thumb: "https://i.postimg.cc/zGVV9Csr/1000481145.jpg",
        images: ["https://i.postimg.cc/SxJJw6Bp/1000481181.jpg", "https://i.postimg.cc/y8tkBJHr/1000481182.jpg", 
            "https://i.postimg.cc/132fPgQT/1000481183.jpg", "https://i.postimg.cc/t4wYy1b0/1000481184.jpg", "https://i.postimg.cc/x1hcYkQ9/1000481186.jpg"],
        desc: "Imagens do caminho até as Salas de Aula."
    },

    // === LOCAIS 2º ANDAR & 3º ANDAR ===
    "sala de aula": { 
        title: "Sala de Aula",
        thumb: "https://i.postimg.cc/h4y4cWDw/IMG-6154.jpg",
        images: ["https://i.postimg.cc/h4y4cWDw/IMG-6154.jpg", "https://i.postimg.cc/4dvDytR9/1000208145.jpg", "https://i.postimg.cc/d1Rb3dcZ/1000208146.jpg",
             "https://i.postimg.cc/V69xvMPD/1000208149.jpg", "https://i.postimg.cc/tTdKJPGP/1000208141.jpg"],
        desc: "Imagens do caminho até a Sala de Aula."
    },
    "auditório": { 
        title: "Auditório",
        thumb: "https://i.postimg.cc/KcqcxSGW/IMG-6153.jpg",
        images: ["https://i.postimg.cc/KcqcxSGW/IMG-6153.jpg", "https://i.postimg.cc/KcqcxSGW/IMG-6153.jpg"],
        desc: "Imagens do caminho até o Auditório."
    }
};

function setLocationHint(message) {
    if (locationHint) {
        locationHint.textContent = message;
    }
}

function playTalkback(message) {
    const safeMessage = message || 'Sem descrição adicional';
    console.log(`TalkBack: ${safeMessage}`);
    if (!audioTalkback) return;
    try {
        audioTalkback.currentTime = 0;
        audioTalkback.play().catch(() => {});
    } catch (error) {
        console.log('Erro ao executar o TalkBack:', error);
    }
}

function resetZoom() {
    currentZoom = 1;
    if (mainImage) mainImage.style.transform = 'scale(1)';
}

function goTo(screenId) {
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) return;

    if (screenId === 'video' && currentScreen !== 'video') {
        previousScreen = currentScreen;
    }

    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.setAttribute('aria-hidden', 'true');
    });

    targetScreen.classList.add('active');
    targetScreen.setAttribute('aria-hidden', 'false');
    currentScreen = screenId;

    document.querySelectorAll('.side-btn, .nav-btn').forEach((button) => {
        const isActive = button.dataset.target === screenId;
        button.classList.toggle('active', isActive);
    });

    const screenLabel = {
        home: 'inicial', mapa: 'mapa da unidade', térreo: 'térreo',
        andar1: 'primeiro andar', andar2: 'segundo andar', 
        andar3: 'terceiro andar', video: 'detalhes do local'
    };

    playTalkback(`Você está na tela ${screenLabel[screenId] || screenId}`);
    resetZoom();
}

function showMedia(locationID, locationName) {
    const key = locationID.toLowerCase().trim();
    const isVideo = key.includes('vídeo') || key.includes('video');

    playTalkback(`Mostrando ${isVideo ? 'vídeo' : 'imagens'} para ${locationName}`);
    
    const titleEl = document.getElementById('video-titulo-local');
    const descEl = document.getElementById('video-desc');
    const thumbEl = document.getElementById('video-thumb');
    const mediaContainer = document.querySelector('.media-video-item');

    if (isVideo) {
        // Puxa as informações únicas do vídeo diretamente do locationDB, ou define um fallback.
        const data = locationDB[key] || {
            title: locationName,
            thumb: `https://placehold.co/300x200/d89b2f/white?text=Capa+${encodeURIComponent(locationName)}`,
            videoSrc: "assets/videos/video_tutorial.mp4",
            desc: "Assista ao vídeo em MP4 para este andar."
        };

        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (thumbEl) thumbEl.src = data.thumb;

        if (mediaContainer) {
            mediaContainer.innerHTML = `
                <video id="video-player" controls preload="metadata" poster="${data.thumb}" style="width: 100%; border-radius: 10px; object-fit: cover;">
                    <source id="video-source" src="${data.videoSrc}" type="video/mp4">
                    Seu navegador não suporta vídeos em HTML5.
                </video>
            `;
        }
    } else {
        const data = locationDB[key] || {
            title: locationName, 
            thumb: `https://placehold.co/300x200/f3c06d/white?text=Thumb+${encodeURIComponent(locationName)}`,
            images: [
                `https://placehold.co/800x450/d89b2f/white?text=Caminho+1:+${encodeURIComponent(locationName)}`,
                 `https://placehold.co/800x450/d89b2f/white?text=Caminho+2:+${encodeURIComponent(locationName)}`,
                `https://placehold.co/800x450/d89b2f/white?text=Caminho+3:+${encodeURIComponent(locationName)}`,
                `https://placehold.co/800x450/d89b2f/white?text=Caminho+4:+${encodeURIComponent(locationName)}`,

            ],
            desc: `Imagens indicando o caminho para: ${locationName}`
        };

        if (titleEl) titleEl.textContent = `Como chegar: ${data.title}`;
        if (descEl) descEl.textContent = data.desc;
        if (thumbEl) thumbEl.src = data.thumb;

        if (mediaContainer) {
            mediaContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <img class="image-player" 
                         src="${data.images[0]}" 
                         alt="${data.desc} Parte 1" 
                         style="width: 100%; border-radius: 10px; object-fit: cover;">
                    <img class="image-player" 
                         src="${data.images[1]}" 
                         alt="${data.desc} Parte 2" 
                         style="width: 100%; border-radius: 10px; object-fit: cover;">
                </div>
            `;
        }
    }

    goTo('video');
}

function zoomImage(factor) {
    currentZoom = Math.min(Math.max(currentZoom * factor, 0.5), 3);
    if (mainImage) mainImage.style.transform = `scale(${currentZoom})`;
}

function handleLibrasClick() {
    playTalkback('Abrindo assistente de Libras');
    alert('O Assistente de Libras será iniciado. (Simulação)');
}

function bindEvents() {
    document.querySelectorAll('[data-target]').forEach((button) => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            if (target) goTo(target);
        });
    });

    document.querySelectorAll('[data-zoom]').forEach((button) => {
        button.addEventListener('click', () => {
            const factor = Number(button.dataset.zoom || 1);
            zoomImage(factor);
        });
    });

    document.querySelectorAll('.location-card[data-location]').forEach((button) => {
        button.addEventListener('click', () => {
            const locationID = button.dataset.location; 
            const locationName = button.textContent.trim();
            
            setLocationHint(`Você selecionou ${locationName}.`);
            showMedia(locationID, locationName);
        });
    });

    const btnVoltarAndar = document.getElementById('btn-voltar-andar');
    if (btnVoltarAndar) {
        btnVoltarAndar.addEventListener('click', () => {
            goTo(previousScreen); 
        });
    }

    const librasImage = document.getElementById('libras-image');
    if (librasImage) librasImage.addEventListener('click', handleLibrasClick);

    const zoomInBtn = document.getElementById('btn-zoom-in');
    const zoomOutBtn = document.getElementById('btn-zoom-out');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            document.body.style.fontSize = '1.1em';
            playTalkback('Fonte aumentada');
        });
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            document.body.style.fontSize = '0.95em';
            playTalkback('Fonte reduzida');
        });
    }

    const videoThumbContainer = document.getElementById('video-thumb-container');
    if (videoThumbContainer) {
        videoThumbContainer.addEventListener('click', () => {
            const videoPlayer = document.getElementById('video-player');
            const imagePlayer = document.querySelector('.image-player');
            
            if (videoPlayer) {
                videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                videoPlayer.play().catch(() => {});
            } else if (imagePlayer) {
                imagePlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}

function setupImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('expanded-image');
    const closeModal = document.getElementById('close-modal');

    if (!modal || !modalImg || !closeModal) return;

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('image-player')) {
            modal.classList.add('show');
            modalImg.src = e.target.src;
            modalImg.alt = e.target.alt;
            playTalkback('Imagem expandida em tela cheia');
        }
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('show');
        playTalkback('Imagem fechada');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
}

function initApp() {
    bindEvents();
    setupImageModal(); 
    goTo('home');

    const sidebar = document.querySelector('.sidebar');
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function toggleMenu() {
        if(sidebar && sidebarOverlay) {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('active');
        }
    }

    if (btnMobileMenu) btnMobileMenu.addEventListener('click', toggleMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}