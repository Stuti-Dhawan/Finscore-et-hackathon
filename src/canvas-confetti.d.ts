declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    scalar?: number;
    ticks?: number;
  }

  const confetti: (options?: ConfettiOptions) => void;
  export default confetti;
}