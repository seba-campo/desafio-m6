import {Router} from '@vaadin/router';
import { state } from './state';

const root = document.querySelector(".root-div");
const router = new Router(root);

// Check if is deployed...
const actualUrl = window.location.origin;
if(actualUrl.startsWith("https://seba-campo.github.io")){
  state.setDeployedStatus(true)
}
if(actualUrl.startsWith("http://localhost:8080")){
  state.setDeployedStatus(false)
}


const cs = state.getState();

if(cs.deployed){
  router.setRoutes([
    {path: '/desafio-m6/', component: 'welcome-page'},
    {path: '/desafio-m6/game-room', component: 'game-room-page'},
    {path: '/desafio-m6/game', component: 'play-page'},
    {path: '/desafio-m6/results', component: 'results-page'}
  ]);
}
if(!cs.deployed){
  router.setRoutes([
    {path: '/', component: 'welcome-page'},
    {path: '/game-room', component: 'game-room-page'},
    {path: '/game', component: 'play-page'},
    {path: '/results', component: 'results-page'}
  ]);
}