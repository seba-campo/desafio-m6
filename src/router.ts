import {Router} from '@vaadin/router';

const root = document.querySelector(".root-div");
const router = new Router(root);
const actualUrl = window.location.origin;
console.log(actualUrl)

if(actualUrl.startsWith("https://seba-campo.github.io/")){
  router.setRoutes([
    {path: '/desafio-m6/', component: 'welcome-page'},
    {path: '/desafio-m6/game-room', component: 'game-room-page'},
    {path: '/desafio-m6/game', component: 'play-page'},
    {path: '/desafio-m6/results', component: 'results-page'}
  ]);
}
else{
  router.setRoutes([
    {path: '/', component: 'welcome-page'},
    {path: '/game-room', component: 'game-room-page'},
    {path: '/game', component: 'play-page'},
    {path: '/results', component: 'results-page'}
  ]);
}