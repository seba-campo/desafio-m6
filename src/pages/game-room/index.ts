import { read } from "fs";
import { state } from "../../state";
import { Router } from "@vaadin/router";

class GameRoom extends HTMLElement{
  shadow = this.attachShadow({mode: "open"})
  constructor(){
    super();
    this.render();
  }
  connectedCallback(){
    const currenState = state.getState();
    state.subscribe((currentState)=>{
        const opponentReady = currentState.realTimeRoom.participants.owner.isReady;
        const ownerReady = currentState.realTimeRoom.participants.opponent.isReady;

        if(opponentReady && ownerReady){
          // state.setUnReadyStatus();
          state.updateRtdb(()=>{
            Router.go("/play")
          })
        }
    })
  }
  render(){
  const initialDiv = document.createElement("div");
  const style = document.createElement("style");
  const backgroundURL = require("url:../../img/fondo.svg");

  const currentState = state.getState();


  const roomId = currentState.roomId;

  const actualPlayer = currentState.localPlayerName;
  var opponent = currentState.opponent;

  if(opponent == undefined || currentState.scoreBoard.opponent == undefined){
    currentState.scoreBoard.opponent = 0;
    opponent = "Waiting user..."
  }


  initialDiv.innerHTML = `
          <div class="game-room">
            <div class="wrapper">
              <div class="header">
                  <div class="header__score">
                    <p class="score">${actualPlayer}: ${currentState.scoreBoard.localPlayer}</p>
                    <p class="score">${opponent}: ${currentState.scoreBoard.opponent}</p>
                  </div>

                  <div class="header__room-id">
                    <p class="room-id"><strong>Sala: </strong><br>${roomId}</p>
                  </div>
              </div>


              <div class="game-ready">
                <p class="game-ready-p">Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos. </p>
                <custom-button text="¡Jugar!" class="ready-button"></custom-button>
              </div>


              <div class="waiting-player">
                <p class="waiting-player-p">Esperando a que <strong>${opponent}</strong> presione Jugar...</p>
              </div>         
            </div>
            <div class="play-div">
                <play-selection class="item" selection="piedra"></play-selection>
                <play-selection class="item" selection="papel"></play-selection>
                <play-selection class="item" selection="tijera"></play-selection>
            </div>
          </div>
      `
    ;

  style.textContent = `
      .game-room{
          font-family: var(--main-font);
          background-image: url(${backgroundURL});
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: 100vh;
      }

      .wrapper{
        height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }

      .header{
        display: flex;
        justify-content: space-between;
        height: 50px;
        width: 100vw;
      }
      .header__score{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        margin: 0px 25px;
      }
      .score{
        margin: 3px 0;
        width: 90px;
        font-size: 20px;
      }

      .header__room-id{
        margin: 0px 25px;
        font-size: 25px;
      }
      .room-id{
        margin: 0;
      }
      @media(min-width: 912px){
        .header{
          width: 60vw;
        }
        .score{
          width: 120px;
          font-size: 25px;
        }
        .header__room-id{
          font-size: 27px;
        }
      }

      .code-share{
      }
      .p-code{
        font-size: 45px;
        text-align: center;
      }

      .game-ready{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .game-ready-p{
        font-size: 40px;
        text-align: center;
      }

      .waiting-player{
        display: none;
      }
      .waiting-player-p{
        font-size: 45px;
        text-align: center;
      }

      .play-div{
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
      }
      @media(min-width: 768px){
        .play-div{
          height: 145px;  
        }
      }
      
      .item{
        height: 200px;
        justify-self: flex-end;
      }
      @media(min-width: 768px){
        .item{
          height: 250px;
        }
      }
      @media(min-width: 912px){
        .item{
          height: 350px;
        }
      }
  `;

  const readyButtonEl = initialDiv.querySelector(".ready-button");
  const readyContainerEl = initialDiv. querySelector(".game-ready") as HTMLDivElement;
  const waitingPlayerEl = initialDiv.querySelector(".waiting-player") as HTMLDivElement;


  readyButtonEl?.addEventListener("click", ()=>{
    readyContainerEl.style.display = "none";
    waitingPlayerEl.style.display = "block";

    const cs = state.getState();

    // Le seteo estado de ready
    state.setPlayerReadyStatus(cs.localPlayerName);
    state.updateRtdb(()=>{
      console.log("RTDB actualizada")
    })

  });

  initialDiv.appendChild(style);
  this.shadow.appendChild(initialDiv);
}
}

customElements.define("game-room-page", GameRoom)