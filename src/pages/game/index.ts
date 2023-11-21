import { state } from "../../state";

class PlayPage extends HTMLElement{
  shadow = this.attachShadow({mode: "open"})
  constructor(){
    super();
    this.render();
  }
  render(){
    const initialDiv = document.createElement("div");
    const style = document.createElement("style");
    const backgroundURL = require("url:../../img/fondo.svg");
  
    const initLocalState = state.getState();
  
    initialDiv.innerHTML = `
      <div class="playground-div">
        <div class="opponent-play">

        </div>
      <div>
          <timer-el></timer-el>
      </div>

      <div class="play-div">
          <play-selection selection="piedra" class="disabled" id="piedra"></play-selection>
          <play-selection selection="papel" class="disabled" id="papel"></play-selection>
          <play-selection selection="tijera" class="disabled" id="tijera"></play-selection>
      </div>
    </div>
    `;

    style.textContent = `
        .playground-div{
          font-family: var(--main-font);
          background-image: url(${backgroundURL});
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 100vh;
      }
  
      @media(min-width:768px){
        play-selection{
  
        }
      }
      
  
      .disabled{
        opacity: 45%;
      }
      @media(min-width: 768px){
        .disabled{
        }
      }
  
      .enabled{
      }
      @media(min-width: 768px){
        .enabled{
        }
      }
  
  
      .play-div{
        max-height: 150px;
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        position: relative;
        top: 10px;
      }
      @media(min-width: 530px){
        .play-div{
          top: 85px;
        }
      }
      @media(min-width: 768px){
        .play-div{
          top: -60px;
        }
      }
      @media(min-width: 1650px){
        .play-div{
          top: 70px;
        }
      }
  
      .opponent-play{
        transform: rotate(180deg);
        position: relative;
        top: -20px;
      }
      @media(min-width: 530px){
        .opponent-play{
          top: -120px;
        }
      }
      @media(min-width: 768px){
        .opponent-play{
          top: 40px;
        }
      }
      @media(min-width: 1650px){
        .opponent-play{
          top: -80px;
        }
      }
  
      .off{
        display: none;
      }
  
      .on{
        display: inherit;
      }
  
      .finished{
        display: none;
      }
    `;
    
    const piedraEl = initialDiv.querySelector("#piedra");
    const papelEl = initialDiv.querySelector("#papel");
    const tijeraEl = initialDiv.querySelector("#tijera");
  
    piedraEl?.addEventListener("click", () => {
      piedraEl?.classList.replace("disabled", "enabled");
      papelEl?.classList.replace("enabled", "disabled");
      tijeraEl?.classList.replace("enabled", "disabled");
    });
    papelEl?.addEventListener("click", () => {
      papelEl?.classList.replace("disabled", "enabled");
      piedraEl?.classList.replace("enabled", "disabled");
      tijeraEl?.classList.replace("enabled", "disabled");
    });
    tijeraEl?.addEventListener("click", () => {
      tijeraEl?.classList.replace("disabled", "enabled");
      papelEl?.classList.replace("enabled", "disabled");
      piedraEl?.classList.replace("enabled", "disabled");
    });
  
    const timeToPlay = setInterval(() => {
      const tijeraClicked = tijeraEl?.classList.contains("disabled");
      const papelClicked = papelEl?.classList.contains("disabled");
      const piedraClicked = piedraEl?.classList.contains("disabled");
  
      if (tijeraClicked && papelClicked && piedraClicked) {
        //Se usa location.reload, ya que si se usa el goTo, entra en bucle.
        clearInterval(timeToPlay);
        console.log("NO HAS JUGADO NADA")
        // location.reload();
      }
      clearInterval(timeToPlay);
    }, 3100);
  
    const showPlay = setInterval(() => {
      const piedraEl = initialDiv.querySelector("#piedra");
      const papelEl = initialDiv.querySelector("#papel");
      const tijeraEl = initialDiv.querySelector("#tijera");
  
      if (piedraEl?.classList.contains("enabled")) {
        state.setActualPlay("piedra");
        papelEl?.classList.add("off");
        tijeraEl?.classList.add("off");
      }
      if (papelEl?.classList.contains("enabled")) {
        state.setActualPlay("papel");
        tijeraEl?.classList.add("off");
        piedraEl?.classList.add("off");
      }
      if (tijeraEl?.classList.contains("enabled")) {
        state.setActualPlay("tijera");
        papelEl?.classList.add("off");
        piedraEl?.classList.add("off");
      }
  
      clearInterval(showPlay);
    }, 5000);
  
    // const showComputerPlay = setInterval(() => {
    //   const cs = state.getState();
  
    //   var computerChoice = cs.currentGame.computerPlay;
  
    //   const playSelectionEl = `
    //     <play-selection selection="${computerChoice}" class="on" id="opponent-play"></play-selection>
    //   `;
  
    //   const computerPlayEl = initialDiv.querySelector(".opponent-play") as HTMLElement;
    //   computerPlayEl.innerHTML = playSelectionEl;
  
    //   clearInterval(showComputerPlay);
    // }, 5050);
  
  
    initialDiv.appendChild(style);
    this.shadow.appendChild(initialDiv);
  }
}

customElements.define("play-page", PlayPage)
