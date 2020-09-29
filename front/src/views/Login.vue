<template>
	<div class="login columns is-centered">
		<div class="column is-3">
			<div class="box">
				<h1 class="title is-4 has-text-centered	">Login</h1>
				<form action="#" @submit.prevent="loginUser">
					<div class="field">
						<label class="label" for="email">Email:</label>
						<input class="input" required type="email" name="email" id="email" autocomplete="username" v-model="user.email" /><br />
					</div>
					<div class="field">
						<label class="label" for="senha">Senha:</label>
						<input class="input" required :type="showPass ? 'text' : 'password'" name="showpass" id="showpass" autocomplete="password" v-model="user.password" />
					</div>
					<div class="field">
						<label for="showpass" class="checkbox">
							<input type="checkbox" name="showPass" id="showPass" v-model="showPass" />
							Mostrar senha?
						</label>
					</div>
					<button class="button is-primary is-fullwidth" type="submit">Entrar</button>
					<!-- <router-link to="/users/new">Criar novo usuário</router-link> -->
				</form>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	.login {
		.column {
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: calc(100vh - 3.25rem);
		}
	}
</style>
<script>
	import { api } from '../../services/api';
	import Cookies from 'js-cookie';
	export default {
		name: 'Login',
		data() {
			return {
				showPass: false,
				user: {
					email: '',
					password: '',
				},
			};
		},
		methods: {
			async loginUser() {
				if (!this.user.email || !this.user.password) return alert('Informe login e senha para continuar');
				const response = await api.post('/user/login', this.user);
				if (!response.data.token) return alert('Algo deu errado e seu token não foi gerado. Tente novamente');
				Cookies.set(
					'pollsloginsession',
					JSON.stringify({
						email: response.data.email,
						token: response.data.token,
					}),
					{ expires: 7 }
				);
				this.$emit('loggedout', true);
				this.$router.push('/user/polls');
			},
		},
	};
</script>
