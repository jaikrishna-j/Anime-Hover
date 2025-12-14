import onePiece1 from "/one-piece-1.gif";
import onePiece2 from "/one-piece-2.gif";
import onePiece3 from "/one-piece-3.gif";
import bleach1 from "/bleach-1.gif";
import bleach2 from "/bleach-2.gif";
import bleach3 from "/bleach-3.gif";
import dragonBall1 from "/dragon-ball-1.gif";
import dragonBall2 from "/dragon-ball-2.gif";
import dragonBall3 from "/dragon-ball-3.gif";
import soloLeveling1 from "/solo-leveling-1.gif";
import soloLeveling2 from "/solo-leveling-2.gif";
import soloLeveling3 from "/solo-leveling-3.gif";
import blackClover1 from "/black-clover-1.gif";
import blackClover2 from "/black-clover-2.gif";
import blackClover3 from "/black-clover-3.gif";
import attackOnTitan1 from "/attack-on-titan-1.gif";
import attackOnTitan2 from "/attack-on-titan-2.gif";
import attackOnTitan3 from "/attack-on-titan-3.gif";
import demonSlayer1 from "/demon-slayer-1.gif";
import demonSlayer2 from "/demon-slayer-2.gif";
import demonSlayer3 from "/demon-slayer-3.gif";

export type AnimeSceneEntry = {
  src: string;
  offsetX: number;
  offsetY: number;
  rotate: number;
};

export const data: Record<string, AnimeSceneEntry[]> = {
  onePiece: [
    {
      src: onePiece1,
      offsetX: -460,
      offsetY: -190,
      rotate: -8,
    },
    {
      src: onePiece2,
      offsetX: -10,
      offsetY: -300,
      rotate: 2,
    },
    {
      src: onePiece3,
      offsetX: 430,
      offsetY: -100,
      rotate: -4,
    },
  ],
  bleach: [
    {
      src: bleach1,
      offsetX: -500,
      offsetY: -100,
      rotate: 3,
    },
    {
      src: bleach2,
      offsetX: -10,
      offsetY: -270,
      rotate: -4,
    },
    {
      src: bleach3,
      offsetX: 400,
      offsetY: -70,
      rotate: -2,
    },
  ],
  dragonBall: [
    {
      src: dragonBall1,
      offsetX: -460,
      offsetY: -190,
      rotate: -8,
    },
    {
      src: dragonBall2,
      offsetX: -10,
      offsetY: -300,
      rotate: 2,
    },
    {
      src: dragonBall3,
      offsetX: 430,
      offsetY: -100,
      rotate: -4,
    },
  ],
  soloLeveling: [
    {
      src: soloLeveling1,
      offsetX: -420,
      offsetY: -110,
      rotate: -5,
    },
    {
      src: soloLeveling2,
      offsetX: 50,
      offsetY: -200,
      rotate: 4,
    },
    {
      src: soloLeveling3,
      offsetX: 450,
      offsetY: 20,
      rotate: 10,
    },
  ],
  blackClover: [
    {
      src: blackClover1,
      offsetX: -500,
      offsetY: -100,
      rotate: 3,
    },
    {
      src: blackClover2,
      offsetX: -10,
      offsetY: -270,
      rotate: -4,
    },
    {
      src: blackClover3,
      offsetX: 400,
      offsetY: -70,
      rotate: -2,
    },
  ],
  attackOnTitan: [
    {
      src: attackOnTitan1,
      offsetX: -420,
      offsetY: -110,
      rotate: -5,
    },
    {
      src: attackOnTitan2,
      offsetX: 50,
      offsetY: -200,
      rotate: 4,
    },
    {
      src: attackOnTitan3,
      offsetX: 450,
      offsetY: 20,
      rotate: 10,
    },
  ],
  demonSlayer: [
    {
      src: demonSlayer1,
      offsetX: -460,
      offsetY: -190,
      rotate: -8,
    },
    {
      src: demonSlayer2,
      offsetX: -10,
      offsetY: -300,
      rotate: 2,
    },
    {
      src: demonSlayer3,
      offsetX: 430,
      offsetY: -100,
      rotate: -4,
    },
  ],
};
