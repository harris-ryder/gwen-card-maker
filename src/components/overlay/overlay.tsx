import React from "react";

const Overlay: React.FC<{
  name: string;
  category: string;
  ability_html: string;
  headerTextColor?: "white" | "black";
  categoryTextColor?: "white" | "black";
  descriptionTextColor?: "black" | "white";
}> = ({
  name,
  category,
  ability_html,
  headerTextColor = "white",
  categoryTextColor = "black",
  descriptionTextColor = "black",
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none print:absolute"
      style={{ zIndex: 999 }}
    >
      <div className="relative w-full h-full flex justify-center print:h-[3.5in]">
        <header
          className={`absolute top-4 px-3 py-1 text-xs font-semibold text-center ${
            headerTextColor === "white" ? "text-white" : "text-black"
          }`}
          style={{
            width: "90%",
            borderRadius: "5% / 100%",
            boxSizing: "border-box",
            border: "0.15em solid #F6D263",
            boxShadow:
              "-0.2em 0 0.1em #0008, 0.1em 0 0.05em #0006, inset 0 0 0 0.1em #0008, inset 0.3em -0.3em 0.1em #0003",
            background: "rgba(246, 210, 99, 0.5)",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
            letterSpacing: "0.05em",
            fontSize: name.length > 14 ? "0.5em" : undefined,
          }}
        >
          {name}
        </header>
        <div className="absolute bottom-4 px-3 py-1 text-xs font-semibold text-center text-black flex flex-col gap-0 w-full print:bottom-2">
          <div
            className={`py-1 text-xs font-semibold text-center w-full ${
              categoryTextColor === "white" ? "text-white" : "text-black"
            }`}
            style={{
              borderRadius: "5% / 100%",
              boxSizing: "border-box",
              border: "0.15em solid #F6D263",
              boxShadow:
                "-0.2em 0 0.1em #0008, 0.1em 0 0.05em #0006, inset 0 0 0 0.1em #0008, inset 0.3em -0.3em 0.1em #0003",
              background: "rgba(246, 210, 99, 0.5)",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </div>
          {ability_html && (
            <div
              className={`px-3 py-2 text-[10px] rounded-t-none font-light rounded-sm w-[95%] mx-auto ${
                descriptionTextColor === "black" ? "text-black" : "text-white"
              }`}
              style={{
                border: "0.15em solid #F6D263",
                borderTop: 0,
                background: "rgba(246, 210, 99, 0.5)",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
              }}
            >
              {ability_html && (
                <div
                  className="mb-1 text-left"
                  dangerouslySetInnerHTML={{ __html: ability_html }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center text-white/70 text-2xl font-mono pointer-events-none select-none"
        style={{ zIndex: 9999 }}
      >
        @threejser
      </div>
    </div>
  );
};

export default Overlay;
