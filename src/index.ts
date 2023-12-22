// Pages
import "./pages/welcome"
import "./pages/game-room"
import "./pages/game"
import "./pages/results"
import "./pages/results2"
import "./router"
// Components
import { playElement } from "./components/jugada";
import { timerComponent } from "./components/contador";
import { scoreEl } from "./components/score";

import "./components/button"


(() => {
  playElement();
  timerComponent();
  scoreEl();
})();
