// Definição das matrizes (Desenhos das peças)
// 1 = Bloco preenchido, 0 = Vazio

const SHAPE_DEFINITIONS = [
    // --- BÁSICOS ---
    { name: 'dot', matrix: [[1]] },
    { name: 'mini-h', matrix: [[1, 1]] },
    { name: 'mini-v', matrix: [[1], [1]] },

    // --- QUADRADOS ---
    { name: 'square-2x2', matrix: [[1, 1], [1, 1]] },
    { name: 'square-3x3', matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },

    // --- BARRAS ---
    { name: 'line-3h', matrix: [[1, 1, 1]] },
    { name: 'line-3v', matrix: [[1], [1], [1]] },
    { name: 'line-4h', matrix: [[1, 1, 1, 1]] },
    { name: 'line-4v', matrix: [[1], [1], [1], [1]] },

    // --- CANTOS ---
    { name: 'corner-tl', matrix: [[1, 0], [1, 1]] },
    { name: 'corner-tr', matrix: [[0, 1], [1, 1]] },
    { name: 'corner-bl', matrix: [[1, 1], [1, 0]] },
    { name: 'corner-br', matrix: [[1, 1], [0, 1]] },

    // --- L-SHAPES ---
    { name: 'l-0', matrix: [[1, 0], [1, 0], [1, 1]] }, 
    { name: 'l-90', matrix: [[1, 1, 1], [1, 0, 0]] }, 
    { name: 'l-180', matrix: [[1, 1], [0, 1], [0, 1]] }, 
    { name: 'l-270', matrix: [[0, 0, 1], [1, 1, 1]] }, 

    // --- J-SHAPES ---
    { name: 'j-0', matrix: [[0, 1], [0, 1], [1, 1]] }, 
    { name: 'j-90', matrix: [[1, 0, 0], [1, 1, 1]] }, 
    { name: 'j-180', matrix: [[1, 1], [1, 0], [1, 0]] }, 
    { name: 'j-270', matrix: [[1, 1, 1], [0, 0, 1]] }, 

    // --- T-SHAPES ---
    { name: 't-0', matrix: [[1, 1, 1], [0, 1, 0]] },
    { name: 't-90', matrix: [[0, 1], [1, 1], [0, 1]] },
    { name: 't-180', matrix: [[0, 1, 0], [1, 1, 1]] },
    { name: 't-270', matrix: [[1, 0], [1, 1], [1, 0]] },

    // --- Z/S-SHAPES ---
    { name: 's-h', matrix: [[0, 1, 1], [1, 1, 0]] },
    { name: 's-v', matrix: [[1, 0], [1, 1], [0, 1]] },
    { name: 'z-h', matrix: [[1, 1, 0], [0, 1, 1]] },
    { name: 'z-v', matrix: [[0, 1], [1, 1], [1, 0]] },
];

// Lista Padrão (Modo Casual)
const DEFAULT_ITEMS = [
    { key: 'BEE', emoji: '🐝', weight: 4 },
    { key: 'GHOST', emoji: '👻', weight: 4 },
    { key: 'COP', emoji: '👮', weight: 4 },
    { key: 'NORMAL', emoji: null, weight: 15 }
];

// Função Principal
export function getRandomPiece(customItems = null) {
    // 1. Escolhe um formato aleatório
    const shapeDef = SHAPE_DEFINITIONS[Math.floor(Math.random() * SHAPE_DEFINITIONS.length)];
    const matrix = shapeDef.matrix;

    // 2. Decide quais itens usar (Customizados da fase ou Padrão)
    const itemsPool = customItems || DEFAULT_ITEMS;

    // 3. Preenche o layout
    const layout = matrix.map(row => {
        return row.map(cell => {
            if (cell === 0) return null;

            const itemType = weightedRandomItem(itemsPool);
            
            return {
                type: itemType.key === 'NORMAL' ? 'NORMAL' : 'ITEM',
                key: itemType.key,
                emoji: itemType.emoji,
                damage: itemType.damage || 0, // Dano para o boss
                value: 1 
            };
        });
    });

    return {
        name: shapeDef.name,
        matrix: matrix,
        layout: layout
    };
}

// Sorteio com pesos
function weightedRandomItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        if (random < item.weight) return item;
        random -= item.weight;
    }
    return items[0];
}