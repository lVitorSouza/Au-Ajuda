const screens = Array.from(document.querySelectorAll('.screen')) as HTMLElement[];
const audioTalkback = document.getElementById('audio-talkback') as HTMLAudioElement | null;
const mainImage = document.getElementById('main-image') as HTMLImageElement | null;
const locationHint = document.getElementById('location-hint') as HTMLElement | null;

let currentScreen: string = 'home';
let currentZoom: number = 1;
let touchStartX: number = 0;
let touchStartY: number = 0;

function setLocationHint(message: string): void {
    if (locationHint) {
        locationHint.textContent = message;
    }
}

function playTalkback(message: string): void {
    const safeMessage = message || 'Sem descrição adicional';
    console.log(`TalkBack: ${safeMessage}`);

    if (!audioTalkback) return;
    try {
        audioTalkback.currentTime = 0;
        audioTalkback.play().catch(() => {
            console.log('Áudio do TalkBack não disponível no momento.');
        });
    } catch (error) {
        console.log('Erro ao executar o TalkBack:', error);
    }
}

function resetZoom(): void {
    currentZoom = 1;
    if (mainImage) mainImage.style.transform = 'scale(1)';
}

function goTo(screenId: string): void {
    const targetScreen = document.getElementById(screenId) as HTMLElement | null;
    if (!targetScreen) return;

    screens.forEach((screen) => {
        screen.classList.remove('active');
        screen.setAttribute('aria-hidden', 'true');
    });

    targetScreen.classList.add('active');
    targetScreen.setAttribute('aria-hidden', 'false');
    currentScreen = screenId;

    document.querySelectorAll('.side-btn, .nav-btn').forEach((button) => {
        const btn = button as HTMLElement;
        const isActive = btn.dataset.target === screenId;
        btn.classList.toggle('active', isActive);
    });

    const screenLabel: { [key: string]: string } = {
        home: 'inicial', mapa: 'mapa da unidade', térreo: 'térreo',
        andar1: 'primeiro andar', andar2: 'segundo andar', 
        andar3: 'terceiro andar', video: 'vídeos e imagens'
    };

    if (screenId === 'mapa') setLocationHint('Escolha um andar para ver onde encontrar recepção, salas e apoio.');
    else if (screenId === 'térreo') setLocationHint('No térreo, você pode ir para recepção, espaço de convivência, etc.');
    else if (screenId === 'andar1') setLocationHint('No 1º andar, você pode ir para salas de aula e banheiros.');
    else if (screenId === 'andar2') setLocationHint('No 2º andar, há salas de aula, bebedouro e banheiros.');
    else if (screenId === 'andar3') setLocationHint('No 3º andar, você encontra salas de aula e auditório.');

    playTalkback(`Você está na tela ${screenLabel[screenId] || screenId}`);
    resetZoom();
}

function zoomImage(factor: number): void {
    currentZoom = Math.min(Math.max(currentZoom * factor, 0.5), 3);
    if (mainImage) mainImage.style.transform = `scale(${currentZoom})`;
    playTalkback(`Imagem ajustada para ${currentZoom.toFixed(1)} vezes`);
}

function showVideo(location: string): void {
    playTalkback(`Mostrando informações sobre ${location}`);
    goTo('video');
    const video = document.querySelector('video') as HTMLVideoElement | null;
    if (video) video.play().catch(() => console.log('Vídeo não iniciou.'));
}

function handleLibrasClick(): void {
    playTalkback('Abrindo assistente de Libras');
    alert('O Assistente de Libras será iniciado. (Simulação)');
}

function bindEvents(): void {
    document.querySelectorAll('[data-target]').forEach((button) => {
        button.addEventListener('click', () => {
            const target = (button as HTMLElement).dataset.target;
            if (target) goTo(target);
        });
    });

    document.querySelectorAll('[data-zoom]').forEach((button) => {
        button.addEventListener('click', () => {
            const factor = Number((button as HTMLElement).dataset.zoom || 1);
            zoomImage(factor);
        });
    });

    document.querySelectorAll('.location-card[data-location]').forEach((button) => {
        button.addEventListener('click', () => {
            const location = (button as HTMLElement).dataset.location || button.textContent?.trim() || '';
            setLocationHint(`Você selecionou ${location}. Acesse os vídeos.`);
            showVideo(location);
        });
    });

    const librasImg = document.getElementById('libras-image');
    if (librasImg) librasImg.addEventListener('click', handleLibrasClick);
}

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    goTo('home');
});