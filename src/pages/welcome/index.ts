import { join } from "path";
import { state } from "../../state";
import { Router } from "@vaadin/router";

class Welcome extends HTMLElement{
  shadow = this.attachShadow({mode: "open"})
  constructor(){
    super();
    this.render();
  }  
  render(){
    const div = document.createElement("div");
    const style = document.createElement("style");
  
    const backgroundURL = require("url:../../img/fondo.svg");
  
    div.innerHTML = `
          <div class="welcome-main-frame">
              <div>
                  <h1 class="page-title">Piedra Papel ó Tijera</h1>
              </div>
              <div class="button-div">
                <div class="options-div">
                  <custom-button text="Nuevo juego" class="button create-game"></custom-button>
                  <custom-button text="Ingresar a una sala" class="button join-game"></custom-button>
                </div>

                <div class="join-game-div">
                  <input type="text" class="room-input"/>
                  <custom-button text="Ingresar" class="button"></custom-button>
                </div>

                <div class="create-game-div">
                  <input type="text" class="room-input"/>
                  <custom-button text="Ingresar" class="button"></custom-button>
                </div>
              </div>
              <div class="play-div">
              
                  <play-selection selection="piedra" class="item"></play-selection>
  
                  <play-selection selection="papel" class="item"></play-selection>
  
                  <play-selection selection="tijera" class="item"></play-selection>
                
              </div>
          </div>
      `;
  
    style.textContent = `
          .welcome-main-frame{
              font-family: var(--main-font);
              background-image: url(${backgroundURL});
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              height: 100vh;
          }
  
          .page-title{
            text-align: center;
            width: 70vw;
            font-size: 80px;
            color: #009048;
            margin: 35px 0 0 0;
          }
          @media(min-width: 768px){
            .page-title{
              font-size: 95px;
            }
          }

          .join-game-div{
            display: none;
          }
          
          .create-game-div{
            display: none;
          }

          .room-input{
          }
  
          .button-div{
            display: flex;
            flex-direction: column;
            height: 200px; 
            justify-content: space-evenly;
          }
  
          .button{
            margin: 5px 0;
  
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
  
    div.appendChild(style);
    this.shadow.appendChild(div)

    const createGameDivEl = this.shadow.querySelector(".create-game-div") as HTMLElement;
    const joinGameDivEl = this.shadow.querySelector(".join-game-div") as HTMLElement;
    const optionsDivEl = this.shadow.querySelector(".options-div") as HTMLElement;
  
    const newGameButton = this.shadow.querySelector(".create-game") as HTMLElement;
    newGameButton?.addEventListener("click", () => {
      optionsDivEl.style.display = "none";
      createGameDivEl.style.display = "block";
      // Router.go("/instructions")
    });

    const joinGameButton = this.shadow.querySelector(".join-game") as HTMLElement;
    joinGameButton?.addEventListener("click", ()=>{
      optionsDivEl.style.display = "none";
      joinGameDivEl.style.display = "block";
    })
  }
}


customElements.define("welcome-page", Welcome)