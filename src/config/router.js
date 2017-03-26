import Vue from 'vue';
import Router from 'vue-router';
import {auth} from '@/config/firebase';

import Posts from '@/components/Posts';
import EditPost from '@/components/EditPost';
import Login from '@/components/Login';

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
      path: '/create',
      name: 'NewPost',
      component: EditPost,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/edit/:id',
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
    }
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.currentUser) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  
  next();
});

export default router;