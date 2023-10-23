type Jugada = "piedra" | "papel" | "tijera";

type Game = {
  myPlay: Jugada;
  computerPlay: Jugada;
};

const API_URL = "http://localhost:3000";

export const state = {
  data: {
    localPlayer: "Seba",
    opponent: "Martin",
    roomId: "FGAS",
    nombre: "",
    localPlayerId: "",
    history: [{ myPlay: "tijera", computerPlay: "tijera" },{ myPlay: "piedra", computerPlay: "tijera" },{ myPlay: "tijera", computerPlay: "papel" },{ myPlay: "tijera", computerPlay: "papel" }],
    scoreBoard: {
      localPlayer : 0,
      opponent: 0
    }
  },
  listeners: [],
  registerUser(callback){
    const cs  = this.getState();

    return fetch(API_URL+"/signup",{
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({nombre: cs.nombre})
    }).then(res => {
        return res.json()
    }).then((data => {
      this.setLocalPlayerId(data.id)
      callback();
    }))
  },
  login(callback){
    const cs = this.getState();

    return fetch(API_URL+"/login", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({nombre: cs.nombre})
    }).then(res => {
      if(res.status == 200){
        return res.json();
      } else {
        console.log("User not found, registering...");
        this.registerUser(()=>{
          console.log("User registered successfully")
        })
      }
    }).then((data => {
      this.setLocalPlayerId(data.id)
      callback();
    }))
  },
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data == newState;
    for(var cb of this.listeners){
      cb();
    }
  },
  setLocalPlayerId(id: string){
    const cs = this.getState();
    cs.localPlayerId == id;

    this.setState(cs);
  },
  setNombre(nombre : string){
    const cs = this.getState();
    cs.localPlayer == nombre;
    cs.nombre == nombre;

    this.setState(cs);
  },
  setRoomId(roomId : string){
    const cs = this.getState();
    cs.roomId == roomId;

    this.setState(cs);
  }, 
  setMove(move : Jugada) {
    const currentState = this.getState();

    // Agrego ambas jugadas al currentState
    currentState.currentGame.myPlay = move;
    currentState.currentGame.computerPlay = this.generateComputerPlay();

    // Pusheo la jugada actual al historial
    currentState.history.push(currentState.currentGame);

    // aplico cambios al local storage
    localStorage.setItem("currentState", JSON.stringify(currentState));

    // llamo a los listeners y les paso el currentState, para que puedan acceder
    for (var cb of this.listeners) {
      cb(currentState);
    }
  },
  whoWins(localPlay: Jugada, opponentPlay: Jugada) {
    const cs = this.getState();

    const playerGanoConTijeras = localPlay == "tijera" && opponentPlay == "papel";
    const playerGanoConPapel = localPlay == "papel" && opponentPlay == "piedra";
    const playerGanoConPiedra = localPlay == "piedra" && opponentPlay == "tijera";

    const playerWins = [playerGanoConTijeras, playerGanoConPiedra, playerGanoConPapel].includes(
      true
    );

    const opponentGanoTijeras = opponentPlay == "tijera" && localPlay == "papel";
    const opponentGanoPapel = opponentPlay == "papel" && localPlay == "piedra";
    const opponentGanoPiedra = opponentPlay == "piedra" && localPlay == "tijera";

    const opponentWins = [
      opponentGanoTijeras,
      opponentGanoPapel,
      opponentGanoPiedra,
    ].includes(true);

    if (playerWins) {
      cs.scoreBoard.localPlayer ++
      this.setState();
      return true;
    }
    if (opponentWins) {
      cs.scoreBoard.opponent ++
      this.setState();
      return false;
    }
    if (!playerWins && !opponentWins) {
      return null;
    }
  },
  generateComputerPlay() {
    const posibilities = ["piedra", "papel", "tijera"];
    const nroRandom = Math.floor(Math.random() * (3 - 0) + 0);

    return posibilities[nroRandom];
  },
  initState() {
    const computerPlay = this.generateComputerPlay();

    const initialState = {
      currentGame: { myPlay: "undefined", computerPlay: computerPlay },
      history: [],
      points: {
        computer: 0,
        player: 0,
      },
    };

    this.setState(initialState);
  },
  restartScore() {
    const cs = this.getState();

    cs.history = [];

    this.setState(cs);
  },
};
