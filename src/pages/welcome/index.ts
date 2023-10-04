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
                <p class="label">Id de Sala</p>
                <input type="text" class="room-input"/>
                <custom-button text="Ingresar" class="button"></custom-button>
                <custom-button text="Volver" class="button return"></custom-button>
              </div>

              <div class="create-game-div">
                <p class="label">Tu nombre</p>
                <input type="text" class="room-input"/>
                <custom-button text="Ingresar" class="button"></custom-button>
                <custom-button text="Volver" class="button return-a"></custom-button>
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
            font-size: 15px;
            width: 322px;
            height: 37px;
            margin: 15px 0;
          }
  
          .button-div{
            display: flex;
            flex-direction: column;
            height: 350px; 
            justify-content: space-evenly;
            align-items: center;
            align-content: center;
          }
  
          .button{
            margin: 66px 0;
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
          
          .label{
            font-size: 45px;
            margin: 5px 0;
            text-align: center;
          }

      `;
  
    div.appendChild(style);
    this.shadow.appendChild(div)

    const createGameDivEl = this.shadow.querySelector(".create-game-div") as HTMLElement;
    const joinGameDivEl = this.shadow.querySelector(".join-game-div") as HTMLElement;
    const optionsDivEl = this.shadow.querySelector(".options-div") as HTMLElement;
  
    // CREAR ROOM
    const newGameButton = this.shadow.querySelector(".create-game") as HTMLElement;
    newGameButton?.addEventListener("click", () => {
      optionsDivEl.style.display = "none";
      createGameDivEl.style.display = "block";
    });

    // ENTRAR A ROOM EXISTENTE
    const joinGameButton = this.shadow.querySelector(".join-game") as HTMLElement;
    joinGameButton?.addEventListener("click", ()=>{
      optionsDivEl.style.display = "none";
      joinGameDivEl.style.display = "block";
    })


    // HANDLERS DE BOTONES VOLVER
    const returnButton = this.shadow.querySelector(".return") as HTMLElement;
    returnButton.addEventListener("click", ()=>{
      optionsDivEl.style.display = "block";
      createGameDivEl.style.display = "none";
      joinGameDivEl.style.display = "none";
    })

    const returnButtonA = this.shadow.querySelector(".return-a") as HTMLElement;
    returnButtonA.addEventListener("click", ()=>{
      optionsDivEl.style.display = "block";
      createGameDivEl.style.display = "none";
      joinGameDivEl.style.display = "none";
    })
  }
}


customElements.define("welcome-page", Welcome)