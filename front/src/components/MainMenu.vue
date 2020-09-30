<template>
	<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<router-link class="navbar-item" :to="isLoggedIn ? '/user/polls' : '/'">
				<img src="../assets/logo.png" width="112" height="28" />
			</router-link>

			<a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div id="navbarBasicExample" class="navbar-menu">
			<div class="navbar-start" v-if="isLoggedIn">
				<router-link class="navbar-item" to="/user/polls">Minhas Enquetes</router-link>
				<router-link class="navbar-item" to="/polls/new">Criar Enquete</router-link>
			</div>

			<div class="navbar-end" v-if="isLoggedIn">
				<div class="navbar-item">
					<div class="buttons">
						<a href="#" @click.prevent="logout(false)" class="button is-primary is-outlined">
							Sair
						</a>
					</div>
				</div>
			</div>

			<div class="navbar-end" v-else>
				<div class="navbar-item">
					<div class="buttons">
						<router-link to="/users/new" class="button is-primary">
							<strong>Criar Conta</strong>
						</router-link>
						<router-link to="/" class="button button is-primary is-outlined">
							Entrar
						</router-link>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<style lang="scss">
	.navbar {
		border-bottom: 1px solid #efefef;
	}
</style>

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
