import { showToolips } from "../store/notes.helper.js";

export const safeRun = async (
  asyncFun,
  customMessage = "Something went wrong!",
  toolips = true,
) => {
  try {
    const data = await asyncFun();
    return [data, null];
  } catch (e) {
    console.log(e);
    if (toolips) showToolips(customMessage || e.message, "alert");

    return [null, e]; // error
  }
};
