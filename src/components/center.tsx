import React from "react";

type Children = {
  children: React.ReactNode;
};

function Center({ children }: Children) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {children}
    </div>
  );
}

export { Center };
