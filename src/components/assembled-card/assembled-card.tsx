import React, { useEffect, useState } from "react";
import Overlay from "../overlay/overlay";

const AssembledCard: React.FC<{
  cardId: string;
  category: string;
  name: string;
  ability_html: string;
  keyword_html: string;
}> = ({ cardId, category, name, ability_html, keyword_html }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    // Fetch card data using the provided cardId
    fetch(
      `https://api.gwent.one/?key=data&id=${cardId}&response=html&html=version.artsize.linkart&class=rounded&version=1.1.0`
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
  }, [cardId]);

  return (
    <div className="relative w-[2.5in] h-[3.5in] border border-red-500 bg-black">
      {imageUrls.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Card art ${idx + 1}`}
          className="w-full h-full object-contain absolute inset-0 pointer-events-none"
          style={{
            zIndex: idx,
          }}
        />
      ))}
      <Overlay
        name={name}
        category={category}
        ability_html={ability_html}
        keyword_html={keyword_html}
      />
    </div>
  );
};

export default AssembledCard;
