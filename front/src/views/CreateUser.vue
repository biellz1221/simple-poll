<template>
	<div class="login">
		<div class="boxLogin">
			<p>Criar novo usuário</p>
			<form action="#" @submit.prevent="createUser">
				<label for="name">Nome:</label>
				<input required type="text" name="name" id="name" v-model="newUser.name" /><br />
				<label for="email">Email:</label>
				<input required type="email" name="email" id="email" autocomplete="username" v-model="newUser.email" /><br />
				<label for="senha">Senha:</label>
				<input required :type="showPass ? 'text' : 'password'" name="password" id="password" autocomplete="new-password" v-model="newUser.password" /><br />
				<button type="submit">Criar</button>
			</form>
			<router-link to="/">Já tenho um usuário, quero fazer login</router-link>
		</div>
	</div>
</template>

<script>
	import { api } from '../../services/api';
	export default {
		name: 'CreateUser',
		data() {
			return {
				showPass: false,
				newUser: {
					name: '',
					email: '',
					password: '',
				},
			};
		},
		methods: {
			async createUser() {
				try {
					const res = await api.post('/user/new', this.newUser);
					this.newUser = {
						name: '',
						email: '',
						password: '',
					};
					alert('Usuário criado com suceso');
					this.$router.push('/');
				} catch (error) {
					alert(error);
				}
			},
		},
	};
</script>
