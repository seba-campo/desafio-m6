import {Router} from '@vaadin/router';

const root = document.querySelector(".root-div");
const router = new Router(root);

router.setRoutes([
  {path: '/', component: 'welcome-page'},
  {path: '/users', component: 'x-user-list'}
]);