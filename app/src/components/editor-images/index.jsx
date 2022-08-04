export default class EditorImages {
    constructor(element, virtualElement, ...cbs) {
        this.element = element;
        this.virtualElement = virtualElement;
        
        this.element.addEventListener('click', () => this.onClick());
        this.imgUploader = document.querySelector("#img-upload");
        this.isLoading = cbs[0];
        this.isLoaded = cbs[1];
        this.notify = cbs[2];
    }
    
    onClick() {
        this.imgUploader.click();
        this.imgUploader.addEventListener('change', () => {
            if (this.imgUploader.files && this.imgUploader.files[0]) {
                let formData = new FormData();
                formData.append("image", this.imgUploader.files[0]);
                this.isLoading();
                fetch("./api/pages/uploadImage", {
                    method: "POST",
                    body: formData
                })
                .then((response) => response.json())
                .then((response) => { 
                    this.virtualElement.src = this.element.src = `./img/${response.src}`;
                    this.imgUploader.value = "";
                    this.isLoaded();
                    this.notify('success', 'Image changed.');
                })
                .catch(() => this.notify('danger', 'Something went wrong.'));
            }
        })
    }
  }
  