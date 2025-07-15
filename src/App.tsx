import { useEffect, useState } from "react";
import AssembledCard from "./components/assembled-card/assembled-card";

// Define a type for the card object with only the id property
type Card = {
  id: {
    card: string;
  };
};

function App() {
  const [cardIds, setCardIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://api.gwent.one/?key=data&version=1.0.0.15&audio=1")
      .then((response) => response.json())
      .then((data) => {
        // Use the Card type for better type safety
        const response = Object.values(data.response) as Card[];
        const cardIds = response.map((card) => card.id.card);
        setCardIds(cardIds);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center items-center max-w-5xl mx-auto mt-8">
      {cardIds.slice(0, 10).map((cardId) => (
        <AssembledCard key={cardId} cardId={cardId} />
      ))}
    </div>
  );
}

export default App;
