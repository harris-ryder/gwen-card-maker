import React, { useEffect, useState } from "react";

const AssembledCard: React.FC<{
  cardId: string;
  category: string;
  name: string;
}> = ({ cardId, category, name }) => {
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
    <div className="max-w-sm  overflow-hidden  p-6">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm text-gray-500 mb-2">{category}</p>
      <div style={{ position: "relative", width: "100%" }}>
        {imageUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Card art ${idx + 1}`}
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: idx,
              pointerEvents: "none", // optional: so only the top image is interactive
            }}
          />
        ))}
        {/* Render the top image again, but invisible and static, to set container height */}
        {imageUrls.length > 0 && (
          <img
            src={imageUrls[imageUrls.length - 1]}
            alt="Card art (height reference)"
            style={{
              width: "100%",
              opacity: 0,
              position: "static",
              pointerEvents: "none",
              display: "block",
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};

export default AssembledCard;
