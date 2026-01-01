export class EffectsSystem {
    constructor() {
        this.layer = document.getElementById('effects-layer');
        
        // Segurança: Cria a camada se ela não existir
        if (!this.layer) {
            this.layer = document.createElement('div');
            this.layer.id = 'effects-layer';
            const app = document.getElementById('app') || document.body;
            app.appendChild(this.layer);
        }
    }

    // Nota: removemos os parâmetros x, y pois não serão mais usados
    showFeedback(count) {
        if (!this.layer) return;

        const text = document.createElement('div');
        text.classList.add('floating-text');
        
        // Define o texto baseado no combo
        if (count === 1) {
            text.innerText = "GOOD!";
            text.classList.add('text-good');
        } else if (count === 2) {
            text.innerText = "GREAT!";
            text.classList.add('text-great');
        } else if (count === 3) {
            text.innerText = "EXCELLENT!";
            text.classList.add('text-excellent');
        } else {
            text.innerText = "PERFECT!";
            text.classList.add('text-perfect');
        }

        // --- CENTRALIZAÇÃO ---
        // Fixa a posição no centro exato do container de efeitos.
        // O CSS (.floating-text) já possui "transform: translate(-50%, -50%)"
        // que garante que o ponto central do texto fique nessas coordenadas.
        text.style.left = '50%';
        text.style.top = '50%';

        this.layer.appendChild(text);

        // Remove o elemento após a animação (0.8s é o tempo da animação popUp no CSS)
        setTimeout(() => {
            text.remove();
        }, 800);
        
        // Treme a tela em combos grandes (2 ou mais linhas)
        if (count >= 2) this.shakeScreen();
    }

    shakeScreen() {
        const board = document.getElementById('game-board');
        if (board) {
            // Reinicia a animação removendo e readicionando a classe
            board.classList.remove('shake-screen');
            void board.offsetWidth; // Força o navegador a recalcular o layout (truque para reiniciar animação CSS)
            board.classList.add('shake-screen');
            
            // Remove a classe depois que tremer (0.5s é o tempo médio de uma animação de shake)
            setTimeout(() => {
                board.classList.remove('shake-screen');
            }, 500);
        }
    }
}