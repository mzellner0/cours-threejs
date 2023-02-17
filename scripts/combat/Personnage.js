import { capitalize } from "../utils.js";
import PopUp from "./PopUp.js";

export default class Personnage {
  constructor(
    pointDeVie,
    energie,
    nom,
    imageSource,
    estDuCoteObscure,
    jeu,
    attaques,
    estChoisi
  ) {
    this.pointDeVie = pointDeVie;
    this.pointDeVieInitial = pointDeVie;
    this.energie = energie;
    this.energieInitiale = energie;
    this.estDuCoteObscure = estDuCoteObscure;
    this.jeu = jeu;
    this.attaques = attaques;
    this.estChoisi = estChoisi;
    this.nom = nom;
    this.energieMinimum;

    this.creerHtmlBase(nom, imageSource)
    this.creerHtmlVie();
    this.creerHtmlEnergie();
    this.createAttaques();
  }

  creerHtmlBase(nom, imageSource) {
    this.divPersonnage = document.createElement("div");
    this.divPersonnage.classList.add("personnage");
    this.divPersonnage.classList.add(nom);

    const divPersonnages =
      document.querySelector(".personnages");
    divPersonnages.appendChild(this.divPersonnage);

    if (this.estChoisi) {
      const pseudo = document.createElement("p");
      pseudo.textContent = localStorage.getItem("pseudo");
      pseudo.classList.add("pseudo");
      this.divPersonnage.appendChild(pseudo);
    } else {
      const div = document.createElement("div");
      div.classList.add("espace");
      this.divPersonnage.appendChild(div);
    }

    const img = document.createElement("img");
    img.src = imageSource;
    img.alt = nom;
    this.divPersonnage.appendChild(img);
  }

  creerHtmlVie() {
    this.creerParagrapheVie();
    const vieTotal = document.createElement("div");
    vieTotal.classList.add("total-bar");
    this.divVie = document.createElement("div");
    this.divVie.classList.add("vie");
    this.divVie.classList.add("niveau-bar");
    this.divPersonnage.appendChild(vieTotal);
    vieTotal.appendChild(this.divVie);
  }

  creerHtmlEnergie() {
    this.creerParagrapheEnergie();
    const energieTotal = document.createElement("div");
    energieTotal.classList.add("total-bar");
    this.divEnergie = document.createElement("div");
    this.divEnergie.classList.add("energie");
    this.divEnergie.classList.add("niveau-bar");
    this.divPersonnage.appendChild(energieTotal);
    energieTotal.appendChild(this.divEnergie);
  }

  createAttaques() {
    if (this.estChoisi) {
      this.creerParagraphe("Mes attaques :");

      let classList;
      if (this.estDuCoteObscure) {
        classList = ["red-illumination"];
      } else {
        classList = ["green-illumination"];
      }

      for (let attaque of this.attaques) {
        attaque.creerHtmlElmt(
          this.divPersonnage,
          classList
        );

        if (
          !this.energieMinimum ||
          this.energieMinimum > attaque.energieNecessaire
        ) {
          this.energieMinimum = attaque.energieNecessaire
        }
      }
      this.divPersonnage.classList.add("first");
    }
  }

  attaquerPersonnage(
    animationName,
    attaqueChoisie,
    callback
  ) {
    if (
      this.pointDeVie > 0 &&
      this.energie >= attaqueChoisie.energieNecessaire
    ) {
      this.ajouteAnimationAttaque(
        animationName
      );
      this.jeu.ennemi.enleverDesPV(
        attaqueChoisie.degat
      );
      this.diminuerEnergie(attaqueChoisie.energieNecessaire);
      callback();
    } else if (
      this.pointDeVie > 0 &&
      this.energie >= this.energieMinimum
    ) {
      new PopUp(
        "Tu n'as plus assez d'énergie pour effectuer cette attaque. Choisis-en une autre !",
        () => {}
      );
    } else if (this.pointDeVie > 0) {
      callback();
    } else {
      this.jeu.ennemi.gagne();
    }
  }

  diminuerEnergie(energieAttaque) {
    const factor = 100 / this.energieInitiale;
    this.energie = this.energie - energieAttaque;
    this.divEnergie.style.width = `calc(${this.energie * factor}% - var(--padding-vie))`;
    this.modifierTextContentEnergie();
  }

  enleverDesPV(pointDeVie) {
    const factor = 100 / this.pointDeVieInitial;
    this.pointDeVie = this.pointDeVie - pointDeVie;
    this.divVie.style.width = `calc(${this.pointDeVie * factor}% - var(--padding-vie))`;
    this.modifierTextContentVie();
  }

  creerParagraphe(text) {
    const paragraphe = document.createElement("p");
    paragraphe.textContent = text;
    this.divPersonnage.appendChild(paragraphe);
  }

  creerParagrapheVie() {
    this.paragrapheVie = document.createElement("p");
    this.modifierTextContentVie();
    this.divPersonnage.appendChild(this.paragrapheVie);
  }

  modifierTextContentVie() {
    this.paragrapheVie.textContent = `Vie restante : ${this.pointDeVie} / ${this.pointDeVieInitial}`;
  }

  creerParagrapheEnergie() {
    this.paragrapheEnergie = document.createElement("p");
    this.modifierTextContentEnergie();
    this.divPersonnage.appendChild(this.paragrapheEnergie);
  }

  modifierTextContentEnergie() {
    this.paragrapheEnergie.textContent = `Energie restante : ${this.energie} / ${this.energieInitiale}`;
  }

  ajouteAnimationAttaque(animationName) {
    this.divPersonnage.classList.add(
      animationName
    );

    let duration = getComputedStyle(
      document.body
    ).getPropertyValue(
      "--duration-animation-attaque"
    );

    duration = duration.replace("ms", "");
    duration = parseInt(duration);

    setTimeout(() => {
      this.enleveAnimationAttaque(animationName);
    }, duration);
  }

  enleveAnimationAttaque(animationName) {
    this.divPersonnage.classList.remove(animationName);
  }

  gagne() {
    const section = document.getElementsByTagName("section")[0];

    const p = document.createElement("p");
    p.textContent = `${ capitalize(this.nom) } a gagné !`;

    section.appendChild(p);
  }

  getPointDeViePourcentage() {
    return this.pointDeVie / this.pointDeVieInitial;
  }
}