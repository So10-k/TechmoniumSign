// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getSidebarStateClass } from "./sidebarState";

const sidebarCss = readFileSync(
  fileURLToPath(new URL("../../index.css", import.meta.url)),
  "utf8"
);

describe("sidebar visibility contract", () => {
  it("maps Redux state to explicit open and closed classes", () => {
    expect(getSidebarStateClass(true)).toBe("tm-sidebar-open");
    expect(getSidebarStateClass(false)).toBe("tm-sidebar-closed");
  });

  it("keeps collapsed width under stylesheet control", () => {
    expect(sidebarCss).toMatch(/\.tm-sidebar-closed\s*\{[^}]*width:\s*0/s);
    expect(sidebarCss).toMatch(/\.tm-sidebar-open\s*\{[^}]*width:\s*16rem/s);
  });
});
