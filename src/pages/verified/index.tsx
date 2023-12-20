import React from "react";

function Verified() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <span className="text-center text-[24px] font-medium">
        Congrats! You&apos;ve been authenticated successfully.
      </span>
      <span className="text-grey">
        Please close this tab and return to the original.
      </span>
    </div>
  );
}

export default Verified;
