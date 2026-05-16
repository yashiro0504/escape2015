import { useGameStore } from "@/store/gameStore";

class HapticManager {
  private isEnabled() {
    return useGameStore.getState().hapticEnabled;
  }

  private vibrate(pattern: number | number[]) {
    if (!this.isEnabled()) return;
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }

  public selection() {
    this.vibrate(10); // 가벼운 진동
  }

  public success() {
    this.vibrate([15, 30, 20]); // 경쾌한 진동
  }

  public error() {
    this.vibrate([30, 40, 30]); // 무거운 진동
  }

  public achievement() {
    this.vibrate([20, 30, 20, 30, 40]); // 축하 진동
  }
}

export const hapticManager = new HapticManager();
