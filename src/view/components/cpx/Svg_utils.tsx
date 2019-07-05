// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Adapted from : https://github.com/microsoft/pxt/blob/master/pxtsim/svg.ts

namespace svg {
  export function addClass(el: SVGElement, cls: string) {
    if (el.classList) el.classList.add(cls);
    else if (el.className.baseVal.indexOf(cls) < 0)
      el.className.baseVal += " " + cls;
  }

  export function removeClass(el: SVGElement, cls: string) {
    if (el.classList) el.classList.remove(cls);
    else
      el.className.baseVal = el.className.baseVal
        .replace(cls, "")
        .replace(/\s{2,}/, " ");
  }

  export function hydrate(el: SVGElement, props: any) {
    for (let k in props) {
      if (k == "title") {
        svg.title(el, props[k]);
      } else el.setAttributeNS(null, k, props[k]);
    }
  }

  export function createElement(name: string, props?: any): SVGElement {
    let newElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      name
    );
    if (props) svg.hydrate(newElement, props);
    return newElement;
  }

  export function child(
    parent: Element,
    name: string,
    props?: any
  ): SVGElement {
    let childElement = svg.createElement(name, props);
    parent.appendChild(childElement);
    return childElement;
  }

  export function fill(el: SVGElement, c: string) {
    el.style.fill = c;
  }

  export function filter(el: SVGElement, c: string) {
    el.style.filter = c;
  }

  export function fills(els: SVGElement[], c: string) {
    els.forEach(el => (el.style.fill = c));
  }

  export function mkTitle(txt: string): SVGTitleElement {
    let t = svg.createElement("title") as SVGTitleElement;
    t.textContent = txt;
    return t;
  }

  export function title(el: SVGElement, txt: string): SVGTitleElement {
    let t = mkTitle(txt);
    el.appendChild(t);
    return t;
  }
}

export default svg;
