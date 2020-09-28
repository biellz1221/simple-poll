<template>
	<div class="pollsList">
		<div class="showPolls" v-if="loaded">
			<h1>
				<b>Votando na Enquete "{{ pollToVote.name }}"</b>
			</h1>
			<div v-for="option in pollToVote.options" :key="option.id">
				<span>{{ option.text }}</span> &nbsp;
				<button @click="vote(option.id)" :disabled="voted" v-if="pollToVote.isOpen">Votar</button>
			</div>
			<div v-if="pollToVote.userCanType">
				<span><input type="text" v-model="setCustomVote" placeholder="Outro"/></span> &nbsp;
				<button @click="vote('other')" :disabled="voted" v-if="pollToVote.isOpen">Votar</button>
			</div>
		</div>
		<div v-else>Loading...</div>
	</div>
</template>

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
