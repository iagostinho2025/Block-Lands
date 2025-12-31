export const SHAPES = [
    { type: 'L', matrix: [[1,0], [1,0], [1,1]] },
    { type: 'J', matrix: [[0,1], [0,1], [1,1]] },
    { type: 'O', matrix: [[1,1], [1,1]] },
    { type: 'I', matrix: [[1], [1], [1], [1]] },
    { type: 'I_HOR', matrix: [[1, 1, 1, 1]] },
    { type: 'T', matrix: [[1,1,1], [0,1,0]] },
    { type: 'S', matrix: [[0,1,1], [1,1,0]] },
    { type: 'Z', matrix: [[1,1,0], [0,1,1]] },
    { type: 'DOT', matrix: [[1]] },
    { type: 'DOT2', matrix: [[1, 1]] },
    { type: 'DOT3', matrix: [[1, 1, 1]] }
];

export const ITEMS = {
    BEE: '🐝',
    GHOST: '👻',
    COP: '👮'
};

export function getRandomPiece() {
    // 1. Escolhe o formato geométrico
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    
    // 2. Gera o layout de conteúdo (Onde vai ter emoji?)
    // Vamos clonar a matriz da forma para preencher com itens
    const layout = shape.matrix.map(row => row.map(val => {
        if (val === 0) return null; // Espaço vazio da matriz
        
        // Se val === 1 (é um bloco), vamos rolar os dados:
        // 20% de chance de ter um item, 80% de ser cinza normal
        const chance = Math.random();
        
        if (chance < 0.20) { 
            // Sorteia qual item
            const keys = ['BEE', 'GHOST', 'COP'];
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            return { type: 'ITEM', key: randomKey, emoji: ITEMS[randomKey] };
        } else {
            // Bloco cinza normal
            return { type: 'NORMAL' };
        }
    }));
    
    return { 
        ...shape, 
        layout: layout, // Carrega a informação de cada quadradinho
        id: Date.now() + Math.random() 
    };
}