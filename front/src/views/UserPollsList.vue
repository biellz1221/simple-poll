<template>
	<div class="pollsList">
		<h1><b>Lista de enquetes do usuário</b></h1>
		<p><router-link to="/polls/new">Adicionar Nova Enquete</router-link></p>
		<div class="showPolls" v-if="loaded">
			<div v-for="poll in pollsToShow" :key="poll.pid">{{ poll }}<br /><br /></div>
		</div>
		<div v-else>Loading...</div>
	</div>
</template>

<script>
	import { api, getToken } from '../../services/api';
	export default {
		name: 'UserPollsList',
		data() {
			return {
				pollsToShow: [],
				loaded: false,
			};
		},
		mounted() {
			api.get('/poll/all', {
				headers: {
					Authorization: getToken(),
				},
			})
				.then((res) => {
					this.pollsToShow = res.data;
				})
				.then(() => {
					this.loaded = true;
				});
		},
	};
</script>
