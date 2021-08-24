export function playAudio(sound: HTMLAudioElement): void {
  // this;
  sound.currentTime = 0;
  sound.play();
}
