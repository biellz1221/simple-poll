<template>
	<div class="pollsList">
		<div class="container">
			<div class="columns">
				<div class="column is-four-fifths">
					<h1 class="title is-3">
						Lista de enquetes do usuário
					</h1>
				</div>
				<div class="column is-one-fifth" align="right">
					<router-link class="button is-primary is-outlined" to="/polls/new">Nova Enquete</router-link>
				</div>
			</div>
			<div class="columns is-multiline" v-if="loaded">
				<div class="column is-one-quarter" v-for="poll in pollsToShow" :key="poll.pid">
					<div class="card">
						<header class="card-header">
							<p class="card-header-title">
								{{ poll.name }}
							</p>
						</header>
						<div class="card-content">
							<div class="content">
								<div class="block">
									<b>Criada: </b><small>{{ new Date(poll.created).toLocaleString() }}</small>
								</div>
								<div class="block">
									<b>Votos:</b> <small>{{ poll.totalVotes }}</small>
								</div>
								<div class="block">
									<b>Status:</b> <small>{{ poll.isOpen ? 'Recebendo Votos' : 'Fechada' }}</small>
								</div>
							</div>
						</div>
						<footer class="card-footer">
							<a href="#" @click.prevent="viewPoll(poll.pid)" class="card-footer-item">Detalhes</a>
							<a href="#" @click.prevent="goToVote(poll.pid)" class="card-footer-item">Votar</a>
							<a href="#" @click.prevent="deletePoll(poll.pid)" class="card-footer-item">Apagar</a>
						</footer>
					</div>
				</div>
			</div>
			<div v-else>Loading...</div>
		</div>
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
