import React from "react";
import { useSetOptions } from "../../../common/recoil/options/options.hooks";

const Toolbar = () => {
  const setOptions = useSetOptions();

  return (
    <div className="absolute left-0 top-0 z-50 flex gap-5 bg-black text-white">
      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: "red" }))}
      >
        Red
      </button>

      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: "green" }))}
      >
        Green
      </button>

      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: "blue" }))}
      >
        Blue
      </button>

      <button
        onClick={() => setOptions((prev) => ({ ...prev, lineColor: "black" }))}
      >
        Black
      </button>
    </div>
  );
};

export default Toolbar;
