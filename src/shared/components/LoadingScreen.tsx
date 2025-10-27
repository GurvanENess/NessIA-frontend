import React from "react";

const LoadingScreen: React.FC<{}> = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <img
        src="/assets/nessia_logo.svg"
        alt="Nessia logo"
        className="animate-spin border-x-4 p-2 border-blue-500 rounded-full"
      />
    </div>
  );
};

export default LoadingScreen;
