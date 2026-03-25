export default class Form {
  constructor(globalScenes) {
    this.globalScenes = globalScenes;

    this.buttons = document.querySelectorAll(
      ".personnages button"
    );
    this.form = document.querySelector("form");
    this.submitButton = document.querySelector("form button");
    this.vador = document.querySelector(".vador");
    this.luke = document.querySelector(".luke");
    this.inputs = document.getElementsByTagName("input");
    this.validatedInputs = [];

    this.showForm();
    this.onSelectColor();
    this.checkInputsWithEvent();
    this.goToFightPage();
  }

  showForm() {
    for (let button of this.buttons) {
      button.addEventListener(
        "click",
        () => this.onClickButton(button)
      );
    }
  }

  onSelectColor() {
    document.querySelector(".color input")
      .addEventListener("input", (event) => {
        for (let scene of this.globalScenes) {
          if (
            scene.idCanvas.includes(this.nomPersonnageSelectionne)
          ) {
            const color = event.target.value;
            scene.personnages3D[
              this.nomPersonnageSelectionne
            ].updateColorSaber(color);
            localStorage.setItem("colorSaber", color)
            break;
          }
        }
    })
  }
  
  onClickButton(button) {
    this.enabledHtmlElmt(this.form);
    this.form.classList.add("translate-null");
  
    if (button.value == "luke") {
      this.disabledHtmlElmt(this.vador);
      this.submitButton.classList.add("green-illumination");
    } else {
      this.disabledHtmlElmt(this.luke);
      this.submitButton.classList.add("red-illumination");
    }

    this.nomPersonnageSelectionne = button.value;
  
    localStorage.setItem("jediChoisi", button.value);

    this.checkInputs();
  }
  
  goToFightPage() {
    this.submitButton.addEventListener(
      "click",
      this.onClickSubmitButton.bind(this)
    )
  }
  
  onClickSubmitButton(event) {
    event.preventDefault();
    localStorage.setItem("pseudo", this.inputs[0].value);
    const base = window.location.pathname.replace(/\/[^/]*$/, ""); // removes current file
    window.location.href = `${base}/combat.html`;
  }
  
  checkInputsWithEvent() {
    for (let input of this.inputs) {
      input.addEventListener(
        "input",
        () => this.onDetectChangeInInput(input)
      )
    }
  }

  checkInputs() {
    for (let input of this.inputs) {
      this.onDetectChangeInInput(input);
    }
  }
  
  onDetectChangeInInput(input) {
    if (
      input.value != "" &&
      !this.validatedInputs.includes(input)
    ) {
      this.validatedInputs.push(input);
    } else if (
      input.value == "" &&
      this.validatedInputs.includes(input)
    ) {
      this.validatedInputs = this.validatedInputs.filter(
        elmt => input != elmt
      );
    }
  
    if (this.validatedInputs.length == this.inputs.length) {
      this.enabledHtmlElmtVisble(this.submitButton);
    }
  }
  
  enabledHtmlElmtVisble(htmlElmt) {
    htmlElmt.classList.remove("disabled-but-visible");
  }
  
  disabledHtmlElmt(htmlElmt) {
    htmlElmt.classList.add("disabled");
  }
  
  enabledHtmlElmt(htmlElmt) {
    htmlElmt.classList.remove("disabled");
  }
}