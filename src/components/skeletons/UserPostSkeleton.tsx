import React from "react";

function UserPostSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div
      role="status"
      className={`animate-pulse space-y-8 rtl:space-x-reverse md:flex md:items-center md:space-x-8 md:space-y-0 ${
        isLast && "pb-[50px]"
      }`}
    >
      <div className="flex w-full items-start gap-3">
        <div className="h-[30px] w-[35px] rounded-full bg-input md:w-[30px]"></div>
        <div className="flex w-full flex-col">
          <div className="mb-4 h-2.5 w-10 rounded-full bg-input"></div>
          <div className="mb-4 h-2.5 w-48 rounded-full bg-input"></div>
          <div className="flex h-[300px] w-full items-center justify-center rounded-[18px] bg-input">
            <svg
              className="h-10 w-10 bg-input md:w-full"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#9C4CD0"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPostSkeleton;
