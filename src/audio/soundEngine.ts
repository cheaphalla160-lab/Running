// Web Audio API cheerful melody synthesizer & Web Speech API English pronunciation engine

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private stepIndex = 0;
  private musicEnabled = true;
  private sfxEnabled = true;
  private voiceEnabled = true;
  private isPlayingMusic = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlockAudio(): void {
    const ctx = this.getContext();
    if (ctx && this.musicEnabled && !this.isPlayingMusic) {
      this.startMusic();
    }
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setVoiceEnabled(enabled: boolean): void {
    this.voiceEnabled = enabled;
    if (!enabled) {
      this.stopSpeech();
    }
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'triangle',
    volume = 0.08,
    delay = 0
  ): void {
    const ctx = this.getContext();
    if (!ctx || freq <= 0) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public startMusic(): void {
    if (!this.musicEnabled || this.isPlayingMusic) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isPlayingMusic = true;

    // Cheerful 16-beat C-major marimba/ukulele style loop (light & bouncy for kids)
    const melody: number[] = [
      523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
      698.46, 880.0, 783.99, 0,       // F5 A5 G5 -
      659.25, 587.33, 523.25, 587.33, // E5 D5 C5 D5
      659.25, 783.99, 523.25, 0,      // E5 G5 C5 -
      523.25, 659.25, 783.99, 1046.5, // C5 E5 G5 C6
      880.0, 783.99, 698.46, 659.25,  // A5 G5 F5 E5
      587.33, 659.25, 698.46, 587.33, // D5 E5 F5 D5
      523.25, 0, 523.25, 0,           // C5 - C5 -
    ];

    const bass: number[] = [
      261.63, 0, 196.0, 0,
      174.61, 0, 261.63, 0,
      164.81, 0, 196.0, 0,
      261.63, 0, 196.0, 0,
      261.63, 0, 261.63, 0,
      174.61, 0, 174.61, 0,
      196.0, 0, 196.0, 0,
      261.63, 0, 196.0, 0,
    ];

    const tick = () => {
      if (!this.musicEnabled || !this.isPlayingMusic) return;
      const idx = this.stepIndex % melody.length;
      const note = melody[idx];
      const bassNote = bass[idx];

      if (note > 0) {
        this.playTone(note, 0.24, 'triangle', 0.045);
      }
      if (bassNote > 0) {
        this.playTone(bassNote, 0.3, 'sine', 0.035);
      }

      this.stepIndex += 1;
    };

    tick();
    this.musicTimer = window.setInterval(tick, 270);
  }

  public stopMusic(): void {
    this.isPlayingMusic = false;
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public playClick(): void {
    if (!this.sfxEnabled) return;
    this.playTone(660, 0.07, 'sine', 0.08);
  }

  public playHop(): void {
    if (!this.sfxEnabled) return;
    this.playTone(440, 0.09, 'triangle', 0.09, 0);
    this.playTone(660, 0.11, 'triangle', 0.09, 0.05);
  }

  public playCorrect(): void {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 0.12, 'triangle', 0.11, 0);
    this.playTone(659.25, 0.12, 'triangle', 0.11, 0.08);
    this.playTone(783.99, 0.22, 'triangle', 0.12, 0.16);
  }

  public playWrong(): void {
    if (!this.sfxEnabled) return;
    this.playTone(310, 0.14, 'sawtooth', 0.05, 0);
    this.playTone(240, 0.2, 'sawtooth', 0.05, 0.11);
  }

  public playVictory(): void {
    if (!this.sfxEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.25, 'triangle', 0.12, idx * 0.11);
    });
  }

  public speakWord(text: string, rate = 0.88): void {
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = 1.08;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('natural')) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore synthesis errors in restricted environments
    }
  }

  public stopSpeech(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEngine = new SoundEngine();
