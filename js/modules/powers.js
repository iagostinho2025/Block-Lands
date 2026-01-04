export class PowersSystem {
    constructor(game) {
        this.game = game; // Acesso ao Game principal
    }

    // Gerenciador central de cliques no tabuleiro
    handleBoardInteraction(mode, r, c) {
        switch (mode) {
            case 'bomb':
                return this.useBomb(r, c);
            case 'hero_thalion':
                return this.useThalion(r, c);
            case 'hero_nyx':
                return this.useNyx(r, c);
            case 'hero_player':
                return this.usePlayer(r, c);
            default:
                return false;
        }
    }

    // --- 1. BOMBA (Área 3x3) ---
    useBomb(centerR, centerC) {
        let exploded = false;
        const size = this.game.gridSize;

        for (let r = centerR - 1; r <= centerR + 1; r++) {
            for (let c = centerC - 1; c <= centerC + 1; c++) {
                if (r >= 0 && r < size && c >= 0 && c < size) {
                    if (this.game.grid[r][c]) {
                        this.triggerVisual(r, c, 'type-fire'); // Vermelho
                        this.game.collectItem(r, c, this.game.grid[r][c]);
                        this.game.grid[r][c] = null;
                        exploded = true;
                    }
                }
            }
        }

        if (exploded) {
            this.game.powerUps.bomb--;
            this.game.savePowerUps();
            if(this.game.audio) this.game.audio.playClear(2);
            this.finalizeMove();
            return true;
        }
        return false;
    }

    // --- 2. THALION (Horizontal - 3 Blocos) ---
    useThalion(r, c) {
        let hit = false;
        const size = this.game.gridSize;

        // Loop: Esquerda, Centro, Direita
        for (let targetC = c - 1; targetC <= c + 1; targetC++) {
            if (targetC >= 0 && targetC < size) {
                if (this.game.grid[r][targetC]) {
                    this.triggerVisual(r, targetC, 'type-forest'); // Verde
                    this.game.collectItem(r, targetC, this.game.grid[r][targetC]);
                    this.game.grid[r][targetC] = null;
                    hit = true;
                }
            }
        }

        if (hit) {
            if(this.game.audio) this.game.audio.playArrow();
            this.consumeHeroPower('thalion');
            this.finalizeMove();
            return true;
        } else {
            this.playError();
            return false;
        }
    }

    // --- 3. NYX (Vertical - Coluna Inteira) ---
    // ALTERADO: Agora varre a COLUNA (r mudando), não a linha.
    useNyx(r, c) {
        let hit = false;
        const size = this.game.gridSize;

        // Loop: A coluna inteira (0 a 7 na coluna c)
        for (let targetR = 0; targetR < size; targetR++) {
            if (this.game.grid[targetR][c]) {
                this.triggerVisual(targetR, c, 'type-ice'); // Azul
                this.game.collectItem(targetR, c, this.game.grid[targetR][c]);
                this.game.grid[targetR][c] = null;
                hit = true;
            }
        }

        if (hit) {
            if(this.game.audio) this.game.audio.playWolf();
            this.consumeHeroPower('nyx');
            this.finalizeMove();
            return true;
        } else {
            this.playError();
            return false;
        }
    }

    // --- 4. JOGADOR (Corte em X Sequencial) ---
    // ALTERADO: Golpe duplo em diagonal
    usePlayer(centerR, centerC) {
        let hitAny = false;
        const size = this.game.gridSize;

        // Grupo 1: Diagonal Principal (Esquerda-Cima p/ Direita-Baixo) + Centro
        const slash1 = [
            { r: centerR - 1, c: centerC - 1 },
            { r: centerR,     c: centerC },
            { r: centerR + 1, c: centerC + 1 }
        ];

        // Grupo 2: Diagonal Secundária (Direita-Cima p/ Esquerda-Baixo) - Sem centro (já foi)
        const slash2 = [
            { r: centerR - 1, c: centerC + 1 },
            { r: centerR + 1, c: centerC - 1 }
        ];

        // Função auxiliar para processar lista de blocos
        const processHit = (list) => {
            let localHit = false;
            list.forEach(pos => {
                if (pos.r >= 0 && pos.r < size && pos.c >= 0 && pos.c < size) {
                    if (this.game.grid[pos.r][pos.c]) {
                        this.triggerVisual(pos.r, pos.c, 'type-mountain'); // Cinza/Prata
                        this.game.collectItem(pos.r, pos.c, this.game.grid[pos.r][pos.c]);
                        this.game.grid[pos.r][pos.c] = null;
                        localHit = true;
                        hitAny = true;
                    }
                }
            });
            return localHit;
        };

        // GOLPE 1
        const hit1 = processHit(slash1);
        
        // Se acertou algo no primeiro golpe ou o centro era válido (mesmo vazio, conta a intenção)
        // Mas para gastar o poder, ideal é ter acertado algo.
        // Vamos permitir que o segundo golpe aconteça mesmo se o primeiro falhar, se houver algo no X.
        
        // Verifica se tem algo no segundo golpe para decidir se consome
        const hasTargetsInSlash2 = slash2.some(pos => 
            pos.r >= 0 && pos.r < size && pos.c >= 0 && pos.c < size && this.game.grid[pos.r][pos.c]
        );

        if (hit1 || hasTargetsInSlash2) {
            // Toca som e consome
            if(this.game.audio) this.game.audio.playSword();
            this.consumeHeroPower('player');
            
            // Renderiza o primeiro corte
            this.game.renderGrid();
            
            // AGENDA O GOLPE 2 (Sequência)
            setTimeout(() => {
                processHit(slash2);
                
                // Finaliza tudo
                this.finalizeMove();
                
            }, 1000); // 250ms de delay entre os cortes

            return true;
        } else {
            this.playError();
            return false;
        }
    }

    // --- 5. ROTAÇÃO ---
    useRotate(pieceIndex) {
        const piece = this.game.currentHand[pieceIndex];
        if (!piece) return;

        const oldLayout = piece.layout;
        const newLayout = oldLayout[0].map((val, index) =>
            oldLayout.map(row => row[index]).reverse()
        );

        if (JSON.stringify(oldLayout) === JSON.stringify(newLayout)) {
            this.playError();
            const slot = this.game.dockEl.children[pieceIndex];
            if (slot) {
                slot.style.transition = '0.1s';
                slot.style.transform = 'translateX(5px)';
                setTimeout(() => slot.style.transform = 'translateX(-5px)', 50);
                setTimeout(() => slot.style.transform = 'none', 100);
            }
            return;
        }

        piece.layout = newLayout;
        piece.matrix = newLayout;
        
        this.game.powerUps.rotate--;
        this.game.savePowerUps();
        this.game.renderDock();
        if(this.game.audio) this.game.audio.playClick();
        
        this.game.interactionMode = null;
        this.game.updateControlsVisuals();
    }

    // --- Helpers ---

    triggerVisual(r, c, typeClass) {
        const idx = r * 8 + c;
        const cell = this.game.boardEl.children[idx];
        if(cell) {
            const rect = cell.getBoundingClientRect();
            this.game.spawnExplosion(rect, typeClass);
        }
    }

    consumeHeroPower(heroId) {
        this.game.heroState[heroId].used = true;
        this.game.heroState[heroId].unlocked = false;
    }

    playError() {
        if(this.game.audio) this.game.audio.vibrate(50);
    }

    finalizeMove() {
        this.game.interactionMode = null;
        this.game.renderGrid();
        this.game.effects.shakeScreen();
        this.game.updateControlsVisuals();

        setTimeout(() => {
            if (this.game.bossState.active) {
                this.game.processBossTurn(true); 
                if (this.game.bossState.currentHp <= 0) this.game.gameWon({}, []);
            } else {
                this.game.checkVictoryConditions();
            }
        }, 100);
    }
}