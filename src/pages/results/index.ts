import { state } from "../../state";
import { Router } from "@vaadin/router";

class Results extends HTMLElement{
  shadow = this.attachShadow({mode: "open"})
  constructor(){
    super();
    this.render(); 
  }
  connectedCallback(){
    
  }
  render(){
    const initialDiv = document.createElement("div");
    const style = document.createElement("style");
  
    const backgroundURL = require("url:../../img/fondo.svg");

    const currentState = state.getState();
    console.log("STATE DEL RESULTS " + JSON.stringify(currentState))
  
    var lastOpponentPlay = "";
    var lastPlayerPlay = "";
    // const history = currentState.history;

    const ownerName = currentState.roomData.participants.owner.nombre;
    const opponentName = currentState.roomData.participants.opponent.nombre;
    

    var localWin : boolean|null = false;

    switch(currentState.localPlayerName){
      // LOCAL = OWNER
      case currentState.realTimeRoom.participants.owner.nombre:
          lastOpponentPlay = currentState.realTimeRoom.sessionPlays.actual.opponent
          lastPlayerPlay = currentState.realTimeRoom.sessionPlays.actual.owner
        break

      // LOCAL = OPPONENT
      case currentState.realTimeRoom.participants.opponent.nombre:
          lastOpponentPlay = currentState.realTimeRoom.sessionPlays.actual.owner
          lastPlayerPlay = currentState.realTimeRoom.sessionPlays.actual.opponent
        break
    }

    const whoWin = state.whoWins(lastPlayerPlay, lastOpponentPlay);
    var backgroundColor = "rgba(137, 73, 73, 0.9)";
    
    if(currentState.localPlayerName == ownerName && whoWin == "owner"){
        localWin = true;
        var backgroundColor = "rgba(137, 175, 73, 0.9)";
    }
    else if(currentState.localPlayerName == ownerName && whoWin == "opponent"){
      localWin = false;
    }


    if(currentState.localPlayerName == opponentName && whoWin == "opponent"){
        localWin = true;
        var backgroundColor = "rgba(137, 175, 73, 0.9)";
    }
    else if(currentState.localPlayerName == opponentName && whoWin == "owner"){
      localWin = true;
    }

    if(whoWin == "empate"){
        localWin = null
    }
  
    initialDiv.innerHTML = `
        <div class="main-wrapper">
          <div class="score-div">
                <score-el won="${localWin}" owner-name="${ownerName}" opponent-name="${opponentName}"></score-el>
  
                <custom-button class="button-replay" text="Volver a jugar"></custom-button>
                <custom-button class="button-exit" text="Salir"></custom-button>
          </div>
  
            <div class="playground-div">
              <div class="computer-play">
                <play-selection selection="${lastOpponentPlay}" class="disabled"></play-selection>
              </div>
  
              <div class="play-div">
                  <play-selection selection="${lastPlayerPlay}" class="disabled"></play-selection>
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

    
  
    const buttonReplay = initialDiv.querySelector(".button-replay");
    buttonReplay?.addEventListener("click", () => {
      state.setUnReadyStatus();
      state.updateRtdb(()=>{
        console.log("UPDATE RTDB RESULTS")
        state.updateHistory(()=>{
          const cs = state.getState();

          if(cs.deployed){
            Router.go("/desafio-m6/game-room")
          }
          if(!cs.deployed){
            Router.go("/game-room")
          }
          })
      });
      
    });
  
    const buttonExit = initialDiv.querySelector(".button-exit");
    buttonExit?.addEventListener("click", () => {
      const cs = state.getState();

      if(cs.deployed){
        Router.go("/desafio-m6/")
      }
      if(!cs.deployed){
        Router.go("/")
      }
    });

    initialDiv.appendChild(style);
    this.shadow.appendChild(initialDiv)
  
    return initialDiv;
  }
}

customElements.define("results-page2", Results);