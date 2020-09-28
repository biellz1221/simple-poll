<template>
	<div class="pollsList">
		<h1><b>Lista de enquetes do usuário</b></h1>
		<p><router-link to="/polls/new">Adicionar Nova Enquete</router-link></p>
		<div class="showPolls" v-if="loaded">
			<div v-for="poll in pollsToShow" :key="poll.pid">
				<span>{{ poll.name }}&nbsp;</span>
				<button @click="viewPoll(poll.pid)">Ver Detalhes</button>&nbsp;
				<!-- -->
				<button @click="goToVote(poll.pid)">Votar</button>&nbsp;
				<!-- -->
				<button @click="deletePoll(poll.pid)">Apagar</button><br /><br />
			</div>
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
		methods: {
			goToVote(pid) {
				this.$router.push(`/poll/${pid}`);
			},
			getPolls() {
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
			viewPoll(pid) {
				this.$router.push(`/poll/view/${pid}`);
			},
			deletePoll(pid) {
				let certeza = confirm('Tem certeza que deseja apagar esta enquete?');
				if (certeza) {
					api.delete(`/poll/${pid}`, {
						headers: {
							Authorization: getToken(),
						},
					})
						.then((res) => {
							alert(res.data.msg);
						})
						.then(() => {
							this.getPolls();
						});
				}
			},
		},
		mounted() {
			this.getPolls();
		},
	};
</script>
