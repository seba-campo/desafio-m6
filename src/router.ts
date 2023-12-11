import {Router} from '@vaadin/router';

const root = document.querySelector(".root-div");
const router = new Router(root);

router.setRoutes([
  {path: '/', component: 'welcome-page'},
  {path: '/game-room', component: 'game-room-page'},
  {path: '/game', component: 'play-page'},
  {path: '/results', component: 'results-page'}
]);