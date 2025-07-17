import { useEffect, useState } from "react";
import AssembledCard from "./components/assembled-card/assembled-card";

// Define a type for the card object with only the id property
export type ApiResponse = {
  id: {
    card: string;
    art: string; // e.g. https://gwent.one/image/gwent/assets/card/art/medium/1019.jpg
  };
  category: string;
  name: string;
  ability_html: string;
  keyword_html: string;
  attributes: {
    armor: number;
    artist: string;
    color: string; // border_  e.g. https://gwent.one/image/gwent/assets/card/other/medium/border_gold.png
    faction: string; // default_ e.g. https://gwent.one/image/gwent/assets/card/banner/medium/default_neutral.png
    factionSecondary: string;
    power: number; // power_ e.g. https://gwent.one/image/gwent/assets/card/number/medium/power_5.png
    provision: number; // provision_ e.g. https://gwent.one/image/gwent/assets/card/banner/medium/provision_neutral.png
    rarity: string; // rarity_ e.g. https://gwent.one/image/gwent/assets/card/other/medium/rarity_legendary.png
    reach: number;
    related: string;
    set: string;
    type: string;
  };
};

function App() {
  const [cards, setCards] = useState<ApiResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "deck">("all");
  const [deckCards, setDeckCards] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState(3);
  const [pageBreakInterval, setPageBreakInterval] = useState(9);

  useEffect(() => {
    const savedDeck = localStorage.getItem("gwent-deck");
    if (savedDeck) {
      setDeckCards(new Set(JSON.parse(savedDeck)));
    }
  }, []);

  const addToDeck = (cardId: string) => {
    const newDeck = new Set(deckCards);
    newDeck.add(cardId);
    setDeckCards(newDeck);
    localStorage.setItem("gwent-deck", JSON.stringify(Array.from(newDeck)));
  };

  const removeFromDeck = (cardId: string) => {
    const newDeck = new Set(deckCards);
    newDeck.delete(cardId);
    setDeckCards(newDeck);
    localStorage.setItem("gwent-deck", JSON.stringify(Array.from(newDeck)));
  };

  useEffect(() => {
    fetch("https://api.gwent.one/?key=data&version=13.0.0.15&audio=1")
      .then((response) => response.json())
      .then((data) => {
        // Use the Card type for better type safety
        const response = Object.values(data.response) as ApiResponse[];
        console.log("response", Object.values(data.response).slice(0, 1));
        setCards(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesView = viewMode === "all" || deckCards.has(card.id.card);
    return matchesSearch && matchesView;
  });

  return (
    <>
      <div className="sticky top-0 p-4 bg-[#675024] shadow-md z-[9999] print:hidden flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1
          className="text-2xl font-bold text-[#f4e4bc] text-center lg:text-left"
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif",
            letterSpacing: "0.05em",
          }}
        >
          The voice of Gwent
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-nowrap bg-[#3d2f1f] rounded-md p-1 w-fit">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === "all"
                  ? "bg-[#d4af37] text-[#2d1810]"
                  : "text-[#f4e4bc] hover:bg-[#4d3f2f]"
              }`}
            >
              All Cards
            </button>
            <button
              onClick={() => setViewMode("deck")}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === "deck"
                  ? "bg-[#d4af37] text-[#2d1810]"
                  : "text-[#f4e4bc] hover:bg-[#4d3f2f]"
              }`}
            >
              My Deck ({deckCards.size})
            </button>
          </div>
          <div className="flex flex-nowrap bg-[#3d2f1f] rounded-md p-1 w-fit">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setColumns(num)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  columns === num
                    ? "bg-[#d4af37] text-[#2d1810]"
                    : "text-[#f4e4bc] hover:bg-[#4d3f2f]"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#f4e4bc] whitespace-nowrap">Page Break:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={pageBreakInterval}
              onChange={(e) => setPageBreakInterval(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-[#3d2f1f] text-[#f4e4bc] border border-[#5d4e37] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Filter by card name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-[#3d2f1f] text-[#f4e4bc] placeholder-[#a89568] border border-[#5d4e37] rounded-md focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
          />
        </div>
      </div>
      <div
        className={`grid gap-4 print:gap-0 justify-items-center items-center w-fit mx-auto mt-8 print:ml-0 print:mt-0`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {filteredCards.map((card, idx) => (
          <>
            <AssembledCard
              key={card.id.card}
              card={card}
              isInDeck={deckCards.has(card.id.card)}
              onAddToDeck={addToDeck}
              onRemoveFromDeck={removeFromDeck}
            />
            {(idx + 1) % pageBreakInterval === 0 && (
              <div
                key={`break-${idx}`}
                className="w-full col-span-full break-after-page print:break-after-page"
                style={{ height: 0, gridColumn: `1 / -1` }}
              />
            )}
          </>
        ))}
      </div>
    </>
  );
}

export default App;
