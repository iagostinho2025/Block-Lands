// js/modules/logic/bosses.js
import { findRandomTarget } from './mechanics.js';

export const BOSS_LOGIC = {
    // --- DRAGÃO IGNIS (Mundo de Fogo) ---
    'dragon_ignis': {
        onAttack: (gameInstance) => {
            // 1. Efeito Visual (Flash Vermelho)
            gameInstance.triggerScreenFlash('#450a0a');
            
            // 2. Lógica: Achar um espaço vazio ou item para transformar em pedra
            const target = findRandomTarget(gameInstance.grid, ['EMPTY', 'ITEM']);
            
            if (target) {
                // 3. Executa a transformação usando o método do jogo
                gameInstance.transformCell(target.r, target.c, { 
                    type: 'ITEM', 
                    key: 'ROCK', 
                    emoji: '🪨', 
                    damage: 0 
                });
                return true; // Ataque realizado com sucesso
            }
            return false;
        }
    },

    // --- YETI ANCESTRAL (Mundo de Gelo - Exemplo Futuro) ---
    'yeti_frost': {
        onAttack: (gameInstance) => {
            gameInstance.triggerScreenFlash('#083344'); // Flash Azul
            
            // Exemplo: O Yeti congela 2 blocos aleatórios
            for(let i=0; i<2; i++) {
                const target = findRandomTarget(gameInstance.grid, ['EMPTY']);
                if(target) {
                    gameInstance.transformCell(target.r, target.c, {
                        type: 'ITEM',
                        key: 'ICE_BLOCK',
                        emoji: '🧊',
                        damage: 0
                    });
                }
            }
            return true;
        }
    }
};