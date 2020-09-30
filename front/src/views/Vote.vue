<template>
	<div class="pollsList">
		<div class="container" v-if="loaded">
			<h1 class="title is-3">Votando na Enquete "{{ pollToVote.name }}"</h1>
			<table class="table votingTable">
				<tbody>
					<tr v-for="option in pollToVote.options" :key="option.id">
						<td>{{ option.text }}</td>
						<td><button class="button is-primary is-outlined is-small" @click="vote(option.id)" :disabled="voted" v-if="pollToVote.isOpen">Votar</button></td>
					</tr>
					<tr v-if="pollToVote.userCanType">
						<td>
							<input class="input" type="text" v-model="setCustomVote" placeholder="Outro" />
						</td>
						<td><button class="button is-primary is-outlined is-small" @click="vote('other')" :disabled="voted" v-if="pollToVote.isOpen">Votar</button></td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-else class="columns is-centered">
			<div class="column is-half">
				<progress class="progress is-small is-primary" max="100">15%</progress>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	.votingTable {
		td {
			padding: 0.75rem;
			vertical-align: middle;
		}
	}
</style>
<script>
	import { api } from '../../services/api';
	export default {
		name: 'Vote',
		data() {
			return {
				pollToVote: {},
				loaded: false,
				setCustomVote: '',
				voted: false,
			};
		},
		methods: {
			async vote(optionId) {
				if (optionId === 'other') {
					try {
						const res = await api.patch(`/poll/${this.$route.params.id}/vote/other`, {
							customVote: this.setCustomVote,
						});
						alert('voto computado com sucesso');
					} catch (error) {
						return alert(error);
					}
				} else {
					try {
						const res = await api.patch(`/poll/${this.$route.params.id}/vote/${optionId}`);
						alert('voto computado com sucesso');
					} catch (error) {
						return alert(error);
					}
				}
				this.voted = true;
			},
		},
		mounted() {
			api.get(`/poll/${this.$route.params.id}`, {})
				.then((res) => {
					this.pollToVote = res.data;
				})
				.then(() => {
					this.loaded = true;
				})
				.catch((error) => {
					alert(`Algo deu errado: ${error}`);
				});
		},
	};
</script>
