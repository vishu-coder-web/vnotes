import { Info, BadgeAlert } from "lucide-preact";

import "./styles/toolips.css";

import { toolipsData } from "../store/notes.store.js";

const Toolips = () => {
  return (
    <div className={`toolips ${toolipsData.value.type.trim().length === 0 ? "close" : ""}`}>
      {toolipsData.value.type.trim() == "info" ? (
        <Info size={20} className="info" />
      ) : (
        <BadgeAlert size={20} className="alert" />
      )}
      <span>{toolipsData.value.message}</span>
    </div>
  );
};

export default Toolips;
