const shortcutsFuns = new Map();

export const registerShortcut = (name, callback) => {
  if (callback) {
    shortcutsFuns.set(name, callback);
  }

  return name;
};

export const unregisterShortcut = (name) => {
  return shortcutsFuns.delete(name);
};

export const getShortcut = (name) => {
  const callback = shortcutsFuns.get(name);

  if (callback) {
    return callback;
  } else {
    return null;
  }
};
