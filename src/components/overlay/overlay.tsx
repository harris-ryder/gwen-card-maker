import React from "react";

const Overlay: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="relative w-full h-full flex justify-center">
        <header
          className="absolute top-4 px-3 py-1 text-xs font-semibold text-center"
          style={{
            width: "90%",
            borderRadius: "5% / 100%",
            boxSizing: "border-box",
            border: "0.15em solid #e02a31",
            boxShadow:
              "0 -0.15em 0 -0.05em #e02a31, -0.2em 0 0.1em #0008, 0.1em 0 0.05em #0006, inset 0 0 0 0.1em #0008, inset 0.3em -0.3em 0.1em #0003",
            background: "#f3c6b8",
          }}
        >
          {name}
        </header>
      </div>
    </div>
  );
};

export default Overlay;