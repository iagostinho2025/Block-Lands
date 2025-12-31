import { Game } from './game.js';

// Inicializa o Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('SW registrado', reg))
            .catch(err => console.log('SW falhou', err));
    });
}

// Inicia o Jogo
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});