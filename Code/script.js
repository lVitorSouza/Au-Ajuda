"use strict";

const screens = Array.from(document.querySelectorAll('.screen'));
const audioTalkback = document.getElementById('audio-talkback');
const mainImage = document.getElementById('main-image');
const locationHint = document.getElementById('location-hint');

let currentScreen = 'home';
let previousScreen = 'mapa'; 
let currentZoom = 1;
let touchStartX = 0;
let touchStartY = 0;

// Banco de dados para exibir a API de imagens nos locais comuns
const locationDB = {
    "laboratorio de optica": {
        title: "Laboratório de Óptica",
        thumb: "https://placehold.co/300x200/d89b2f/white?text=Thumb+Optica",
        image: "https://placehold.co/800x450/034C8C/white?text=Caminho:+Laboratorio+de+Optica",
        desc: "Imagem do caminho para o Laboratório de Óptica."
    },
    "espaço de convivencia": {
        title: "Espaço de Convivência",
        thumb: "https://placehold.co/300x200/d89b2f/white?text=Thumb+Convivencia",
        image: "https://placehold.co/800x450/034C8C/white?text=Caminho:+Espaco+de+Convivencia",
        desc: "Imagem do caminho até o Espaço de Convivência."
    },
    "biblioteca": {
        title: "Biblioteca",
        thumb: "https://placehold.co/300x200/d89b2f/white?text=Thumb+Biblioteca",
        image: "https://placehold.co/800x450/034C8C/white?text=Caminho:+Biblioteca",
        desc: "Imagem do caminho até a Biblioteca."
    },
    "banheiro masculino e feminino": {
        title: "Banheiros (Fem/Masc)",
        thumb: "https://placehold.co/300x200/d89b2f/white?text=Thumb+Banheiros",
        image: "https://placehold.co/800x450/034C8C/white?text=Caminho:+Banheiros",
        desc: "Imagem indicando os Banheiros do Térreo."
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

// Função inteligente: Mantém vídeos para cards de vídeo e usa API de imagem para os demais
function showMedia(locationID, locationName) {
    const key = locationID.toLowerCase();
    const isVideo = key.includes('vídeo') || key.includes('video');

    playTalkback(`Mostrando ${isVideo ? 'vídeo' : 'imagem'} para ${locationName}`);
    
    const titleEl = document.getElementById('video-titulo-local');
    const descEl = document.getElementById('video-desc');
    const thumbEl = document.getElementById('video-thumb');
    const mediaContainer = document.querySelector('.media-video-item');

    if (isVideo) {
        const videoSrc = "assets/videos/video_tutorial.mp4";
        const thumbSrc = `https://placehold.co/300x200/d89b2f/white?text=Capa+${encodeURIComponent(locationName)}`;

        if (titleEl) titleEl.textContent = locationName;
        if (descEl) descEl.textContent = `Assista ao vídeo para chegar ao seu destino.`;
        if (thumbEl) thumbEl.src = thumbSrc;

        if (mediaContainer) {
            mediaContainer.innerHTML = `
                <video id="video-player" controls preload="metadata" poster="${thumbSrc}" style="width: 100%; border-radius: 10px; object-fit: cover;">
                    <source id="video-source" src="${videoSrc}" type="video/mp4">
                    Seu navegador não suporta vídeos em HTML5.
                </video>
            `;
        }
    } else {
        const data = locationDB[key] || {
            title: locationName, 
            thumb: `https://placehold.co/300x200/f3c06d/white?text=Thumb+${encodeURIComponent(locationName)}`,
            image: `https://placehold.co/800x450/d89b2f/white?text=Caminho:+${encodeURIComponent(locationName)}`,
            desc: `Imagem indicando o caminho para: ${locationName}`
        };

        if (titleEl) titleEl.textContent = `Como chegar: ${data.title}`;
        if (descEl) descEl.textContent = data.desc;
        if (thumbEl) thumbEl.src = data.thumb;

        if (mediaContainer) {
            mediaContainer.innerHTML = `
                <img id="image-player" 
                     src="${data.image}" 
                     alt="${data.desc}" 
                     style="width: 100%; border-radius: 10px; object-fit: cover;">
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
            const imagePlayer = document.getElementById('image-player');
            
            if (videoPlayer) {
                videoPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                videoPlayer.play().catch(() => {});
            } else if (imagePlayer) {
                imagePlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}

// Controle do Menu Mobile (Hambúrguer)
document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
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
});