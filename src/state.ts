import { rtdb } from "./rtdb"

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
    realTimeRoom: {
      owner: "",
      participants: {
          owner: {
              nombre: "",
              isConnected: true,
              isReady: "null"
          },
          opponent: {
              nombre: "",
              isConnected: true,
              isReady: "null"
          }
      },
      sessionPlays: {
          actual: {
            owner: "",
            opponent: "",
          },
          thisSession: []
      }
    },
    scoreBoard: {
      owner: 0,
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
      } 
      if(res.status == 404) {
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
      if(res.status == 200){
        return res.json()
      }
      if(res.status == 409){
        console.log("The Room is Full")
        //Hago un prevent del callback (ya que se usa para enrutar con la siguiente pagina)
        callback = ()=>{

        }
        return cs.roomData;
      }
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
  // INGRESAR A LA RTDB
  sablishRoomConnection(callback){
    const cs = this.getState();
    const chatroomRef = rtdb.ref("/rooms/" + cs.roomData.privateKey);

    chatroomRef.on("value", (snapshot) => {
        const rtdbSnap = snapshot.val(); 
        // console.log("rtdb snap", rtdbSnap)
        this.setRealTimeRoomData(rtdbSnap);
    });

    callback();
  },
  // ESCRIBIR EN LA RTDB
  updateRtdb(callback){
    const cs = this.getState();
    const chatroomRef = rtdb.ref("/rooms/" + cs.roomData.privateKey);

    chatroomRef.update(cs.realTimeRoom)

    callback();
  },
  setPlayInRtdb(callback){
    const cs = this.getState();
    
    switch(cs.localPlayerName){
      // OWNER
      case cs.realTimeRoom.participants.owner.nombre:
        // /rooms/u0wyUkTdf-Zj/sessionPlays/actual/opponent 
        const jugadaOwner = cs.realTimeRoom.sessionPlays.actual.owner;
        const ownerRef = rtdb.ref("/rooms/" + cs.roomData.privateKey +"/sessionPlays/actual/owner");
        ownerRef.set(jugadaOwner);
        callback()
      break
      // OPPONENT
      case cs.realTimeRoom.participants.opponent.nombre:
        const jugadaOpponent = cs.realTimeRoom.sessionPlays.actual.opponent;
        const opponentRef = rtdb.ref("/rooms/" + cs.roomData.privateKey +"/sessionPlays/actual/opponent");
        opponentRef.set(jugadaOpponent);
        callback()
      break
    }

  },
  //SUBIR HISTORIAL AL FIRESTORE
  updateHistory(callback){
    // ID de la sala
    const cs = this.getState(); 
    // console.log("UPDATE HISTORY CURRENT STATE", cs)
    const roomId = cs.roomId;
    const opponentPlay = cs.realTimeRoom.sessionPlays.actual.opponent;
    const ownerPlay = cs.realTimeRoom.sessionPlays.actual.owner;

    // Este update solo lo hará el OWNER para que no se repita la 
    // jugada dos veces en la DB.
    if(cs.localPlayerName == cs.roomData.participants.owner.nombre){
      fetch(API_URL+"/rooms/history", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          roomId: roomId,
          play: {
            owner: ownerPlay,
            opponent: opponentPlay
          }         
        })
      })
      .then((res)=>{
        if(res.status == 200){
          callback()
        }
        else{
          console.log("Un error ocurrió al guardar la partida")
        }
      })
    }
    
  },



  // METODOS GET/SET
  getState() {
    return this.data;
  },
  setState(newState, opt: string = "a") {
    const cs = this.getState();
    this.data = newState;
    for(var cb of this.listeners){
      cb(cs);
    }

    if(opt.length > 1){
      console.log("SET STATE", opt)
    }
  },
  setActualPlay(play: Jugada){
    const cs = this.getState();
    
    switch(cs.localPlayerName){
      case cs.realTimeRoom.participants.owner.nombre:
          cs.realTimeRoom.sessionPlays.actual.owner = play
          this.setState(cs);
        break

      case cs.realTimeRoom.participants.opponent.nombre:
          cs.realTimeRoom.sessionPlays.actual.opponent = play
          this.setState(cs);
        break
    }
  },
  setUnReadyStatus(){
    const cs = this.getState();
    cs.realTimeRoom.participants.owner.isReady = false
    cs.realTimeRoom.participants.opponent.isReady = false
    this.setState(cs);
  },
  setPlayerReadyStatus(userName: string){
    const cs = this.getState();
    switch(userName){
      case cs.realTimeRoom.participants.owner.nombre:
          cs.realTimeRoom.participants.owner.isReady = true
          this.setState(cs, "unready");
        break

      case cs.realTimeRoom.participants.opponent.nombre:
          cs.realTimeRoom.participants.opponent.isReady = true
          this.setState(cs, "unready");
        break
      }
  },
  setRealTimeRoomData(data: any){
    const cs = this.getState();
    cs.realTimeRoom = data;

    this.setState(cs);
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
  whoWins(localPlay, opponentPlay) {
    const cs = this.getState();

    const ownerGanoConTijeras = localPlay == "tijera" && opponentPlay == "papel";
    const ownerGanoConPapel = localPlay == "papel" && opponentPlay == "piedra";
    const ownerGanoConPiedra = localPlay == "piedra" && opponentPlay == "tijera";

    const ownerWins = [ownerGanoConTijeras, ownerGanoConPiedra, ownerGanoConPapel].includes(
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

    if (ownerWins) {
      cs.scoreBoard.owner ++
      return "owner";
    }
    if (opponentWins) {
      cs.scoreBoard.opponent ++
      return "opponent";
    }
    if (!ownerWins && !opponentWins) {
      return "empate";
    }
  },
  restartScore() {
    const cs = this.getState();

    cs.history = [];

    this.setState(cs);
  },
  resetState(){
    const newState = {
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
      realTimeRoom: {
        owner: "",
        participants: {
            owner: {
                nombre: "",
                isConnected: true,
                isReady: "null"
            },
            opponent: {
                nombre: "",
                isConnected: true,
                isReady: "null"
            }
        },
        sessionPlays: {
            actual: {
              owner: "",
              opponent: "",
            },
            thisSession: []
        }
      },
      scoreBoard: {
        owner: 0,
        opponent: 0
      }
    }

    this.data = newState;
  }
};
