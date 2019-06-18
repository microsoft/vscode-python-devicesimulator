// Helpers designed to help to make a simulator accessible.
namespace accessibility {
  export function makeFocusable(elem: SVGElement): void {
    elem.setAttribute("focusable", "true");
    elem.setAttribute("tabindex", "0");
  }
}

export default accessibility;
