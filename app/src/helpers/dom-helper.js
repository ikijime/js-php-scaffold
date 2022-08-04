export default class DOMHelper {
  static parseStrToDom(domStr) {
    const parser = new DOMParser();
    return parser.parseFromString(domStr, "text/html");
  }

  static serializeDOMToString(dom) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
  }

  static wrapTextNodes(dom) {
    const body = dom.body;

    let textNodes = [];

    function recur(element) {
      element.childNodes.forEach((node) => {
        if (
          node.nodeName === "#text" &&
          node.nodeValue.replace(/\s+/g, "").length > 0
        ) {
          textNodes.push(node);
        } else {
          recur(node);
        }
      });
    }

    recur(body);

    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement("text-editor");
      node.parentNode.replaceChild(wrapper, node);
      wrapper.appendChild(node);
      wrapper.setAttribute("nodeid", i);
    });

    return dom;
  }

  static unwrapTextNodes(dom) {
    dom.body.querySelectorAll("text-editor").forEach((element) => {
      element.parentNode.replaceChild(element.firstChild, element);
    });
  }

  static wrapImages(dom) {
    dom.body.querySelectorAll('img').forEach((img, i) => {
      img.setAttribute('editableimgid', i);
    });

    return dom;
  }

  static unwrapImages(dom) {
    dom.body.querySelectorAll('[editableimgid]').forEach((img) => {
      img.removeAttribute('editableimgid');
    });
  }
}
