import { useLocation } from "wouter-preact";

import "./styles/noPageFound.css";

const NoPageFound = () => {
  const [location, navigate] = useLocation();

  return (
    <div className="blank-page-container">
      <div className="blank-page">
        <h2>
          <span>404: </span>
          <span>No Page Found!</span>
        </h2>
        <h3>
          <span>Try Going to </span>
          <span>Editor</span>
        </h3>
        <button className="navigate-editor" onClick={() => navigate("/editor")}>
          Go To Editor
        </button>
      </div>
    </div>
  );
};

export default NoPageFound;
