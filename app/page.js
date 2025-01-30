'use client';
import React, { useState, useCallback, useEffect } from 'react';

export default function PortfolioPage() {
  const images = [
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025912/Cover_uxciaw.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025881/01_zrwyuk.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025876/02_m9nico.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025887/03_ffeh4a.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025871/04_k9bx2p.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025872/05_rs8lgf.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025861/06_f29b2z.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025902/07_ge1c1i.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025949/08_ufhppf.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025910/09_pfwahq.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025920/10_td9xts.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025914/11_txybxz.jpg",
    "https://res.cloudinary.com/ds1tirepr/image/upload/v1738025910/12_kukcbd.jpg",
  ];

  const ZOOM_SCALE = 3;
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [clickStartTime, setClickStartTime] = useState(0);

  useEffect(() => {
    setZoomedImage(null);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  const handleImageClick = useCallback(
    (e, image) => {
      const clickDuration = Date.now() - clickStartTime;

      if (isDragging || clickDuration > 200) {
        setIsDragging(false);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const originX = ((clickX / rect.width) * 100).toFixed(2);
      const originY = ((clickY / rect.height) * 100).toFixed(2);

      if (zoomedImage === image) {
        setZoomedImage(null);
        setPanPosition({ x: 0, y: 0 });
      } else {
        setZoomedImage(image);
        setZoomOrigin({ x: originX, y: originY });
        setPanPosition({ x: 0, y: 0 });
      }
    },
    [zoomedImage, isDragging, clickStartTime]
  );

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setClickStartTime(Date.now());
      if (zoomedImage) {
        setIsDragging(true);
        setStartPosition({ x: e.clientX, y: e.clientY });
      }
    },
    [zoomedImage]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !zoomedImage) return;

      const deltaX = (e.clientX - startPosition.x) / ZOOM_SCALE;
      const deltaY = (e.clientY - startPosition.y) / ZOOM_SCALE;

      setPanPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setStartPosition({ x: e.clientX, y: e.clientY });
    },
    [isDragging, startPosition, zoomedImage]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  const handleOutsideClick = useCallback((e) => {
    if (e.target.classList.contains('background-container')) {
      setZoomedImage(null);
      setPanPosition({ x: 0, y: 0 });
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-white background-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleOutsideClick}
    >
      <div className="flex flex-col items-center">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full mb-4"
            onClick={(e) => handleImageClick(e, image)}
            onMouseDown={handleMouseDown}
          >
            <div className="relative w-full">
              <img
                src={image}
                alt={`Architecture project ${index + 1}`}
                className="w-full h-auto object-contain"
                style={{
                  maxHeight: '90vh',
                  cursor: zoomedImage === image ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                  transform:
                    zoomedImage === image
                      ? `scale(${ZOOM_SCALE}) translate(${panPosition.x}px, ${panPosition.y}px)`
                      : "scale(1) translate(0, 0)",
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transition: isDragging ? "none" : "transform 0.3s ease",
                  userSelect: "none",
                  pointerEvents: "auto",
                  willChange: "transform",
                }}
                draggable="false"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}