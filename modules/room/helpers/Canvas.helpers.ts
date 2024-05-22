import { CANVAS_SIZE } from "../../../common/constants/canvasSize";

export const hanldeMove = (move: Move, ctx: CanvasRenderingContext2D) => {
  const tempCtx = ctx;
  const { options, path } = move;

  if (tempCtx) {
    tempCtx.lineWidth = options.lineWidth;
    tempCtx.strokeStyle = options.lineColor;

    tempCtx.beginPath();
    path.forEach(([x, y]) => {
      tempCtx.lineTo(x, y);
    });
    tempCtx.stroke();
    tempCtx.closePath();
  }
};

export const drawOnUndo = (
  ctx: CanvasRenderingContext2D,
  savedMoves: Move[],
  users: { [key: string]: Move[] }
) => {
  ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

  Object.values(users).forEach((user) => {
    user.forEach((move) => hanldeMove(move, ctx));
  });

  savedMoves.forEach((move) => {
    hanldeMove(move, ctx);
  });
};
