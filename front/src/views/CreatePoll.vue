<template>
	<div class="login">
		<div class="boxLogin">
			<p>Criar Enquete</p>
			<form action="#" @submit.prevent="createPoll">
				<label for="name">Nome:</label>
				<input type="text" name="name" id="name" v-model="poll.name" />
				<label for="usercantype">Ativar opção "Outro"?</label>
				<input type="checkbox" name="usercantype" id="usercantype" autocomplete="username" v-model="poll.userCanType" />
				<label>Opções:</label>
				<div class="optionToAdd">
					<label for="text">Opção:</label>
					<input type="text" name="text" id="text" v-model="optionToInsert.text" />
					<label for="order">Ordem:</label>
					<input type="number" name="order" id="order" v-model="optionToInsert.order" />
					<a href="#" @click.prevent="addOption">Add Opção</a>
					<div>
						Opções:<br />
						<span v-for="(option, index) in poll.options" :key="index">
							{{ option }}
						</span>
					</div>
				</div>
				<button type="submit" :disabled="poll.options.length ? false : true">Criar Enquete</button>
			</form>
			<a href="#" @click.prevent="$router.go(-1)">Voltar</a>
		</div>
	</div>
</template>

<script>
	import { api, getToken } from '../../services/api';
	export default {
		name: 'CreatePoll',
		data() {
			return {
				optionToInsert: {
					text: '',
					order: 0,
				},
				poll: {
					name: '',
					userCanType: false,
					options: [],
				},
			};
		},
		methods: {
			addOption() {
				if (!this.optionToInsert.text) return alert('Você precisa inserir um texto para a opção');
				this.poll.options.push(this.optionToInsert);
				this.optionToInsert = {
					text: '',
					order: 0,
				};
			},
			async createPoll() {
				if (!this.poll.name) return alert('Vc precisa dar nome pra sua enquete né...');
				if (!this.poll.options.length) return alert('Vc precisa dar opções pra sua enquete né...');
				const res = await api.post('/poll/new', this.poll, {
					headers: {
						Authorization: getToken(),
					},
				});
				console.log(res.data);
			},
		},
	};
</script>
