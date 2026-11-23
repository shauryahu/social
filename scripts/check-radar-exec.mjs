import { PLATFORM_RADAR_SCRIPT } from "../src/components/sections/platform-radar-script.ts";

// Execute script in a sandbox to inspect IMG and APPS
const ctx = {};
const fn = new Function("window", "document", "HTMLElement", "customElements", PLATFORM_RADAR_SCRIPT);

let customDef = null;
const fakeCustom = {
  get: () => false,
  define: (name, cls) => { customDef = cls; }
};
const fakeDoc = {
  fonts: { ready: Promise.resolve() },
  hidden: false
};
const fakeWin = {
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  addEventListener: () => {},
  removeEventListener: () => {}
};

fn(fakeWin, fakeDoc, class {}, fakeCustom);
console.log("Defined custom element:", !!customDef);

// Now instantiate
const instance = new customDef();
let innerHTMLSet = "";
const shadow = {
  innerHTML: "",
  host: { classList: { add: () => {}, remove: () => {}, toggle: () => {} } },
  querySelector: (sel) => {
    return {
      classList: { add: () => {}, remove: () => {}, toggle: () => {} },
      setAttribute: () => {},
      getAttribute: () => null,
      addEventListener: () => {},
      style: {},
      querySelectorAll: () => [],
      insertBefore: () => {}
    };
  },
  querySelectorAll: (sel) => []
};

instance.attachShadow = () => shadow;
instance.connectedCallback();

console.log("Shadow DOM populated length:", shadow.innerHTML.length);
console.log("Does it contain .app?", shadow.innerHTML.includes('class="app"'));
console.log("Does it contain .tile?", shadow.innerHTML.includes('class="tile"'));
console.log("Does it contain data:image/webp?", shadow.innerHTML.includes('data:image/webp'));
