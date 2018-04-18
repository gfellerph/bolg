import Vue from 'vue';
import Router from 'vue-router';
import store from 'src/config/store';

import Posts from 'src/components/Posts';
import EditPost from 'src/components/EditPost';
import CreatePost from 'src/components/CreatePost';
import Map from 'src/components/Map';
import Tipps from 'src/components/Tipps';
import Subscribe from 'src/components/Subscribe';
import Drawings from 'src/components/Drawings';
import Subscribers from 'src/components/Subscribers';
import CreateDrawing from 'src/components/CreateDrawing';
import JourneyEditor from 'src/components/JourneyEditor';
import Login from 'src/components/Login';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Posts',
      component: Posts,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/createpost',
      name: 'CreatePost',
      component: CreatePost,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/editpost/:id',
      name: 'EditPost',
      component: EditPost,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/map',
      name: 'Map',
      component: Map,
    },
    {
      path: '/tipps',
      name: 'Tipps',
      component: Tipps,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/subscribe',
      name: 'Subscribe',
      component: Subscribe,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/drawings',
      name: 'Drawings',
      component: Drawings,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/subscribers',
      name: 'Subscribers',
      component: Subscribers,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/createdrawing',
      name: 'CreateDrawing',
      component: CreateDrawing,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/journey',
      name: 'Journey',
      component: JourneyEditor,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth.user) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }

  return next();
});

export default router;
