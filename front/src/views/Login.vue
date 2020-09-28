<template>
	<div class="login">
		<div class="boxLogin">
			<h1>Faça Login</h1>
			<form action="#" @submit.prevent="loginUser">
				<label for="email">Email:</label>
				<input required type="email" name="email" id="email" autocomplete="username" v-model="user.email" /><br />
				<label for="senha">Senha:</label>
				<input required :type="showPass ? 'text' : 'password'" name="showpass" id="showpass" autocomplete="password" v-model="user.password" />
				<br />
				<label for="showpass">Mostrar senha?</label>
				<input type="checkbox" name="showPass" id="showPass" v-model="showPass" />
				<br />
				<button type="submit">Entrar</button><br />
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
