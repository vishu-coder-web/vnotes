import "./styles/switch.css";

const Switch = ({ value, name, onChange, extra }) => {
  return (
    <input
      type="checkbox"
      checked={value}
      className="switch"
      data-name={name}
      data-extra={extra || ""}
      onChange={onChange}
    />
  );
};

export default Switch;
