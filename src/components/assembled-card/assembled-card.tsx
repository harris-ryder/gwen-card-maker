import React, { useEffect, useState } from "react";
import Overlay from "../overlay/overlay";
import type { ApiResponse } from "../../App";

const AssembledCard: React.FC<{
  card: ApiResponse;
}> = ({ card }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    // Fetch card data using the provided cardId
    fetch(
      `https://api.gwent.one/?key=data&id=${card.id.card}&response=html&html=version.artsize.linkart&class=rounded&version=1.1.0`
    )
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Extract all image URLs
        const allImages = doc.querySelectorAll("img");
        const urls: string[] = [];
        allImages.forEach((img) => {
          if (img.src) {
            urls.push(img.src);
            console.log("Image found:", img.src);
          }
        });
        setImageUrls(urls);
      });
  }, [card.id.card]);

  console.log(card.name, card);

  return (
    <div
      className="relative w-[2.5in] h-[3.5in] bg-black print:bg-black"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {imageUrls.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Card art ${idx + 1}`}
          className="w-full h-full object-contain absolute inset-0 pointer-events-none print:object-contain"
          style={{
            zIndex: idx,
          }}
        />
      ))}
      <Overlay
        name={card.name}
        category={card.category}
        ability_html={card.ability_html}
      />
    </div>
  );
};

export default AssembledCard;
