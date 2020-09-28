<template>
	<nav class="menuPrincipal">
		<ul v-if="isLoggedIn">
			<li><router-link to="/user/polls">Minhas Enquetes</router-link></li>
			<li><router-link to="/polls/new">Criar Enquete</router-link></li>
			<li><a href="#" @click.prevent="logout(false)">Logout</a></li>
			<li><a href="#" @click.prevent="logout(true)">Logout All</a></li>
		</ul>
	</nav>
</template>

<script>
	import Cookies from 'js-cookie';
	import { api, getToken } from '../../services/api';
	export default {
		name: 'MainMenu',
		data() {
			return {
				isLoggedIn: false,
			};
		},
		mounted() {
			if (!Cookies.get('pollsloginsession')) return;
			try {
				JSON.parse(Cookies.get('pollsloginsession')).token;
				this.isLoggedIn = true;
			} catch (error) {
				console.error(error);
			}
		},
		methods: {
			logout(all) {
				let apiRoute = all ? '/user/logoutall' : '/user/logout'; // se a all true, invalidar todos os tokens e encerrar sessões
				api.post(
					apiRoute,
					{ email: JSON.parse(Cookies.get('pollsloginsession')).email },
					{
						headers: {
							Authorization: getToken(),
						},
					}
				).then((res) => {
					Cookies.remove('pollsloginsession');
					this.$emit('loggedout', true);
					this.$router.push('/');
				});
			},
		},
	};
</script>
