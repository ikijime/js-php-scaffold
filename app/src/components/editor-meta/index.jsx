import React from "react";
import { Modal, Button } from "react-bootstrap";

export default class EditorMeta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        title: "",
        keywords: "",
        description: "",
      },
    };
  }

  componentDidMount() {
    this.getMeta(this.props.virtualDom);
  }

  componentDidUpdate(prevProps) {
    if(this.props.virtualDom !== prevProps.virtualDom) {
        this.getMeta(this.props.virtualDom);
    }
  }

  getMeta(virtualDom) {
    this.title =
      virtualDom.head.querySelector("title") ||
      virtualDom.head.appendChild(virtualDom.createElement("title"));

    this.description = virtualDom.head.querySelector(
      'meta[name="description"]'
    );
    if (!this.description) {
      this.description = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.description.setAttribute("name", "description");
    }

    this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
    if (!this.keywords) {
      this.keywords = virtualDom.head.appendChild(
        virtualDom.createElement("meta")
      );
      this.keywords.setAttribute("name", "keywords");
    }

    this.setState({
      meta: {
        title: this.title.innerHTML,
        description: this.description.getAttribute("content"),
        keywords: this.keywords.getAttribute("content"),
      },
    });
  }

  applyMeta() {
    this.title.innerHTML = this.state.meta.title;
    this.keywords.setAttribute("content", this.state.meta.keywords);
    this.description.setAttribute("content", this.state.meta.description);
    this.props.handleClose();
  }

  onValueChange(e) {
    if (e.target.getAttribute("data-title")) {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          title: e.target.value,
        };

        return {
          meta: newMeta,
        };
      });
    } else if (e.target.getAttribute("data-keywords")) {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          keywords: e.target.value,
        };

        return {
          meta: newMeta,
        };
      });
    } else {
      e.persist();
      this.setState(({ meta }) => {
        const newMeta = {
          ...meta,
          description: e.target.value,
        };

        return {
          meta: newMeta,
        };
      });
    }
  }

  render() {
    const { target, handleClose, method } = this.props;
    const { title, keywords, description } = this.state.meta;
    return (
      <Modal show={target} onHide={handleClose}>
        <Modal.Body>
          <form>
            <div className="form-group">
              <input
                data-title
                className="form-control"
                id="title"
                placeholder="title"
                value={title}
                onChange={(e) => this.onValueChange(e)}
              />

              <input
                data-keywords
                className="form-control mt-2"
                id="keywords"
                placeholder={keywords}
                onChange={(e) => this.onValueChange(e)}
              />

              <textarea
                data-description
                className="form-control mt-2"
                id="description"
                rows="3"
                placeholder={description}
                onChange={(e) => this.onValueChange(e)}
              ></textarea>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => this.applyMeta()}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
