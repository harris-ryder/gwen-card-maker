import { useEffect, useState } from "react";
import AssembledCard from "./components/assembled-card/assembled-card";

// Define a type for the card object with only the id property
type ApiResponse = {
  id: {
    card: string;
  };
  category: string;
  name: string;
};

type Card = {
  id: string;
  category: string;
  name: string;
};

function App() {
  const [cardIds, setCardIds] = useState<Card[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://api.gwent.one/?key=data&version=1.0.0.15&audio=1")
      .then((response) => response.json())
      .then((data) => {
        // Use the Card type for better type safety
        const response = Object.values(data.response) as ApiResponse[];
        console.log("response", data.response);
        const cardIds = response.map((card) => ({
          id: card.id.card,
          category: card.category,
          name: card.name,
        }));
        console.log(response.slice(0, 10));
        setCardIds(cardIds);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filteredCards = cardIds.filter((card) =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
        <input
          type="text"
          placeholder="Filter by card name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center items-center max-w-5xl mx-auto mt-8">
        {filteredCards.slice(0, 10).map((cardId) => (
        <AssembledCard
          key={cardId.id}
          cardId={cardId.id}
          category={cardId.category}
          name={cardId.name}
        />
      ))}
      </div>
    </>
  );
}

export default App;
