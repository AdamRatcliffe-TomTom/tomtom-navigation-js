import React, { useEffect, useState } from "react";

const Fade = ({ show, children, duration = "1s" }) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const handleAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    shouldRender && (
      <div
        style={{
          animation: `${
            show ? "TomTomNavigation__fade-in" : "TomTomNavigation__fade-out"
          } ${duration}`
        }}
        onAnimationEnd={handleAnimationEnd}
      >
        {children}
      </div>
    )
  );
};

export default Fade;
