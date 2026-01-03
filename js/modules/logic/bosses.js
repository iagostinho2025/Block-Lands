// Lógica dos Chefes e Elites
export const BOSS_LOGIC = {
    // ELITE NÍVEL 10
    'magmor': {
        name: 'Magmor',
        emoji: '👺',
        maxHp: 25,
        onTurnEnd: (game) => {
            // PASSIVA: A cada 5 jogadas, cria um carvão
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            if (game.bossState.turnCount % 5 === 0) {
                const emptyCells = [];
                game.grid.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (!cell) emptyCells.push({r, c});
                    });
                });

                if (emptyCells.length > 0) {
                    const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    game.grid[target.r][target.c] = { type: 'OBSTACLE', key: 'coal', emoji: '⚫' };
                    game.renderGrid();
                    game.triggerScreenFlash('#57534e'); 
                }
            }
        }
    },

    // ELITE NÍVEL 15: FÊNIX INFERNAL
    'pyra': {
        name: 'Fênix Infernal',
        emoji: '🦅',
        maxHp: 35,
        onTurnEnd: (game) => {
            // Inicializa variáveis de controle se não existirem
            if (typeof game.bossState.regenCounter === 'undefined') {
                game.bossState.regenCounter = 0;
                game.bossState.lastHpCheck = game.bossState.maxHp;
            }

            // Verifica se tomou dano neste turno comparando com a vida anterior
            if (game.bossState.currentHp < game.bossState.lastHpCheck) {
                // Tomou dano: Zera o contador de regeneração
                game.bossState.regenCounter = 0;
            } else {
                // Não tomou dano: Incrementa
                game.bossState.regenCounter++;
            }

            // PASSIVA: Regenera se ficar 3 turnos sem dano
            if (game.bossState.regenCounter >= 3) {
                const healAmount = 2;
                game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + healAmount);
                game.updateBossUI();
                game.triggerScreenFlash('#22c55e'); // Flash verde
                
                // Reseta o contador para precisar de mais 3 turnos
                game.bossState.regenCounter = 0;
            }

            // Atualiza a vida de referência para o próximo turno
            game.bossState.lastHpCheck = game.bossState.currentHp;
        }
    },

    // BOSS NÍVEL 20
    'ignis': {
        name: 'Ignis',
        emoji: '🐉',
        maxHp: 50,
        onTurnEnd: (game) => {
            if (!game.bossState.turnCount) game.bossState.turnCount = 0;
            game.bossState.turnCount++;

            // 1. Poder do Magmor (Carvão)
            if (game.bossState.turnCount % 5 === 0) {
                 const emptyCells = [];
                 game.grid.forEach((row, r) => row.forEach((cell, c) => { if (!cell) emptyCells.push({r, c}); }));
                 if (emptyCells.length > 0) {
                     const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                     game.grid[target.r][target.c] = { type: 'OBSTACLE', key: 'coal', emoji: '⚫' };
                     game.renderGrid();
                     game.triggerScreenFlash('#57534e');
                 }
            }

            // 2. Poder da Fênix (Regen) - Usando a mesma lógica robusta
             if (typeof game.bossState.regenCounter === 'undefined') {
                game.bossState.regenCounter = 0;
                game.bossState.lastHpCheck = game.bossState.maxHp;
            }

            if (game.bossState.currentHp < game.bossState.lastHpCheck) {
                game.bossState.regenCounter = 0;
            } else {
                game.bossState.regenCounter++;
            }

            if (game.bossState.regenCounter >= 3) {
                const healAmount = 2;
                game.bossState.currentHp = Math.min(game.bossState.maxHp, game.bossState.currentHp + healAmount);
                game.updateBossUI();
                game.triggerScreenFlash('#22c55e');
                game.bossState.regenCounter = 0;
            }
            game.bossState.lastHpCheck = game.bossState.currentHp;

            // 3. PODER ESPECIAL: Petrificar Fogo
            if (game.bossState.turnCount % 7 === 0) {
                let changed = false;
                game.grid.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (cell && cell.key === 'fire') {
                            game.grid[r][c] = { type: 'OBSTACLE', key: 'stone', emoji: '🪨' };
                            changed = true;
                        }
                    });
                });
                if (changed) {
                    game.renderGrid();
                    game.triggerScreenFlash('#ef4444');
                }
            }
        }
    }
};