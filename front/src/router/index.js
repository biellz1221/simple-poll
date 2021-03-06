import Vue from 'vue';
import VueRouter from 'vue-router';

import Cookies from 'js-cookie';

// import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import CreateUser from '../views/CreateUser.vue';
import CreatePoll from '../views/CreatePoll.vue';
import UserPollsList from '../views/UserPollsList.vue';
import Vote from '../views/Vote.vue';
import ViewPoll from '../views/ViewPoll.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login,
	},
	{
		path: '/users/new',
		name: 'CreateUser',
		component: CreateUser,
	},
	{
		path: '/polls/new',
		name: 'CreatePoll',
		component: CreatePoll,
	},
	{
		path: '/user/polls',
		name: 'UserPollsList',
		component: UserPollsList,
	},
	{
		path: '/poll/:id',
		name: 'Vote',
		component: Vote,
	},
	{
		path: '/poll/view/:id',
		name: 'ViewPoll',
		component: ViewPoll,
	},
	// {
	// 	path: '/about',
	// 	name: 'About',
	// 	component: () => import('../views/About.vue'),
	// },
];

const router = new VueRouter({
	//mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

const publicRoutes = ['Login', 'CreateUser', 'Vote'];

router.beforeEach((to, from, next) => {
	if (publicRoutes.includes(to.name)) {
		next();
	} else {
		let isAuthenticated = JSON.parse(Cookies.get('pollsloginsession'));
		if (!isAuthenticated) {
			alert('Você precisa estar logado para acessar');
			next('/');
		} else {
			next();
		}
	}
});

export default router;
