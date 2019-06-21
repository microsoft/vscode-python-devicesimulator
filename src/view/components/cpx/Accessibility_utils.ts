// Helpers designed to help to make a simulator accessible.
namespace accessibility {
  export function makeFocusable(elem: SVGElement): void {
    elem.setAttribute("focusable", "true");
    elem.setAttribute("tabindex", "0");
  }

  export function setAria(elem: Element, role?: string, label?: string): void {
    if (role && !elem.hasAttribute("role")) {
      elem.setAttribute("role", role);
    }

    if (label && !elem.hasAttribute("aria-label")) {
      elem.setAttribute("aria-label", label);
    }
  }
}

export default accessibility;
