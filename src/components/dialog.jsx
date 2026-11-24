import { effect } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";

import "./styles/dialog.css";

import { dialogData } from "../store/notes.store.js";

const Dialog = () => {
  const dialogContainer = useSignalRef(null);

  const handleDialogInput = (e) => {
    const action = e.submitter?.value;
    dialogData.value.onClose(action);
  };

  effect(() => {
    if (dialogData.value.isOpen && dialogContainer.current) {
      dialogContainer.current.showModal();
    }
  });

  return (
    <dialog ref={dialogContainer}>
      <div className="dialog">
        <h3>{dialogData.value.title}</h3>
        <p>{dialogData.value.desc}</p>

        <form method="dialog" onSubmit={handleDialogInput}>
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

export default Dialog;
