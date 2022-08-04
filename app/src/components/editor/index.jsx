import React from "react";
import "../../helpers/iframeloader.js";
import DOMHelper from "../../helpers/dom-helper.js";
import EditorText from "../editor-text/index.jsx";
import { Alert, Button } from "react-bootstrap";
import EditorSpinner from "../spinner/index.jsx";
import ConfirmModal from "../confirm-modal/index.jsx";
import ChooseModal from "../choose-modal/index.jsx";
import EditorMeta from "../editor-meta/index.jsx";
import EditorImages from "../editor-images/index.jsx";
import Login from "../login/index.jsx";

export default class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      loginError: false,
      loginLengthError: false,
      pages: [],
      backups: [],
      newPageName: "",
      currentPage: "index.html",
      auth: false,
      modals: {
        showModalConfirm: false,
        showModalChoose: false,
        showModalBackups: false,
        showModalMeta: false,
        showModalLogin: false,
      },
      loading: true,
      alert: {
        show: false,
        message: "test message",
        status: "success",
      },
    };

    this.save = this.save.bind(this);
    this.init = this.init.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.isLoaded = this.isLoaded.bind(this);
    this.restoreBackup = this.restoreBackup.bind(this);
    this.notify = this.notify.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.checkAuth();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.auth !== prevState.auth) {
      this.init(null, this.state.currentPage);
    }
  }

  checkAuth() {
    fetch("./api/pages/auth")
      //.then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({
          auth: response.auth,
        });
      });
  }

  login(e, password) {
    e.preventDefault();
    console.log("is something even happening");
    if (password.length > 7) {
      fetch("./api/pages/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            auth: response.auth,
            loginError: !response.auth,
            loginLengthError: false,
          });
        });
    } else {
      this.setState({
        loginError: false,
        loginLengthError: true,
      });
    }
  }

  init(e, page) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.auth) {
      this.isLoading();
      this.iframe = document.querySelector("iframe");
      this.open(page, this.isLoaded);
      this.isLoaded();
      this.loadPages();
      this.loadBackups();
    }
  }

  loadPages() {
    fetch("./api/pages/")
      .then((response) => response.json())
      .then((res) => {
        this.setState({ pages: res });
      })
      .catch((error) => console.error(error));
  }

  loadBackups() {
    fetch("./api/backups/backups.json")
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          backups: res.filter((backup) => {
            return backup.path === this.state.currentPage;
          }),
        });
      })
      .catch((error) => console.error(error));
  }

  open(page, cb) {
    this.setState({ currentPage: page });

    fetch(`../../${page}`)
      .then((response) => response.text())
      .then((response) => DOMHelper.parseStrToDom(response))
      .then(DOMHelper.wrapTextNodes)
      .then(DOMHelper.wrapImages)
      .then((dom) => {
        this.virtualDom = dom;
        return dom;
      })
      .then(DOMHelper.serializeDOMToString)
      .then((html) => {
        return fetch("./api/pages/savetemp", {
          method: "POST",
          body: JSON.stringify({ html }),
        });
      })
      .then(() => {
        return this.iframe.load("../we2neqwjndifv.html");
      })
      .then(() => {
        return fetch("./api/pages/deleteTemp", { method: "POST" });
      })
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(cb)
      .catch((error) => {
        console.error(error);
      });
    this.loadBackups();
  }

  async save() {
    this.isLoading();
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    DOMHelper.unwrapImages;
    const html = DOMHelper.serializeDOMToString(newDom);
    await fetch("./api/pages/save", {
      method: "POST",
      body: JSON.stringify({ pageName: this.state.currentPage, html: html }),
    })
      .then((res) => {
        if (res.status === 200) {
          this.notify("success", "Success");
        } else {
          this.notify("danger", `Failed ${res.status} ${res.statusText}`);
        }
      })
      .catch((err) => {
        console.error(err);
        this.notify("danger", "Failed while saving page.");
      })
      .finally(this.isLoaded);
    this.loadBackups();
  }

  notify(status, message) {
    this.setState({
      alert: {
        status: status,
        show: true,
        message: message,
      },
    });
  }

  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach((element) => {
        const id = element.getAttribute("nodeid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[nodeid="${id}"]`
        );
        new EditorText(element, virtualElement);
      });

    this.iframe.contentDocument.body
      .querySelectorAll("[editableimgid]")
      .forEach((element) => {
        const id = element.getAttribute("editableimgid");
        const virtualElement = this.virtualDom.body.querySelector(
          `[editableimgid="${id}"]`
        );
        new EditorImages(
          element,
          virtualElement,
          this.isLoading,
          this.isLoaded,
          this.notify
        );
      });
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement("style");
    style.innerHTML = `
        text-editor:hover {
            outline: 3px solid orange;
            outline-offset: 8px;
        }
        text-editor:focus {
            outline: 3px solid red;
            outline-offset: 8px;
        }
        [editableimgid]:hover {
          outline: 3px solid orange;
          outline-offset: 8px;
        }
    `;
    this.iframe.contentDocument.head.appendChild(style);
  }

  logout() {
    fetch("./api/logout")
      .then(() => {
        window.location.replace("/");
      })
  }

  isLoading() {
    this.setState({ loading: true });
  }

  isLoaded() {
    this.setState({ loading: false });
  }

  handleClose = (modalType) => {
    const newState = { modals: { [modalType]: false } };
    this.setState({ ...newState });
  };

  handleShow = (modalType) => {
    const newState = { modals: { [modalType]: true } };
    this.setState({ ...newState });
  };

  handleCloseSave = (modalType) => {
    this.save();
    this.handleClose(modalType);
  };

  restoreBackup(e, item) {
    if (e) {
      e.preventDefault();
    }
    this.isLoading();
    fetch("./api/pages/restore", {
      method: "POST",
      body: JSON.stringify({
        path: item.path,
        file: item.file,
        time: item.time,
      }),
    }).then(() => {
      this.open(this.state.currentPage, this.isLoaded);
    });
  }

  render() {
    const { loading, backups, pages, loginError, loginLengthError } = this.state;
    let spinner;
    loading ? (
      (spinner = <EditorSpinner active panel-spinner />)
    ) : (
      <EditorSpinner />
    );

    if (!this.state.auth) {
      return (
        <Login
          target={this.state.modals.showModalConfirm}
          login={this.login}
          lenghtError={loginLengthError}
          loginError={loginError}
        />
      );
    }

    return (
      <>
        <div className="panel">
          <Button
            variant="primary"
            onClick={() => this.handleShow("showModalChoose")}
          >
            Open
          </Button>
          <Button
            variant="primary"
            onClick={() => this.handleShow("showModalConfirm")}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => this.handleShow("showModalBackups")}
          >
            Restore
          </Button>
          <Button
            variant="secondary"
            onClick={() => this.handleShow("showModalMeta")}
          >
            Meta
          </Button>
          <Button onClick={() => this.logout()}>
            Logout
          </Button>
        </div>

        <div>
          <Alert
            show={this.state.alert.show}
            variant={this.state.alert.status}
            onClose={() => this.setState({ alert: { show: false } })}
            dismissible
          >
            <p>{this.state.alert.message}</p>
          </Alert>
        </div>

        <iframe src="" frameBorder="0"></iframe>
        <input
          id="img-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
        ></input>
        {spinner}

        {/**************MODAL WINDOWS********************/}
        <ConfirmModal
          target={this.state.modals.showModalConfirm}
          handleClose={() => this.handleClose("showModalConfirm")}
          method={() => this.handleCloseSave("showModalConfirm")}
        />

        <ChooseModal
          target={this.state.modals.showModalChoose}
          handleClose={() => this.handleClose("showModalChoose")}
          redirect={this.init}
          data={pages}
        />

        <ChooseModal
          target={this.state.modals.showModalBackups}
          handleClose={() => this.handleClose("showModalBackups")}
          redirect={this.restoreBackup}
          data={backups}
        />

        {this.virtualDom ? (
          <EditorMeta
            virtualDom={this.virtualDom}
            target={this.state.modals.showModalMeta}
            handleClose={() => this.handleClose("showModalMeta")}
            redirect={this.editMeta}
          />
        ) : (
          false
        )}
      </>
    );
  }
}
