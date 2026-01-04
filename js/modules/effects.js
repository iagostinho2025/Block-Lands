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

    // Método principal chamado pelo game.js
    showComboFeedback(lines, comboCount, type) {
        let text = "";
        let styleClass = "";

        // 1. TEXTO CENTRAL (Flash rápido: "WOW!", "GOOD!")
        // Se for 'normal', mostra os textos padrão de limpeza.
        // Se for boss, o 'type' virá como 'normal', então não mostrará WOW/HOLY COW.
        if (type === 'normal') {
            if (lines === 1) { text = "GOOD!"; styleClass = "text-good"; }
            else if (lines === 2) { text = "GREAT!"; styleClass = "text-great"; }
            else if (lines === 3) { text = "EXCELLENT!"; styleClass = "text-excellent"; }
            else { text = "PERFECT!"; styleClass = "text-perfect"; }
        } 
        else if (type === 'wow') {
            text = "WOW!";
            styleClass = "feedback-gold";
        }
        else if (type === 'holycow') {
            text = "HOLY COW!!";
            styleClass = "feedback-orange";
        }
        else if (type === 'unreal') {
            text = "UNREAL!!!";
            styleClass = "feedback-epic";
        }

        // Mostra o texto central
        this.showFloatingTextCentered(text, styleClass);

        // 2. HUD DE COMBO LATERAL (Pop-up rápido: "COMBO x2")
        // Se houver combo (2 ou mais), dispara o pop-up lateral.
        // Isso agora funciona para o modo Clássico E para o modo Boss.
        if (comboCount >= 2) {
            this.showComboPopUp(comboCount);
        }

        // Treme a tela em combos grandes
        if (comboCount >= 2 || lines >= 3) this.shakeScreen();
    }

    // Cria o elemento visual do combo que aparece e some rápido
    showComboPopUp(count) {
        if (!this.layer) return;

        const hud = document.createElement('div');
        hud.className = 'combo-hud-container';
        
        // Estrutura HTML: Label pequeno em cima, Número grande embaixo
        hud.innerHTML = `
            <span class="combo-hud-label">COMBO</span>
            <span class="combo-hud-value">x${count}</span>
        `;
        
        this.layer.appendChild(hud);

        // Remove o elemento do DOM assim que a animação CSS terminar (1 segundo)
        setTimeout(() => {
            hud.remove();
        }, 1000);
    }

    // Helper para criar o texto central no DOM
    showFloatingTextCentered(message, styleClass) {
        if (!this.layer || !message) return;

        const el = document.createElement('div');
        el.classList.add('floating-text');
        
        if (styleClass) el.classList.add(styleClass);
        
        el.innerText = message;
        el.style.left = '50%';
        el.style.top = '50%';

        this.layer.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 800);
    }

    shakeScreen() {
        const board = document.getElementById('game-board');
        if (board) {
            board.classList.remove('shake-screen');
            void board.offsetWidth;
            board.classList.add('shake-screen');
            setTimeout(() => {
                board.classList.remove('shake-screen');
            }, 500);
        }
    }
}