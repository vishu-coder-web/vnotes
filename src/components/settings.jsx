import { effect } from "@preact/signals";

import "./styles/settings.css";

import { showToolips } from "../store/notes.helper.js";
import { general, appearance, editor, keyboardShortcuts } from "../store/settings.store.js";

import Switch from "./switch.jsx";

const SettingsCard = ({ name, settings }) => {
  const notify = () => showToolips("Reload the app to apply your changes");

  const handleInputChange = (e) => {
    const property = e.target.name;
    const update = e.target.value;
    const type = e.target.type;
    const max = settings.value[property].max;

    settings.value = { ...settings.value, [property]: { type, value: update, max } };
    notify();
  };

  const handleSwitchChange = (e) => {
    const property = e.target.dataset.name;
    const update = e.target.checked;

    settings.value = { ...settings.value, [property]: { type: "switch", value: update } };
    notify();
  };

  const handleColorChange = (e) => {
    const property = e.target.name;
    const update = e.target.value;

    settings.value = { ...settings.value, [property]: { type: "color", value: update } };
    notify();
  };

  const handleSelectChange = (e) => {
    const property = e.target.name;
    const update = e.target.value;
    const options = settings.value[property].options;

    settings.value = { ...settings.value, [property]: { type: "select", value: update, options } };
    notify();
  };

  return (
    <div className="settings-card">
      <h2 className="heading">{name}</h2>

      {Object.entries(settings.value).map((setting) => (
        <div className="setting">
          <label>{setting[0]}</label>
          {setting[1].type === "range" && (
            <input
              type="range"
              value={setting[1].value}
              min="0"
              max={setting[1].max}
              className="input"
              name={setting[0]}
              onMouseUp={handleInputChange}
              onTouchend={handleInputChange}
            />
          )}
          {setting[1].type === "color" && (
            <input
              type="color"
              value={setting[1].value}
              name={setting[0]}
              onChange={handleColorChange}
            />
          )}
          {setting[1].type === "switch" && (
            <Switch value={setting[1].value} name={setting[0]} onChange={handleSwitchChange} />
          )}
          {setting[1].type === "select" && (
            <select onChange={handleSelectChange} name={setting[0]} value={setting[1].value}>
              {setting[1].options.map((value) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  );
};

const Settings = () => {
  effect(() => {
    localStorage.setItem("settings_general", JSON.stringify(general.value));
    localStorage.setItem("settings_appearance", JSON.stringify(appearance.value));
    localStorage.setItem("settings_editor", JSON.stringify(editor.value));
    localStorage.setItem("settings_keyboardShortcuts", JSON.stringify(keyboardShortcuts.value));
    localStorage.setItem("settings_saved", "true");
  });

  return (
    <div className="settings">
      <SettingsCard name="General" settings={general} />
      <SettingsCard name="Appearance" settings={appearance} />
      <SettingsCard name="Editor" settings={editor} />
      <SettingsCard name="Keyboard Shortcuts" settings={keyboardShortcuts} />

      <div className="settings-card">
        <p className="coming-soon">More Settings and Customizations are Coming Soon.</p>
      </div>
    </div>
  );
};

export default Settings;
