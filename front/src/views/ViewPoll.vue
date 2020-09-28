<template>
	<div class="editPoll">
		<div class="boxLogin">
			<h1>Detalhes da Enquete "{{ pollDetails.name }}"</h1>
			<button @click.prevent="editPoll" :disabled="!pollDetails.totalVotes ? false : true">Editar</button><br />
			<small v-if="pollDetails.totalVotes">Não pode editar enquete q já teve voto. Manipular votação é feio.</small>
			<br /><br />
			<form action="#" @submit.prevent="createPoll">
				<div v-if="editing">
					<label for="name">Nome:</label>
					<input required type="text" name="name" id="name" v-model="editingPoll.name" /><br />
				</div>
				<label for="usercantype">Opção "Outro"?</label>
				<input type="checkbox" name="usercantype" id="usercantype" v-model="pollDetails.userCanType" disabled v-if="!editing" />
				<input type="checkbox" name="usercantype" id="usercantype" v-model="editingPoll.userCanType" v-else /><br /><br />
				<span v-if="!editing">Total de Votos: {{ pollDetails.totalVotes }}</span
				><br /><br />
				<label>Opções:</label>
				<div class="optionToAdd">
					<div v-if="editing">
						<div v-for="(option, index) in editingPoll.options" :key="option.id">
							<label for="text">Opção:</label>
							<input type="text" name="text" id="text" v-model="editingPoll.options[index].text" /><br />
							<label for="order">Ordem:</label>
							<input type="number" name="order" id="order" v-model="editingPoll.options[index].order" /><br />
							<button @click="removeOption(index)">Remover</button>
							<br /><br />
						</div>

						<p>Nova Opção:</p>
						<label for="text">Opção:</label>
						<input type="text" name="text" id="text" v-model="optionToInsert.text" /><br />
						<label for="order">Ordem:</label>
						<input type="number" name="order" id="order" v-model="optionToInsert.order" /><br />
						<a href="#" @click.prevent="pushOption">Add Opção</a>
					</div>
					<div v-else>
						<span v-for="(option, index) in pollDetails.options" :key="index">
							<!-- -->
							{{ option.text }} - {{ option.votes }} {{ option.votes > 1 ? 'votos' : 'voto' }}<br /><br />
							<!-- -->
						</span>
					</div>
				</div>
			</form>
			<div class="btnGroup" v-if="editing">
				<button v-if="!comparePolls" @click.prevent="saveEdit">Salvar Alterações</button>
				<button @click.prevent="cancelEdit">Cancelar</button>
			</div>
			<a href="#" @click.prevent="$router.go(-1)">Voltar</a>
		</div>
	</div>
</template>

<script>
	import { api, getToken } from '../../services/api';
	export default {
		name: 'ViewPoll',
		data() {
			return {
				optionToInsert: {
					text: '',
					order: '',
				},
				pollDetails: {},
				editingPoll: {},
				loaded: false,
				editing: false,
				comparePolls: false,
			};
		},
		watch: {
			editingPoll: {
				handler(o, n) {
					this.comparePolls = JSON.stringify(this.pollDetails) === JSON.stringify(this.editingPoll);
				},
				deep: true,
			},
		},
		methods: {
			getPoll() {
				api.get(`/poll/${this.$route.params.id}`)
					.then((res) => {
						this.pollDetails = res.data;
					})
					.then(() => {
						this.loaded = true;
					})
					.catch((error) => {
						alert(error);
						this.$router.push('/user/polls');
					});
			},
			editPoll() {
				let pollJson = JSON.stringify(this.pollDetails); // fiz assim pq a porra do push da opção tava duplicando nos 2 objetos. FML
				this.editingPoll = JSON.parse(pollJson);
				this.editing = true;
			},
			pushOption() {
				if (!this.optionToInsert.text) return alert('Você precisa inserir um texto para a opção');
				this.editingPoll.options.push(this.optionToInsert);
				this.optionToInsert = {
					text: '',
					order: 0,
				};
			},
			removeOption(index) {
				this.editingPoll.options.splice(index, 1);
			},
			async saveEdit() {
				try {
					const res = await api.patch(`/poll/edit/${this.editingPoll.pid}`, this.editingPoll, {
						headers: {
							Authorization: getToken(),
						},
					});
					alert(res.data.msg);
				} catch (error) {
					alert(error);
				}
			},
			cancelEdit() {
				this.editingPoll = {};
				this.editing = false;
			},
		},
		mounted() {
			this.getPoll();
		},
	};
</script>

<style></style>
