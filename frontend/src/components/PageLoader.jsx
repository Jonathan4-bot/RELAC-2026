import { useEffect, useState } from "react";

function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-loader ${hidden ? "hidden" : ""}`}>
      <div className="loader-spinner" />
    </div>
  );
}

export default PageLoader;
