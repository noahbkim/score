import {Sheet} from "./sheet";
import {Context} from "./context";

window.addEventListener("load", () => {
  const context = new Context();
  const sheet = new Sheet(context);
  document.body.replaceChild(sheet.element, document.getElementById("sheet"));

  // Load from cache
  const buffer = localStorage.getItem("sheet");
  if (buffer !== null) {
    try {
      const data = JSON.parse(buffer);
      sheet.load(data);
    } catch (e) {
      console.error("Failed to load sheet from local storage:");
      localStorage.removeItem("sheet");
      sheet.clear();
      throw e;
    }
  }

  // Set to write to cache on exit
  window.addEventListener("beforeunload", () => {
    localStorage.setItem("sheet", JSON.stringify(sheet.dump()));
  });
});
