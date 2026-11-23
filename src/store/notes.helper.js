import { toolipsData, dialogData, inputBoxData } from "./notes.store.js";

// helper functions for signals.
export const showToolips = (message, type = "info") => {
  if (message.trim().length === 0) return;
  // this RegExp /(info|alert)/ checks for invalid input in type argument

  toolipsData.value = { type, message };

  setTimeout(() => {
    toolipsData.value = { type: "", message: "" };
  }, 3000);
};

export const showDialog = (title, desc, close) => {
  dialogData.value = {
    isOpen: true,
    title,
    desc,
    onClose: (action) => {
      if (close) close(action);

      dialogData.value = { isOpen: false, title: "", desc: "", onClose: null };
    },
  };
};

export const askInput = (title, fields, close) => {
  inputBoxData.value = {
    isOpen: true,
    title,
    fields,
    onClose: (action, values) => {
      if (close) close(action, values);

      inputBoxData.value = { isOpen: false, title: "", fields: [], onClose: null };
    },
  };
};
