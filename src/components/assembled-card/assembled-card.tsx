import React, { useEffect, useState } from "react";
import Overlay from "../overlay/overlay";
import type { ApiResponse } from "../../App";

const AssembledCard: React.FC<{
  card: ApiResponse;
}> = ({ card }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [headerTextColor, setHeaderTextColor] = useState<"white" | "black">(
    "white"
  );
  const [categoryTextColor, setCategoryTextColor] = useState<"white" | "black">(
    "black"
  );
  const [descriptionTextColor, setDescriptionTextColor] = useState<
    "black" | "white"
  >("black");

  useEffect(() => {
    const savedHeaderColor = localStorage.getItem(
      `card-${card.id.card}-header-color`
    ) as "white" | "black" | null;
    const savedCategoryColor = localStorage.getItem(
      `card-${card.id.card}-category-color`
    ) as "white" | "black" | null;
    const savedDescriptionColor = localStorage.getItem(
      `card-${card.id.card}-description-color`
    ) as "black" | "white" | null;

    if (savedHeaderColor) setHeaderTextColor(savedHeaderColor);
    if (savedCategoryColor) setCategoryTextColor(savedCategoryColor);
    if (savedDescriptionColor) setDescriptionTextColor(savedDescriptionColor);
  }, [card.id.card]);

  const toggleHeaderColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newColor = headerTextColor === "white" ? "black" : "white";
    setHeaderTextColor(newColor);
    localStorage.setItem(`card-${card.id.card}-header-color`, newColor);
  };

  const toggleCategoryColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newColor = categoryTextColor === "white" ? "black" : "white";
    setCategoryTextColor(newColor);
    localStorage.setItem(`card-${card.id.card}-category-color`, newColor);
  };

  const toggleDescriptionColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newColor = descriptionTextColor === "black" ? "white" : "black";
    setDescriptionTextColor(newColor);
    localStorage.setItem(`card-${card.id.card}-description-color`, newColor);
  };

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

        // If no images found, construct URLs from card attributes
        if (urls.length === 0) {
          const constructedUrls: string[] = [];

          // Add art URL if available
          if (card.id.art) {
            constructedUrls.push(
              `https://gwent.one/image/gwent/assets/card/art/medium/${card.id.art}.jpg`
            );
          }

          // Add border URL based on color
          if (card.attributes.color) {
            constructedUrls.push(
              `https://gwent.one/image/gwent/assets/card/other/medium/border_${card.attributes.color.toLowerCase()}.png`
            );
          }

          // Add provision banner URL
          constructedUrls.push(
            `https://gwent.one/image/gwent/assets/card/banner/medium/provision_${card.attributes.faction.toLowerCase()}.png`
          );

          // Add provision number
          if (card.attributes.provision) {
            constructedUrls.push(
              `https://gwent.one/image/gwent/assets/card/number/medium/provision_${card.attributes.provision}.png`
            );
          }

          // Add rarity URL
          if (card.attributes.rarity) {
            constructedUrls.push(
              `https://gwent.one/image/gwent/assets/card/other/medium/rarity_${card.attributes.rarity.toLowerCase()}.png`
            );
          }
          // Add faction banner URL
          if (card.attributes.faction) {
            constructedUrls.push(
              `https://gwent.one/image/gwent/assets/card/banner/medium/default_${card.attributes.faction.toLowerCase()}.png`
            );
          }

          // Add power number URL if power > 0
          if (card.attributes.power > 0) {
            constructedUrls.push(
              `https://gwent.one/image/gwent/assets/card/number/medium/power_${card.attributes.power}.png`
            );
          }

          setImageUrls(constructedUrls);
        } else {
          setImageUrls(urls);
        }
      });
  }, [card.id.card]);

  return (
    <div
      className="relative w-[2.5in] h-[3.5in] bg-black print:bg-black hover:brightness-75 transition-all duration-200 group"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
      title={card.id.card}
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
        headerTextColor={headerTextColor}
        categoryTextColor={categoryTextColor}
        descriptionTextColor={descriptionTextColor}
      />
      <div className="absolute z-[9999] top-2 left-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {card.id.card}
      </div>
      <div className="absolute z-[9999] top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={toggleHeaderColor}
          className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs hover:bg-opacity-100 flex items-center justify-between"
          title="Toggle header text color"
        >
          Header: <span>{headerTextColor === "white" ? "⚪" : "⚫"}</span>
        </button>
        <button
          onClick={toggleCategoryColor}
          className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs hover:bg-opacity-100 flex items-center justify-between"
          title="Toggle category text color"
        >
          Category: <span> {categoryTextColor === "white" ? "⚪" : "⚫"}</span>
        </button>
        <button
          onClick={toggleDescriptionColor}
          className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs hover:bg-opacity-100 flex items-center justify-between"
          title="Toggle description text color"
        >
          Description:{" "}
          <span>{descriptionTextColor === "black" ? "⚫" : "⚪"}</span>
        </button>
      </div>
    </div>
  );
};

export default AssembledCard;
