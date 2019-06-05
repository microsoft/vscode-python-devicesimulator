// Adapted from : https://github.com/microsoft/pxt/blob/master/pxtsim/svg.ts


namespace svg {

    export function hydrate(el: SVGElement, props: any) {
        for (let k in props) {
            if (k == "title") {
                svg.title(el, props[k])
            } else el.setAttributeNS(null, k, props[k])
        }
    }

    export function elt(name: string, props?: any): SVGElement {
        let el = document.createElementNS("http://www.w3.org/2000/svg", name)
        if (props)
            svg.hydrate(el, props);
        return el;
    }

    export function child(parent: Element, name: string, props?: any): SVGElement {
        let el = svg.elt(name, props);
        parent.appendChild(el);
        return el;
    }

    export function fill(el: SVGElement, c: string) {
        el.style.fill = c;
    }

    export function filter(el: SVGElement, c: string) {
        el.style.filter = c;
    }

    export function fills(els: SVGElement[], c: string) {
        els.forEach(el => el.style.fill = c);
    }

    export function mkTitle(txt: string): SVGTitleElement {
        let t = svg.elt("title") as SVGTitleElement;
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