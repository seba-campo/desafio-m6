// Pages
import "./pages/welcome"
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
