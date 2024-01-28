import confetti from "canvas-confetti";

const defaults = {
  spread: 360,
  ticks: 200,
  gravity: .1,
  decay: 0.94,
  startVelocity: 50,
  colors: ['0032FF', 'D252E1', '7FE051', '82CEFF', 'FF6B9B']
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ['star']
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ['circle']
  });
}

export function test () {
  setTimeout(shoot, 0);
/*  setTimeout(shoot, 200);
  setTimeout(shoot, 400);*/
}
