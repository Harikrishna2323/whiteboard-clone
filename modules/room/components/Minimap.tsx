"use client";
import { Dispatch, SetStateAction, forwardRef, useEffect, useRef } from "react";
import { MotionValue, useMotionValue, motion } from "framer-motion";
import { useViewportSize } from "../../../common/hooks/useViewportSize";
import { CANVAS_SIZE } from "../../../common/constants/canvasSize";
import { useBoardPosition } from "../hooks/useBoardPosition";

const Minimap = forwardRef<
  HTMLCanvasElement,
  {
    dragging: boolean;
    setMovedMinimap: Dispatch<SetStateAction<boolean>>;
  }
>(({ dragging, setMovedMinimap }, ref) => {
  const { x, y } = useBoardPosition();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useViewportSize();

  const miniX = useMotionValue(0);
  const miniY = useMotionValue(0);

  useEffect(() => {
    miniX.onChange((newX) => {
      if (!dragging) x.set(-newX * 10);
    });

    miniY.onChange((newY) => {
      if (!dragging) y.set(-newY * 10);
    });

    return () => {
      miniX.clearListeners();
      miniY.clearListeners();
    };
  }, [dragging, x, y, miniX, miniY]);

  return (
    <div
      className="absolute top-10 right-10 z-30 overflow-hidden rounded-lg shadow-lg"
      ref={containerRef}
      style={{ width: CANVAS_SIZE.width / 10, height: CANVAS_SIZE.height / 10 }}
    >
      <canvas
        ref={ref}
        width={CANVAS_SIZE.width}
        height={CANVAS_SIZE.height}
        className="h-full w-full"
      />

      <motion.div
        drag
        className="absolute top-0 left-0 cursor-grab rounded-lg border-2 border-red-500"
        dragConstraints={containerRef}
        dragElastic={0}
        dragTransition={{ power: 0, timeConstant: 0 }}
        onDragStart={() => setMovedMinimap((prev) => !prev)}
        onDragEnd={() => setMovedMinimap((prev: boolean) => !prev)}
        style={{
          width: width / 10,
          height: height / 10,
          x: miniX,
          y: miniY,
        }}
        animate={{ x: -x.get() / 10, y: -y.get() / 10 }}
        transition={{ duration: 0 }}
      />
    </div>
  );
});

Minimap.displayName = "Minimap";

export default Minimap;
