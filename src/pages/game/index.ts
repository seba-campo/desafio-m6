import { Router } from "@vaadin/router";
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

      state.setActualPlay("piedra");
      state.setPlayInRtdb(()=>{console.log("SETEADO EN RTDB - /game")})

    });
    papelEl?.addEventListener("click", () => {
      papelEl?.classList.replace("disabled", "enabled");
      piedraEl?.classList.replace("enabled", "disabled");
      tijeraEl?.classList.replace("enabled", "disabled");

      state.setActualPlay("papel");
      state.setPlayInRtdb(()=>{console.log("SETEADO EN RTDB - /game")})
    });
    tijeraEl?.addEventListener("click", () => {
      tijeraEl?.classList.replace("disabled", "enabled");
      papelEl?.classList.replace("enabled", "disabled");
      piedraEl?.classList.replace("enabled", "disabled");

      state.setActualPlay("tijera");
      state.setPlayInRtdb(()=>{console.log("SETEADO EN RTDB - /game")})
    });
  
    const showPlay = setInterval(() => {
      const piedraEl = initialDiv.querySelector("#piedra");
      const papelEl = initialDiv.querySelector("#papel");
      const tijeraEl = initialDiv.querySelector("#tijera");
  
      if (piedraEl?.classList.contains("enabled")) {
        papelEl?.classList.add("off");
        tijeraEl?.classList.add("off");
      }
      if (papelEl?.classList.contains("enabled")) {
        tijeraEl?.classList.add("off");
        piedraEl?.classList.add("off");
      }
      if (tijeraEl?.classList.contains("enabled")) {
        papelEl?.classList.add("off");
        piedraEl?.classList.add("off");
      }
      
      clearInterval(showPlay);
    }, 5000);
    
    const showOpponentPlay = setInterval(() => {
      const cs = state.getState();

      var playerOpponent = "";
  
      switch(cs.localPlayerName){
        case cs.realTimeRoom.participants.owner.nombre:
            playerOpponent = cs.realTimeRoom.sessionPlays.actual.opponent
          break
  
        case cs.realTimeRoom.participants.opponent.nombre:
            playerOpponent = cs.realTimeRoom.sessionPlays.actual.owner
          break
      }
      
  
      var playSelectionEl = `
        <play-selection selection="${playerOpponent}" class="on" id="opponent-play"></play-selection>
      `;
  
      const computerPlayEl = initialDiv.querySelector(".opponent-play") as HTMLElement;
      computerPlayEl.innerHTML = playSelectionEl;

      clearInterval(showOpponentPlay);
      
    }, 5350);
    
    const goTo = setInterval(()=>{
      Router.go("/results")
      
      clearInterval(goTo)

    }, 7700 );
    
  
    initialDiv.appendChild(style);
    this.shadow.appendChild(initialDiv);
  }
}

customElements.define("play-page", PlayPage)
