import React from "react";

const Overlay: React.FC<{
  name: string;
  category: string;
  ability_html: string;
  keyword_html: string;
}> = ({ name, category, ability_html, keyword_html }) => {
  return (
    <div className="absolute inset-0 pointer-events-none print:relative" style={{ zIndex: 4 }}>
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
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
            letterSpacing: "0.05em",
            fontSize: name.length > 14 ? "0.5em" : undefined,
          }}
        >
          {name}
        </header>
        <div className="absolute bottom-4 px-3 py-1 text-xs font-semibold text-center text-black flex flex-col gap-0 w-full">
          <div
            className="py-1 text-xs font-semibold text-center text-black w-full"
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
          {(ability_html || keyword_html) && (
            <div
              className="px-3 py-2 text-[10px] rounded-t-none font-light text-black rounded-sm w-[95%] mx-auto"
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
    </div>
  );
};

export default Overlay;
