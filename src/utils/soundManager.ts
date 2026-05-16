import { useGameStore } from "@/store/gameStore";

class SoundManager {
  private audioCtx: AudioContext | null = null;

  private isEnabled() {
    return useGameStore.getState().soundEnabled;
  }

  private init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }



  private playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  public playClick() {
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  public playCash() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.audioCtx) return;

    // "Coin" sound: fast slide up
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, this.audioCtx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, this.audioCtx.currentTime + 0.08); // E6

    gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }

  public playError() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.3);
  }

  public playAchievement() {
    if (!this.isEnabled()) return;
    this.init();
    if (!this.audioCtx) return;

    // Arpeggio: C4, E4, G4, C5
    const freqs = [261.63, 329.63, 392.00, 523.25];
    const dur = 0.1;
    
    freqs.forEach((freq, i) => {
      const osc = this.audioCtx!.createOscillator();
      const gainNode = this.audioCtx!.createGain();

      osc.type = 'square';
      osc.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.05, this.audioCtx!.currentTime + i * dur);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + i * dur + dur * 1.5);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx!.destination);

      osc.start(this.audioCtx!.currentTime + i * dur);
      osc.stop(this.audioCtx!.currentTime + i * dur + dur * 1.5);
    });
  }

  public playNextTurn() {
    this.playTone(300, 'triangle', 0.15, 0.03);
  }
}

export const soundManager = new SoundManager();
