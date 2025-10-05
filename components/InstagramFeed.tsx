"use client";

import { useEffect } from "react";

export default function InstagramElfsight() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apps.elfsight.com/p/platform.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="elfsight-app-922123ab-dcbc-4e91-b47e-1fa27b0c4907" data-elfsight-app-lazy></div>
      </div>
    </div>
  );
}
