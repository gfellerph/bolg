import Vue from 'vue';
import Router from 'vue-router';
import { auth } from '@/config/firebase';

import Posts from '@/components/Posts';
import EditPost from '@/components/EditPost';
import Login from '@/components/Login';
import Map from '@/components/Map';
import Bookmark from '@/components/Bookmark';
import Story from '@/components/Story';

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
      path: '/bookmark',
      name: 'Bookmark',
      component: Bookmark,
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
