import { useEffect, useState } from "react";
import AssembledCard from "./components/assembled-card/assembled-card";

// Define a type for the card object with only the id property
type ApiResponse = {
  id: {
    card: string;
  };
  category: string;
  name: string;
  ability_html: string;
  keyword_html: string;
};

type Card = {
  id: string;
  category: string;
  name: string;
  ability_html: string;
  keyword_html: string;
};

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://api.gwent.one/?key=data&version=13.0.0.15&audio=1")
      .then((response) => response.json())
      .then((data) => {
        // Use the Card type for better type safety
        const response = Object.values(data.response) as ApiResponse[];
        console.log("response", data.response);
        const cardIds = response.map((card) => ({
          id: card.id.card,
          category: card.category,
          name: card.name,
          ability_html: card.ability_html,
          keyword_html: card.keyword_html,
        }));
        console.log(response.slice(0, 10));

        console.log(
          "triss",
          Object.values(data.response).filter((card) =>
            card.name.toLowerCase().includes("triss".toLowerCase())
          )
        );

        setCards(cardIds);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("description", filteredCards);

  return (
    <>
      <div className="sticky top-0 bg-white p-4 shadow-md z-100">
        <input
          type="text"
          placeholder="Filter by card name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 justify-items-center items-center w-fit mx-auto mt-8">
        {filteredCards.slice(0, 10).map((cardId) => (
          <AssembledCard
            key={cardId.id}
            cardId={cardId.id}
            category={cardId.category}
            name={cardId.name}
            ability_html={cardId.ability_html}
            keyword_html={cardId.keyword_html}
          />
        ))}
      </div>
    </>
  );
}

export default App;
