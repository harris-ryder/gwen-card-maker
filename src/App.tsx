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

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="sticky top-0 bg-white p-4 shadow-md z-100 print:hidden flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif", letterSpacing: "0.05em" }}>The voice of Gwent</h1>
        <input
          type="text"
          placeholder="Filter by card name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
        />
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 print:gap-0 justify-items-center items-center w-fit mx-auto mt-8 print:ml-0 print:mt-0">
        {filteredCards.slice(0, 300).map((card, idx) => (
          <>
            <AssembledCard key={card.id.card} card={card} />
            {(idx + 1) % 9 === 0 && (
              <div
                key={`break-${idx}`}
                className="w-full col-span-full break-after-page print:break-after-page"
                style={{ height: 0 }}
              />
            )}
          </>
        ))}
      </div>
    </>
  );
}

export default App;
