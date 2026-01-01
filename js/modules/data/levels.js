export const WORLDS = [
    // --- MUNDO 1: TERRAS VULCÂNICAS ---
    {
        id: 'world_fire',
        name: 'Terras Vulcânicas',
        themeColor: '#ef4444',
        bgClass: 'theme-fire', // Ativa o CSS de vulcões
        levels: [
            // --- INTRODUÇÃO (Apenas Fogo) ---
            { 
                id: 1, 
                type: 'normal', 
                goals: { fire: 8 }, 
                items: [ { key: 'NORMAL', weight: 90 }, { key: 'FIRE', emoji: '🔥', weight: 20 } ]
            },
            { 
                id: 2, 
                type: 'normal', 
                goals: { fire: 12 }, 
                items: [ { key: 'NORMAL', weight: 85 }, { key: 'FIRE', emoji: '🔥', weight: 25 } ]
            },
            { 
                id: 3, 
                type: 'normal', 
                goals: { fire: 15 }, 
                items: [ { key: 'NORMAL', weight: 80 }, { key: 'FIRE', emoji: '🔥', weight: 30 } ]
            },

            // --- DESAFIO INTERMEDIÁRIO (Fogo + Coração) ---
            { 
                id: 4, 
                type: 'normal', 
                goals: { fire: 10, heart: 2 }, 
                items: [ 
                    { key: 'NORMAL', weight: 80 }, 
                    { key: 'FIRE', emoji: '🔥', weight: 25 },
                    { key: 'HEART', emoji: '❤️‍🔥', weight: 5 } // Raro
                ]
            },
            { 
                id: 5, 
                type: 'normal', 
                goals: { fire: 20, heart: 3 }, 
                // Introduzindo uma pedra no meio para atrapalhar
                gridConfig: [{ r:3, c:3, type:'ITEM', key:'ROCK', emoji:'🪨' }, { r:4, c:4, type:'ITEM', key:'ROCK', emoji:'🪨' }],
                items: [ 
                    { key: 'NORMAL', weight: 75 }, 
                    { key: 'FIRE', emoji: '🔥', weight: 30 },
                    { key: 'HEART', emoji: '❤️‍🔥', weight: 8 }
                ]
            },
            { 
                id: 6, 
                type: 'normal', 
                goals: { fire: 25, heart: 5 }, 
                items: [ 
                    { key: 'NORMAL', weight: 70 }, 
                    { key: 'FIRE', emoji: '🔥', weight: 30 },
                    { key: 'HEART', emoji: '❤️‍🔥', weight: 10 }
                ]
            },

            // --- DIFÍCIL (Muitas Pedras) ---
            { 
                id: 7, 
                type: 'normal', 
                goals: { fire: 30 }, 
                // Paredes de pedra nos cantos
                gridConfig: [
                    { r:0, c:0, type:'ITEM', key:'ROCK', emoji:'🪨'}, { r:0, c:7, type:'ITEM', key:'ROCK', emoji:'🪨'},
                    { r:7, c:0, type:'ITEM', key:'ROCK', emoji:'🪨'}, { r:7, c:7, type:'ITEM', key:'ROCK', emoji:'🪨'}
                ],
                items: [ { key: 'NORMAL', weight: 80 }, { key: 'FIRE', emoji: '🔥', weight: 35 } ]
            },
            { 
                id: 8, 
                type: 'normal', 
                goals: { fire: 20, heart: 10 }, 
                // Padrão Xadrez no centro
                gridConfig: [
                    { r:3, c:3, type:'ITEM', key:'ROCK', emoji:'🪨'}, { r:3, c:4, type:'ITEM', key:'ROCK', emoji:'🪨'},
                    { r:4, c:3, type:'ITEM', key:'ROCK', emoji:'🪨'}, { r:4, c:4, type:'ITEM', key:'ROCK', emoji:'🪨'}
                ],
                items: [ { key: 'NORMAL', weight: 70 }, { key: 'FIRE', emoji: '🔥', weight: 25 }, { key: 'HEART', emoji: '❤️‍🔥', weight: 15 } ]
            },
            { 
                id: 9, 
                type: 'normal', 
                goals: { fire: 50 }, // Meta alta!
                items: [ { key: 'NORMAL', weight: 60 }, { key: 'FIRE', emoji: '🔥', weight: 50 } ] // Chuva de fogo
            },

            // --- FASE 10: O CHEFÃO DRAGÃO ---
            {
                id: 10,
                type: 'boss',
                boss: {
                    id: 'dragon_ignis',
                    name: 'Dragão Ignis',
                    emoji: '🐉',
                    maxHp: 50,
                    attackRate: 3
                },
                items: [
                    { key: 'NORMAL', emoji: null, weight: 100 }, 
                    { key: 'FIRE', emoji: '🔥', weight: 40, damage: 1 },
                    { key: 'HEART', emoji: '❤️‍🔥', weight: 5, damage: 3 },
                    { key: 'ROCK', emoji: '🪨', weight: 15, damage: 0 }
                ],
                // Arena do Dragão (Vulcões nos cantos)
                gridConfig: [
                    { r:0, c:0, type:'LAVA'}, { r:0, c:1, type:'LAVA'}, { r:0, c:6, type:'LAVA'}, { r:0, c:7, type:'LAVA'},
                    { r:1, c:0, type:'LAVA'},                                                       { r:1, c:7, type:'LAVA'},
                    { r:6, c:0, type:'LAVA'},                                                       { r:6, c:7, type:'LAVA'},
                    { r:7, c:0, type:'LAVA'}, { r:7, c:1, type:'LAVA'}, { r:7, c:6, type:'LAVA'}, { r:7, c:7, type:'LAVA'}
                ]
            }
        ]
    }
    // ... Futuros mundos (Gelo, Floresta) virão aqui
];