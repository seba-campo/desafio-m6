type Jugada = "piedra" | "papel" | "tijera";

type Game = {
  myPlay: Jugada;
  computerPlay: Jugada;
};

const API_URL = "http://localhost:3000";

export const state = {
  data: {
    localPlayerName: "",
    localPlayerId: "",
    opponent: "",
    roomId: "",
    roomData: {
      privateKey: "",
      participants: {
        owner:{
          nombre: "",
          id: "",
        },
        opponent:{
          nombre: "",
          id: "",
        }  
      },
      isFull: Boolean,
    },
    history: [{ myPlay: "tijera", computerPlay: "tijera" },{ myPlay: "piedra", computerPlay: "tijera" },{ myPlay: "tijera", computerPlay: "papel" },{ myPlay: "tijera", computerPlay: "papel" }],
    scoreBoard: {
      localPlayerName : 0,
      opponent: 0
    }
  },
  listeners: [],
  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },

  // API TRANSACTIONS METHODS
  //REGISTRARSE
  registerUser(callback){
    const cs  = this.getState();

    return fetch(API_URL+"/signup",{
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({nombre: cs.localPlayerName})
    }).then(res => {
      callback();  
      return res.json()
    })
  },
  // LOGUEARSE
  login(callback){
    const cs = this.getState();

    return fetch(API_URL+"/login", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({nombre: cs.localPlayerName})
    }).then(res => {
      if(res.status == 200){
        return res.json();
      } else {
        console.log("User not found, registering...");
        return this.registerUser(()=>{
          console.log("User registered successfully")
        })
      }
    }).then((data => {
      this.setLocalPlayerId(data.id);
      callback();
    }))
  },
  // CREAR SALA
  createRoom(callback){
    // Necesita ID del user
    const cs = this.getState();

    return fetch(API_URL+"/rooms?userId="+cs.localPlayerId,{
      method: "POST",
      headers: {"content-type": "application/json"}
    }).then(res => {
      return res.json()
    }).then(data => {
      this.setRoomId(data.id)
      callback();
    })
  },
  // CONECTAR A SALA
  connectToRoom(callback){
    const cs = this.getState();

    return fetch(API_URL+"/rooms?userId="+cs.localPlayerId+"&roomId="+cs.roomId, {
      method: "GET",
      headers: {"content-type": "application/json"}
    }).then(res => {
      return res.json()
    }).then(data => {
      this.setRoomData(data)
      
      //Coloco el opponent name 
      // SI INGRESA EL OWNER
      if(cs.localPlayerId == data.participants.owner.id){
        this.setOpponentNombre(data.participants.opponent.nombre)
      }
      // SI INGRESA EL OPPONENT
      if(cs.localPlayerId == data.participants.opponent.id){
        this.setOpponentNombre(data.participants.owner.nombre)
      }

      callback();

    })
  },



  // METODOS GET/SET
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for(var cb of this.listeners){
      cb();
    }
  },
  setRoomId(roomId: string){
    const cs = this.getState();
    cs.roomId = roomId;

    this.setState(cs);
  },
  setRoomPrivateKey(id: string){
    const cs = this.getState();
    cs.roomData.privateKey = id;

    this.setState(cs)
  },
  setLocalPlayerId(id: string){
    const cs = this.getState();
    cs.localPlayerId = id;

    this.setState(cs);
  },
  setRoomData(data: any){
    const cs = this.getState();
    cs.roomData = data;

    this.setState(cs);
  },
  setNombre(nombre : string){
    const cs = this.getState();
    cs.localPlayerName = nombre;

    this.setState(cs);
  },
  setOpponentNombre(nombre: string){
    const cs = this.getState();
    cs.opponent = nombre;

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
      cs.scoreBoard.localPlayerName ++
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
