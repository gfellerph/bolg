import Vue from 'vue';
import Router from 'vue-router';
import { auth } from 'src/config/firebase';

import Posts from 'src/components/Posts';
import EditPost from 'src/components/EditPost';
import Login from 'src/components/Login';
import Map from 'src/components/Map';
import Story from 'src/components/Story';
import Tipps from 'src/components/Tipps';
import Subscribe from 'src/components/Subscribe';
import Drawings from 'src/components/Drawings';
import Subscribers from 'src/components/Subscribers';
import CreateDrawing from 'src/components/CreateDrawing';

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
      name: 'NewPost',
      component: EditPost,
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
      path: '/createstory',
      name: 'NewStory',
      component: Story,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/editstory/:id',
      name: 'EditStory',
      component: Story,
      meta: {
        requiresAuth: true,
      },
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
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.currentUser) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }

  next();
});

export default router;
