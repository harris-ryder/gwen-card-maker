import React, { useEffect, useState } from "react";
import Overlay from "../overlay/overlay";
import type { ApiResponse } from "../../App";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const AssembledCard: React.FC<{
  card: ApiResponse;
  isInDeck: boolean;
  onAddToDeck: (cardId: string) => void;
  onRemoveFromDeck: (cardId: string) => void;
}> = ({ card, isInDeck, onAddToDeck, onRemoveFromDeck }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [headerTextColor, setHeaderTextColor] = useState<"white" | "black">(
    "white"
  );
  const [categoryTextColor, setCategoryTextColor] = useState<"white" | "black">(
    "black"
  );
  const [descriptionTextColor, setDescriptionTextColor] = useState<
    "black" | "white"
  >("black");

  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  });

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

  const handleDeckToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInDeck) {
      onRemoveFromDeck(card.id.card);
    } else {
      onAddToDeck(card.id.card);
    }
  };

  useEffect(() => {
    if (!isIntersecting) return;

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
        setImagesLoaded(true);
      });
  }, [card.id.card, isIntersecting]);

  return (
    <div
      ref={elementRef}
      className="relative w-[2.5in] h-[3.5in] bg-black print:bg-black transition-all duration-200 group"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
      title={card.id.card}
      onMouseEnter={() => setShowVideo(true)}
      onMouseLeave={() => setShowVideo(false)}
    >
      {!imagesLoaded && isIntersecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      {!isIntersecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      )}
      {imagesLoaded && showVideo && (
        <video
          src={`https://gwent.one/video/card/loop/ob/${card.id.card}.webm`}
          autoPlay
          loop
          playsInline
          muted
          className="w-full h-full object-contain absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{ zIndex: 1 }}
          onLoadedData={() => {
            console.log(`Video loaded for card ${card.id.card}`);
          }}
          onError={(e) => {
            console.log(`Video error for card ${card.id.card}:`, e);
          }}
          onLoadStart={() => {
            console.log(`Video loading started for card ${card.id.card}`);
          }}
        />
      )}
      {imagesLoaded &&
        imageUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Card art ${idx + 1}`}
            className={`w-full h-full object-contain absolute inset-0 pointer-events-none print:object-contain transition-all duration-200 ${
              idx === 0
                ? showVideo
                  ? "opacity-0"
                  : "group-hover:brightness-75"
                : "group-hover:brightness-75"
            }`}
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
      <div className="absolute z-[99999] top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleDeckToggle}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
            isInDeck
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          title={isInDeck ? "Remove from deck" : "Add to deck"}
        >
          {isInDeck ? "Remove from Deck" : "+ Add to Deck"}
        </button>
        <button
          onClick={toggleHeaderColor}
          className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs hover:bg-opacity-100 flex items-center justify-between gap-2 cursor-pointer"
          title="Toggle header text color"
        >
          Header: <span>{headerTextColor === "white" ? "⚪" : "⚫"}</span>
        </button>
        <button
          onClick={toggleCategoryColor}
          className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs hover:bg-opacity-100 flex items-center justify-between gap-2 cursor-pointer"
          title="Toggle category text color"
        >
          Category: <span> {categoryTextColor === "white" ? "⚪" : "⚫"}</span>
        </button>
        <button
          onClick={toggleDescriptionColor}
          className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded text-xs hover:bg-opacity-100 flex items-center justify-between gap-2 cursor-pointer"
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
