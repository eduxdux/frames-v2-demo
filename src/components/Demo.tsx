"use client";

import { useEffect, useCallback, useState, TouchEvent } from "react";
import sdk from "@farcaster/frame-sdk";
import Image from 'next/image';

const LoadingDots = () => (
  <div className="flex gap-1 justify-center items-center h-8">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ 
          animation: `bounce 1s infinite ${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4 w-full max-w-[300px]">
    <div className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-lg" />
  </div>
);

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const images = [
    "https://pbs.twimg.com/media/GfBnXdvWQAADxax?format=jpg&name=medium",
    "https://pbs.twimg.com/media/GfBnVL3WIAA90rg?format=jpg&name=medium",
    "https://pbs.twimg.com/media/GfBnWihXwAAL8Dn?format=jpg&name=medium",
    "https://pbs.twimg.com/media/Ge7RGGUWsAAzHC1?format=jpg&name=medium",
    "https://pbs.twimg.com/media/GezmLscXcAABKgh?format=jpg&name=medium"
  ];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      // Swiped left
      nextSlide();
    } else {
      // Swiped right
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative w-full mb-6">
      <div 
        className="relative w-full aspect-square overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images */}
        <div 
          className="absolute w-full h-full transition-opacity duration-500"
          style={{ opacity: 1 }}
        >
          <Image 
            src={images[currentIndex]} 
            alt={`Sweater ${currentIndex + 1}`}
            fill
            className="object-cover"
            unoptimized // Since these are external images
          />
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
      >
        →
      </button>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false);

  const shortText = "The essence of this collection is to celebrate beautiful sweaters, offering a contrast to the popular trend of 'ugly sweaters.' This conce...";
  
  const fullText = "The essence of this collection is to celebrate beautiful sweaters, offering a contrast to the popular trend of 'ugly sweaters.' This concept of flamboyant and intentionally 'ugly' sweaters has become a well-known tradition in Northern countries, particularly during Christmas festivities when winter brings its cozy charm. However, not all sweaters need to be defined by this stereotype. Here in Brazil, where the colder season has its unique allure, sweaters are often crafted with care and affection. Each stitch and detail carries an expression of dedication, reflecting the natural beauty that skilled craftsmanship can offer. More than just clothing, they are manifestations of warmth and authenticity, translating human connection into the art of textile creation.";

  useEffect(() => {
    const load = async () => {
      await sdk.context;
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    // Load Highlight embed script
    const script = document.createElement('script');
    script.src = "https://mint.highlight.xyz/assets/embed.js?v=1";
    script.id = "highlight-embed-script";
    script.type = "module";
    script.crossOrigin = "true";
    script.dataset.embedVersion = "2.0";
    
    script.onload = () => {
      setIsEmbedLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://highlight.xyz/mint/zero:0x75B49d18A54564421e27bb5c34B8a502A42c8995");
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-left">Beautiful Sweaters</h1>
      <span className="text-sm text-gray-600 dark:text-gray-400 block mb-4">Generative project by @eduxdux</span>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 cursor-pointer hover:underline" onClick={openUrl}>
        Project link ⤴
      </p>

      <div className="mb-6">
        <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          {showFullText ? fullText : shortText}
        </p>
        <button 
          onClick={() => setShowFullText(!showFullText)}
          className="text-sm text-blue-500 hover:text-blue-600 mt-2 cursor-pointer"
        >
          {showFullText ? 'Show less' : 'Show more'}
        </button>
      </div>

      <ImageCarousel />

      {!isEmbedLoaded ? (
        <>
          <LoadingDots />
          <SkeletonLoader />
        </>
      ) : (
        <div 
          data-widget="highlight-mint-card" 
          data-template="no-art" 
          data-mint-collection-id="6761d2cb1d136b4c0606eec6"
          className="w-full max-w-[300px]"
          style={{ transform: 'scale(0.9)', transformOrigin: 'left top' }}
        />
      )}
    </div>
  );
}