require("@testing-library/jest-dom/extend-expect");
require("@testing-library/jest-dom");

window.URL.createObjectURL = function () { };
window.ResizeObserver = class {
    observe = function () { };
    unObserve = function () { }
}
