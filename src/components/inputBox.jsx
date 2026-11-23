import { useSignalRef } from "@preact/signals/utils";
import { useSignal, effect } from "@preact/signals";

import "./styles/inputBox.css";
import "./styles/dialog.css";

import { inputBoxData } from "../store/notes.store.js";

const InputBox = () => {
  const container = useSignalRef(null);

  const handleInput = (e) => {
    const action = e.submitter?.value;

    // This Code extracts Values of Every Element and convert it into an array.
    const formData = new FormData(e.target);
    const values = Array.from(formData.values());

    inputBoxData.value.onClose(action, values);
  };

  effect(() => {
    if (inputBoxData.value.isOpen && container.current) {
      container.current.showModal();
    }
  });

  return (
    <dialog ref={container}>
      <div className="inputbox dialog">
        <h3>{inputBoxData.value.title}</h3>

        <form method="dialog" onSubmit={handleInput}>
          <div className="input">
            {inputBoxData.value.fields.map((field) => (
              <input {...field} />
            ))}
          </div>

          <div className="form-buttons">
            <button className="dialog-btn" value="cancel">
              Cancel
            </button>
            <button className="dialog-btn ok" value="ok">
              OK
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default InputBox;
