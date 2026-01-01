// js/app.js

// Importa a classe Game.
// Como app.js e game.js estão na mesma pasta ('js/'), o caminho é './game.js'
import { Game } from './game.js';

// Inicializa o Service Worker para PWA (Funcionalidade Offline)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('SW registrado', reg))
            .catch(err => console.log('SW falhou', err));
    });
}

// Inicia o Jogo quando o HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Cria a instância do jogo
    const game = new Game();

    // (Opcional) Expõe a variável para você poder testar comandos no console (ex: window.gameInstance.score = 5000)
    window.gameInstance = game;
});