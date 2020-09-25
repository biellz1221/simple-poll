<template>
	<div class="login">
		<div class="boxLogin">
			<p>Faça Login</p>
			<form action="#" @submit.prevent="createUser">
				<label for="name">Nome:</label>
				<input type="text" name="name" id="name" />
				<label for="email">Email:</label>
				<input type="email" name="email" id="email" autocomplete="username" />
				<label for="senha">Senha:</label>
				<input :type="showPass ? 'text' : 'password'" name="password" id="password" autocomplete="new-password" />
				<button type="submit">Criar</button>
				<router-link to="/">Já tenho um usuário</router-link>
			</form>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CreateUser',
		data() {
			return {
				showPass: false,
			};
		},
		methods: {
			createUser() {
				console.log('test create');
			},
		},
		created() {
			console.log(process.env.VUE_APP_API);
		},
	};
</script>
