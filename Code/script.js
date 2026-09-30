"use strict";

const screens = Array.from(document.querySelectorAll('.screen'));
const audioTalkback = document.getElementById('audio-talkback');
const mainImage = document.getElementById('main-image');
const locationHint = document.getElementById('location-hint');

let currentScreen = 'home';
let previousScreen = 'mapa'; // Guarda de onde o usuário veio
let currentZoom = 1;
let touchStartX = 0;
let touchStartY = 0;

// === BANCO DE DADOS DOS LOCAIS (Para gerar páginas dinâmicas) ===
const locationDB = {
    "laboratorio de optica": {
        title: "Laboratório de Óptica",
        thumb: "assets/images/thumb_optica.svg",
        desc: "Vídeo do caminho para o Laboratório de Óptica."
    },
    "espaço de convivência": {
        title: "Espaço de Convivência",
        thumb: "assets/images/thumb_convivencia.svg",
        desc: "Vídeo do caminho até o Espaço de Convivência."
    },
    "biblioteca": {
        title: "Biblioteca",
        thumb: "assets/images/thumb_biblioteca.svg",
        desc: "Vídeo do caminho até a Biblioteca."
    },
    "banheiro masculino e feminino": {
        title: "Banheiros (Fem/Masc)",
        thumb: "assets/images/thumb_banheiros.svg",
        desc: "Vídeo indicando os Banheiros do Térreo."
    },
    
    // NOTA: Você pode adicionar todos os locais aqui conforme for criando os vídeos reais!
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

    // Se estiver saindo de uma tela de andar para o vídeo, guarda o andar!
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

// === FUNÇÃO NOVA QUE MUDA A TELA DEPENDENDO DE ONDE CLICOU ===
function showVideo(locationID, locationName) {
    playTalkback(`Mostrando como chegar em ${locationName}`);
    
    // Procura no banco de dados. Se não achar, usa um "padrão genérico" provisório.
    const key = locationID.toLowerCase();
    const data = locationDB[key] || {
        title: locationName, // Usa o nome real do botão clicado!
        thumb: "assets/images/placeholder_mapa.svg",
        video: "assets/videos/video_tutorial.mp4",
        desc: `Vídeo indicando o caminho para: ${locationName}`
    };

    // Atualiza o HTML dinamicamente com os dados novos
    document.getElementById('video-titulo-local').textContent = `Como chegar: ${data.title}`;
    document.getElementById('video-desc').textContent = data.desc;
    
    const videoThumb = document.getElementById('video-thumb');
    const videoPlayer = document.getElementById('video-player');
    const videoSource = document.getElementById('video-source');

    videoThumb.src = data.thumb;
    videoPlayer.poster = data.thumb;
    videoSource.src = data.video;

    // Recarrega o player de vídeo para aceitar o arquivo novo
    videoPlayer.load();

    // Navega para a tela de vídeos adaptada
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

    // Clique em qualquer Local/Card de Andar
    document.querySelectorAll('.location-card[data-location]').forEach((button) => {
        button.addEventListener('click', () => {
            const locationID = button.dataset.location; 
            const locationName = button.textContent.trim(); // Pega o nome visível do botão
            
            setLocationHint(`Você selecionou ${locationName}.`);
            
            // Chama a função passando a ID e o Nome
            showVideo(locationID, locationName);
        });
    });

    // Botão Voltar da tela de vídeo
    const btnVoltarAndar = document.getElementById('btn-voltar-andar');
    if (btnVoltarAndar) {
        btnVoltarAndar.addEventListener('click', () => {
            goTo(previousScreen); // Volta pro andar que ele estava!
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
            const video = document.getElementById('video-player');
            if (video) {
                video.scrollIntoView({ behavior: 'smooth', block: 'center' });
                video.play().catch(() => {});
            }
        });
    }
}

document.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    if (touch) {
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }
}, { passive: true });

document.addEventListener('touchend', (event) => {
    const changedTouch = event.changedTouches[0];
    if (!changedTouch) return;
    const dx = changedTouch.clientX - touchStartX;
    const dy = changedTouch.clientY - touchStartY;

    if (Math.abs(dx) > 100 && Math.abs(dy) < 50) {
        if (dx < 0) playTalkback('Deslizando para o próximo item');
        else playTalkback('Deslizando para o item anterior');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    goTo('home');
});