import { state } from "../../state";
import { Router } from "@vaadin/router";

class Results extends HTMLElement{
  shadow = this.attachShadow({mode: "open"})
  constructor(){
    super();
    this.render(); 
  }
  render(){
    console.log("Renderizado results")
    const div = document.createElement("div");
    const style = document.createElement("style");
    const backgroundURL = require("url:../../img/fondo.svg");
    var backgroundColor = "rgba(137, 73, 73, 0.9)"; 
    
    const cs = state.getState();
    console.log(cs);

    var ownerName = cs.realTimeRoom.participants.owner.nombre;
    var opponentName = cs.realTimeRoom.participants.opponent.nombre;
    var lastOpponentPlay = "";
    var lastPlayerPlay = "";
    var localWin : boolean|null = null;
    var whoWin : string|undefined = "";


    switch(cs.localPlayerName){
      // LOCAL = OWNER
      case cs.realTimeRoom.participants.owner.nombre:
          lastOpponentPlay = cs.realTimeRoom.sessionPlays.actual.opponent;
          lastPlayerPlay = cs.realTimeRoom.sessionPlays.actual.owner;
          whoWin = state.whoWins(lastPlayerPlay, lastOpponentPlay)
        break

      // LOCAL = OPPONENT
      case cs.realTimeRoom.participants.opponent.nombre:
          lastOpponentPlay = cs.realTimeRoom.sessionPlays.actual.owner;
          lastPlayerPlay = cs.realTimeRoom.sessionPlays.actual.opponent;
          whoWin = state.whoWins(lastOpponentPlay, lastPlayerPlay)
          break
    }

    switch(cs.localPlayerName){
      // LOCAL = OWNER 
      case cs.realTimeRoom.participants.owner.nombre:
          if(whoWin == "owner"){
            localWin = true
            backgroundColor = "rgba(137, 175, 73, 0.9)";
          }
          if(whoWin == "opponent"){
            localWin = false
          }
          break

      // LOCAL  = OPPONENT
      case cs.realTimeRoom.participants.opponent.nombre:
        if(whoWin == "opponent"){
          localWin = true
          backgroundColor = "rgba(137, 175, 73, 0.9)";
        }
        if(whoWin == "owner"){
          localWin = false
        }
        break
    }
    
    div.innerHTML= `
    <div class="main-wrapper">
    <div class="score-div">
      <score-el won="${localWin}" owner-name="${ownerName}" opponent-name="${opponentName}"></score-el>
      <custom-button class="button-replay" text="Volver a jugar"></custom-button>
      <custom-button class="button-exit" text="Salir"></custom-button>
    </div>

        <div class="playground-div">
          <div class="computer-play">
            <play-selection selection="piedra" class="disabled"></play-selection>
          </div>

          <div class="play-div">
              <play-selection selection="papel" class="disabled"></play-selection>
          </div>
      </div>
    </div>
    `;

    style.textContent = `
    .main-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .score-div{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      position: fixed;
      background-color: ${backgroundColor};
    }

    .button{
      margin: 10px;
    }

    .playground-div{
        font-family: var(--main-font);
        background-image: url(${backgroundURL});
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
    }
    
    .disabled{
      position: relative;
      top: -90px;
      opacity: 45%;
    }

    .enabled{
      position: relative;
      top: -150px;
    }

    .play-div{
      height: 150px;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
    }

    .computer-play{
      transform: rotate(180deg)
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

    div.appendChild(style);
    this.shadow.appendChild(div);

    const replayButton = this.shadow.querySelector(".button-replay");
    const exitButton = this.shadow.querySelector(".button-exit");

    replayButton?.addEventListener("click", ()=>{
      if(cs.localPlayerName == ownerName){
        state.setUnReadyStatus();
        state.updateRtdb(()=>{
          console.log("Setted unready status")
          if(cs.deployed){
            Router.go("/desafio-m6/game-room");
          }
          if(!cs.deployed){
            Router.go("/game-room");
          }
        })
      }
      else{
        if(cs.deployed){
          Router.go("/desafio-m6/game-room");
        }
        if(!cs.deployed){
          Router.go("/game-room");
        }
      }
      
    })
    exitButton?.addEventListener("click", ()=>{
      Router.go("/")
    })


  }
}

customElements.define("results-page", Results);