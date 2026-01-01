// js/modules/logic/mechanics.js

/**
 * Encontra uma célula aleatória no grid que corresponda aos tipos permitidos.
 * Usado pelos chefes para escolher onde atacar.
 * * @param {Array} grid - A matriz do jogo
 * @param {Array} allowedTypes - Lista de tipos permitidos (ex: ['EMPTY', 'ITEM'])
 * @returns {Object|null} - {r, c} ou null se não achar
 */
export function findRandomTarget(grid, allowedTypes) {
    let attempts = 0;
    // Tenta 50 vezes achar um alvo válido aleatoriamente
    while(attempts < 50) {
        const r = Math.floor(Math.random() * 8);
        const c = Math.floor(Math.random() * 8);
        const cell = grid[r][c];
        
        const isEmpty = !cell;
        const isItem = cell && cell.type === 'ITEM';
        // Se quisermos atacar blocos normais no futuro, adicionaríamos aqui
        
        // Verifica se o alvo atual bate com o que o chefe quer
        if ((isEmpty && allowedTypes.includes('EMPTY')) || 
            (isItem && allowedTypes.includes('ITEM'))) {
            
            // Proteção extra: Não atacar itens especiais de bloqueio (como a própria Rocha)
            // se o objetivo for transformar em rocha
            if (isItem && cell.key === 'ROCK') {
                attempts++;
                continue;
            }

            return { r, c };
        }
        attempts++;
    }
    return null;
}

/**
 * Verifica se uma posição está dentro do tabuleiro
 */
export function isValidPos(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}