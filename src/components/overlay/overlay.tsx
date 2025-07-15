import React from "react";

const Overlay: React.FC<{ name: string; category: string }> = ({ name, category }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 99 }}
    >
      <div className="relative w-full h-full flex justify-center">
        <header
          className="absolute top-4 px-3 py-1 text-xs font-semibold text-center text-white"
          style={{
            width: "90%",
            borderRadius: "5% / 100%",
            boxSizing: "border-box",
            border: "0.15em solid #F6D263",
            boxShadow:
              "-0.2em 0 0.1em #0008, 0.1em 0 0.05em #0006, inset 0 0 0 0.1em #0008, inset 0.3em -0.3em 0.1em #0003",
            background: "rgba(246, 210, 99, 0.5)",
            fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
            letterSpacing: "0.05em",
          }}
        >
          {name}
        </header>
        <footer
          className="absolute bottom-4 px-3 py-1 text-xs font-semibold text-center text-white"
          style={{
            width: "90%",
            borderRadius: "5% / 100%",
            boxSizing: "border-box",
            border: "0.15em solid #F6D263",
            boxShadow:
              "-0.2em 0 0.1em #0008, 0.1em 0 0.05em #0006, inset 0 0 0 0.1em #0008, inset 0.3em -0.3em 0.1em #0003",
            background: "rgba(246, 210, 99, 0.5)",
            fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
            letterSpacing: "0.05em",
          }}
        >
          Creature: {category}
        </footer>
      </div>
    </div>
  );
};

export default Overlay;
