export class AudioSystem {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; 
        this.masterGain.connect(this.ctx.destination);
        
        this.enabled = true;

        // --- CARREGAMENTO DO SOM CUSTOMIZADO ---
        this.dropBuffer = null;
        this.loadSound('./assets/sounds/drop.mp3'); // <--- SEU ARQUIVO AQUI
    }

    // Função para baixar e decodificar o som
    async loadSound(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.dropBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            console.log("Som de drop carregado com sucesso!");
        } catch (error) {
            console.warn("Não foi possível carregar o som:", error);
        }
    }

    resume() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- TOCAR SOM DE DROP (Customizado) ---
    playDrop() {
        if (!this.enabled) return;
        this.resume();

        // Se o arquivo já carregou, toca ele
        if (this.dropBuffer) {
            const source = this.ctx.createBufferSource();
            source.buffer = this.dropBuffer;
            source.connect(this.masterGain);
            source.start(0);
        } 
        // Se ainda não carregou ou deu erro, usa o sintetizador antigo (Fallback)
        else {
            this.playSynthDrop();
        }
    }

    // Som Sintetizado de Reserva (Antigo)
    playSynthDrop() {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // --- SOM 2: "CRISTAL" (MANTIDO SINTETIZADO) ---
    playClear(comboMultiplier = 1) {
        if (!this.enabled) return;
        this.resume();

        const now = this.ctx.currentTime;
        const frequencies = [523.25, 659.25, 783.99]; 
        const pitchMod = comboMultiplier > 1 ? 2 : 1;

        frequencies.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.type = 'triangle'; 
            const startTime = now + (i * 0.05);
            osc.frequency.setValueAtTime(freq * pitchMod, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
            osc.start(startTime);
            osc.stop(startTime + 0.6);
        });
    }

    vibrate(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    }
}