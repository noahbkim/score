import {Sheet} from "./sheet";
import {Context} from "./context";

window.addEventListener("load", () => {
  const context = new Context();
  const sheet = new Sheet(context);
  document.body.replaceChild(sheet.root, document.getElementById("sheet"));

  const section = sheet.push();
  section.push();
  section.push();
  section.push();

  // // Load from cache
  // const data = localStorage.getItem("sheet");
  // if (data !== null) {
  //   try {
  //     sheet.load(JSON.parse(data));
  //   } catch (e) {
  //     console.error("Failed to load sheet from local storage:", e);
  //     sheet.clear();
  //   }
  // }
  //
  // // Set to write to cache on exit
  // window.addEventListener("beforeunload", () => {
  //   localStorage.setItem("sheet", JSON.stringify(sheet.dump()));
  // });
});
