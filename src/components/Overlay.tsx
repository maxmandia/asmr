import React from "react";

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      {children}
    </div>
  );
}

export default Overlay;
