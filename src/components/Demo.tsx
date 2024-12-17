"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { Button } from "~/components/ui/Button";

export default function Demo(
  { title }: { title?: string } = { title: "Beautiful sweaters" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const shortText = "The essence of this collection is to celebrate beautiful sweaters, offering a contrast to the popular trend of 'ugly sweaters.' This concept of flamboyant and intentionally 'ugly' sweaters has become a well-known tradition in Northern countries, particularly during Christmas festivities when winter brings its cozy charm...";
  
  const fullText = "The essence of this collection is to celebrate beautiful sweaters, offering a contrast to the popular trend of 'ugly sweaters.' This concept of flamboyant and intentionally 'ugly' sweaters has become a well-known tradition in Northern countries, particularly during Christmas festivities when winter brings its cozy charm. However, not all sweaters need to be defined by this stereotype. Here in Brazil, where the colder season has its unique allure, sweaters are often crafted with care and affection. Each stitch and detail carries an expression of dedication, reflecting the natural beauty that skilled craftsmanship can offer. More than just clothing, they are manifestations of warmth and authenticity, translating human connection into the art of textile creation.";

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
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
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://highlight.xyz/mint/zero:0x75B49d18A54564421e27bb5c34B8a502A42c8995");
  }, []);

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-left mb-4">Beautiful Sweaters</h1>
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

      {/* <div className="mb-4">
        <h2 className="font-2xl font-bold">Context</h2>
        <button
          onClick={toggleContext}
          className="flex items-center gap-2 transition-colors"
        >
          <span
            className={`transform transition-transform ${
              isContextOpen ? "rotate-90" : ""
            }`}
          >
            ➤
          </span>
          Tap to expand
        </button>

        {isContextOpen && (
          <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
              {JSON.stringify(context, null, 2)}
            </pre>
          </div>
        )}
      </div> */}

      <div 
        data-widget="highlight-mint-card" 
        data-template="no-art" 
        data-mint-collection-id="6761d2cb1d136b4c0606eec6"
        className="w-full max-w-[300px]"
        style={{ transform: 'scale(0.9)', transformOrigin: 'left top' }}
      />
    </div>
  );
}