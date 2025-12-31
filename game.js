import { getRandomPiece } from './shapes.js';

export class Game {
    constructor() {
        this.gridSize = 8;
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(null));
        
        // Elementos DOM
        this.boardEl = document.getElementById('game-board');
        this.dockEl = document.getElementById('dock');
        this.scoreEl = document.getElementById('final-score');
        this.modalEl = document.getElementById('modal-gameover');
        
        // Estado
        this.currentHand = []; 
        this.goals = { bee: 10, ghost: 10, cop: 10 }; 
        this.collected = { bee: 0, ghost: 0, cop: 0 };
        this.score = 0;
        
        this.init();
    }

    init() {
        this.renderGrid();
        this.spawnNewHand();
        this.updateGoalsUI();
        
        const btnRestart = document.getElementById('btn-restart');
        if(btnRestart) {
            btnRestart.addEventListener('click', () => this.resetGame());
        }
    }

    resetGame() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(null));
        this.collected = { bee: 0, ghost: 0, cop: 0 };
        this.score = 0;
        this.modalEl.classList.add('hidden');
        this.renderGrid();
        this.spawnNewHand();
        this.updateGoalsUI();
    }

    renderGrid() {
        this.boardEl.innerHTML = '';
        this.grid.forEach((row, rIndex) => {
            row.forEach((cellData, cIndex) => {
                const div = document.createElement('div');
                div.classList.add('cell');
                div.dataset.r = rIndex;
                div.dataset.c = cIndex;
                
                // Se existe dado salvo nesta célula
                if (cellData) {
                    div.classList.add('filled');
                    // Se o dado for um item, exibe o emoji
                    if (cellData.type === 'ITEM') {
                        div.innerText = cellData.emoji;
                    }
                }
                this.boardEl.appendChild(div);
            });
        });
    }

    // --- SPAWN COM SLOTS ---
    spawnNewHand() {
        this.dockEl.innerHTML = '';
        this.currentHand = [getRandomPiece(), getRandomPiece(), getRandomPiece()];
        
        this.currentHand.forEach((piece, index) => {
            const slot = document.createElement('div');
            slot.classList.add('dock-slot');
            this.createDraggablePiece(piece, index, slot);
            this.dockEl.appendChild(slot);
        });

        setTimeout(() => {
             if (this.checkMovesAvailable && !this.checkMovesAvailable()) {
                this.gameOver();
             }
        }, 100);
    }

    // --- CRIAÇÃO DA PEÇA VISUAL (Lendo o Layout) ---
    createDraggablePiece(piece, index, parentContainer) {
        const container = document.createElement('div');
        container.classList.add('draggable-piece');
        container.dataset.index = index;
        
        container.style.gridTemplateColumns = `repeat(${piece.matrix[0].length}, 1fr)`;
        
        // Iteramos sobre o layout gerado no shapes.js
        piece.layout.forEach(row => {
            row.forEach(cellData => {
                const block = document.createElement('div');
                
                if (cellData) { // Se não for null (espaço vazio)
                    block.classList.add('block-unit');
                    
                    // Se esse bloco específico tiver um item
                    if (cellData.type === 'ITEM') {
                        block.innerText = cellData.emoji;
                    }
                } else {
                    block.style.visibility = 'hidden';
                }
                container.appendChild(block);
            });
        });

        this.attachDragEvents(container, piece);
        parentContainer.appendChild(container);
    }

    attachDragEvents(el, piece) {
        let isDragging = false;
        let clone = null;
        let startX, startY;

        const onStart = (e) => {
            if (isDragging) return;
            isDragging = true;
            
            const touch = e.touches ? e.touches[0] : e;
            const rect = el.getBoundingClientRect();
            
            // Clone Visual
            clone = el.cloneNode(true);
            clone.classList.add('dragging-active');
            
            // Configura Grid do Clone
            const gridCellSize = this.boardEl.children[0].getBoundingClientRect().width;
            clone.style.display = 'grid';
            clone.style.gridTemplateColumns = `repeat(${piece.matrix[0].length}, ${gridCellSize}px)`;
            clone.style.gap = '4px'; 
            
            // Ajusta filhos
            Array.from(clone.children).forEach(child => {
                 child.style.width = gridCellSize + 'px';
                 child.style.height = gridCellSize + 'px';
                 child.style.display = 'flex';
                 child.style.justifyContent = 'center';
                 child.style.alignItems = 'center';
                 // Aumenta fonte se tiver emoji
                 if(child.innerText) child.style.fontSize = '24px';
            });

            clone.style.left = (touch.clientX - (rect.width/2)) + 'px';
            clone.style.top = (touch.clientY - (rect.height/2)) + 'px';
            
            document.body.appendChild(clone);
            el.style.opacity = '0';
        };

        const onMove = (e) => {
            if (!isDragging || !clone) return;
            e.preventDefault();

            const touch = e.touches ? e.touches[0] : e;
            const cloneWidth = clone.offsetWidth;
            const cloneHeight = clone.offsetHeight;
            
            const x = touch.clientX - (cloneWidth / 2);
            const y = touch.clientY - (cloneHeight / 2) - 80;
            
            clone.style.left = x + 'px';
            clone.style.top = y + 'px';

            this.handlePreview(touch.clientX, touch.clientY, piece);
        };

        const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;

            const touch = e.changedTouches ? e.changedTouches[0] : e;
            const placed = this.tryPlacePiece(touch.clientX, touch.clientY, piece);

            if (placed) {
                el.remove();
                this.checkLines();
                
                const remainingPieces = this.dockEl.querySelectorAll('.draggable-piece');
                if (remainingPieces.length === 0) {
                    this.spawnNewHand();
                } else if (!this.checkMovesAvailable()) {
                    this.gameOver();
                }
            } else {
                el.style.opacity = '1';
            }

            if (clone) clone.remove();
            this.clearPreview();
        };

        el.addEventListener('mousedown', onStart);
        el.addEventListener('touchstart', onStart, {passive: false});
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, {passive: false});
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }

    getGridCellFromPoint(x, y) {
        const elements = document.elementsFromPoint(x, y - 50); 
        const cell = elements.find(el => el.classList.contains('cell'));
        if (cell) return { r: parseInt(cell.dataset.r), c: parseInt(cell.dataset.c) };
        return null;
    }

    handlePreview(x, y, piece) {
        this.clearPreview();
        const startPos = this.getGridCellFromPoint(x, y);
        if (!startPos) return;

        if (this.canPlace(startPos.r, startPos.c, piece)) {
            this.drawPreview(startPos.r, startPos.c, piece);
        }
    }

    canPlace(r, c, piece) {
        const rOffset = Math.floor(piece.matrix.length / 2);
        const cOffset = Math.floor(piece.matrix[0].length / 2);
        const startR = r - rOffset;
        const startC = c - cOffset;

        for (let i = 0; i < piece.matrix.length; i++) {
            for (let j = 0; j < piece.matrix[i].length; j++) {
                if (piece.matrix[i][j] === 1) { // Verifica geometria
                    const targetR = startR + i;
                    const targetC = startC + j;
                    if (targetR < 0 || targetR >= this.gridSize || targetC < 0 || targetC >= this.gridSize) return false;
                    if (this.grid[targetR][targetC] !== null) return false;
                }
            }
        }
        return { startR, startC }; 
    }

    drawPreview(r, c, piece) {
        const coords = this.canPlace(r, c, piece);
        if(!coords) return;

        for (let i = 0; i < piece.matrix.length; i++) {
            for (let j = 0; j < piece.matrix[i].length; j++) {
                if (piece.matrix[i][j] === 1) {
                    const cell = this.boardEl.children[(coords.startR + i) * 8 + (coords.startC + j)];
                    if(cell) cell.classList.add('preview');
                }
            }
        }
    }

    clearPreview() {
        document.querySelectorAll('.preview').forEach(el => el.classList.remove('preview'));
    }

    tryPlacePiece(x, y, piece) {
        const startPos = this.getGridCellFromPoint(x, y);
        if (!startPos) return false;

        const coords = this.canPlace(startPos.r, startPos.c, piece);
        if (!coords) return false;

        // Commit: Salvar o conteúdo específico de cada quadrado no grid
        for (let i = 0; i < piece.layout.length; i++) {
            for (let j = 0; j < piece.layout[i].length; j++) {
                const cellData = piece.layout[i][j];
                
                if (cellData) { // Se tem bloco nessa posição
                    const r = coords.startR + i;
                    const c = coords.startC + j;
                    
                    // Salva o objeto completo (NORMAL ou ITEM)
                    this.grid[r][c] = cellData;
                    
                    // Atualiza visual
                    const cellEl = this.boardEl.children[r * 8 + c];
                    cellEl.classList.add('filled');
                    if (cellData.type === 'ITEM') {
                        cellEl.innerText = cellData.emoji;
                    }
                }
            }
        }
        return true;
    }

    checkLines() {
        let linesCleared = 0;
        
        // Check Rows
        for (let r = 0; r < this.gridSize; r++) {
            if (this.grid[r].every(val => val !== null)) {
                this.clearRow(r);
                linesCleared++;
            }
        }
        
        // Check Cols
        for (let c = 0; c < this.gridSize; c++) {
            let full = true;
            for (let r = 0; r < this.gridSize; r++) {
                if (this.grid[r][c] === null) full = false;
            }
            if (full) {
                this.clearCol(c);
                linesCleared++;
            }
        }

        if (linesCleared > 0) {
            this.renderGrid(); // Redesenha para limpar
        }
    }

    clearRow(r) {
        for(let c=0; c<this.gridSize; c++) {
            if(this.grid[r][c]) this.collectItem(this.grid[r][c]);
            this.grid[r][c] = null;
        }
    }

    clearCol(c) {
        for(let r=0; r<this.gridSize; r++) {
            if (this.grid[r][c]) { 
                this.collectItem(this.grid[r][c]);
                this.grid[r][c] = null;
            }
        }
    }

    collectItem(cellData) {
        // Só conta se for do tipo ITEM
        if (cellData && cellData.type === 'ITEM') {
            const key = cellData.key.toLowerCase(); // bee, ghost, cop
            if (this.collected[key] !== undefined) {
                this.collected[key]++;
                this.updateGoalsUI();
            }
        }
    }

    updateGoalsUI() {
        const types = ['bee', 'ghost', 'cop'];
        types.forEach(t => {
            const el = document.getElementById(`goal-${t}`);
            if(!el) return;

            const target = this.goals[t];
            const current = this.collected[t];
            el.innerText = `${current}/${target}`;
            
            const parent = el.closest('.goal-item');
            if (current >= target) {
                parent.classList.add('completed');
                el.innerText = "✓";
            }
        });
    }

    checkMovesAvailable() {
        return true; 
    }

    gameOver() {
        this.scoreEl.innerText = Object.values(this.collected).reduce((a,b)=>a+b, 0);
        this.modalEl.classList.remove('hidden');
    }
}