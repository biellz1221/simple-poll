<template>
	<div class="login">
		<div class="boxLogin">
			<h1>Faça Login</h1>
			<form action="#" @submit.prevent="loginUser">
				<label for="email">Email:</label>
				<input type="email" name="email" id="email" autocomplete="username" v-model="user.email" />
				<label for="senha">Senha:</label>
				<input :type="showPass ? 'text' : 'password'" name="password" id="password" autocomplete="password" v-model="user.password" />
				<input type="checkbox" name="showPass" id="showPass" v-model="showPass" />
				<button type="submit">Entrar</button>
				<router-link to="/users/new">Criar novo usuário</router-link>
			</form>
		</div>
	</div>
</template>

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
						token: response.data.token,
					}),
					{ expires: 7 }
				);
				//console.log(Cookies.get('pollsloginsession'));
				this.$router.push('/user/polls');
			},
		},
	};
</script>
