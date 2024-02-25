import React from "react";
import ClientOnlyPortal from "./ClientOnlyPortal";

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnlyPortal selector="#overlay">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
        {children}
      </div>
    </ClientOnlyPortal>
  );
}

export default Overlay;
