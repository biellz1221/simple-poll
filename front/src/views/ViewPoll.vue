<template>
	<div class="editPoll">
		<div class="container" v-if="loaded">
			<div class="columns">
				<div class="column is-9">
					<h1 class="title is-3">Detalhes da Enquete "{{ pollDetails.name }}"</h1>
					<h2 class="subtitle is-6" v-if="pollDetails.totalVotes">Você não pode editar esta enquete pois ela já recebeu votos.</h2>
					<h2 class="subtitle is-6" v-if="!editing">Total de Votos: {{ pollDetails.totalVotes }}</h2>
				</div>
				<div class="column buttons is-3" align="right">
					<button class="button is-danger" @click.prevent="cancelEdit" v-if="editing">Cancelar</button>
					<button class="button is-primary" @click.prevent="editPoll" v-if="!pollDetails.totalVotes" :disabled="editing">Editar</button>
					<a href="#" @click.prevent="$router.go(-1)" class="button is-primary is-outlined">Voltar</a>
				</div>
			</div>
			<div class="field">
				<div class="field">
					<label for="usercantype" class="checkbox"
						><b>Enquete recebendo votos? </b>
						<input type="checkbox" name="usercantype" id="usercantype" v-model="pollDetails.isOpen" disabled v-if="!editing" />
						<input type="checkbox" name="usercantype" id="usercantype" v-model="editingPoll.isOpen" v-else />
					</label>
				</div>
			</div>
			<div v-if="editing" class="field">
				<label class="label" for="name">Nome:</label>
				<input class="input" required type="text" name="name" id="name" v-model="editingPoll.name" /><br />
			</div>

			<h2 class="title is-5" v-if="editing">Nova Opção:</h2>
			<div class="field has-addons" v-if="editing">
				<div class="control is-expanded">
					<input class="input" type="text" name="text" id="text" v-model="optionToInsert.text" placeholder="Texto da Opção" />
				</div>
				<div class="control"><a class="button is-static">Ordem</a></div>
				<div class="control">
					<input class="input" type="number" name="order" id="order" v-model="optionToInsert.order" placeholder="Ordem (número)" />
				</div>
				<div class="control">
					<a href="#" class="button is-primary" @click.prevent="pushOption">Add Opção</a>
				</div>
			</div>

			<h2 class="title is-4">Opções:</h2>
			<div class="field">
				<label for="usercantype" class="checkbox"
					><b>Opção "Outro"? </b>
					<input type="checkbox" name="usercantype" id="usercantype" v-model="pollDetails.userCanType" disabled v-if="!editing" />
					<input type="checkbox" name="usercantype" id="usercantype" v-model="editingPoll.userCanType" v-else />
				</label>
			</div>
			<div class="columns is-multiline" v-if="!editing">
				<div class="column is-one-quarter" v-for="(option, index) in pollDetails.options" :key="index">
					<div class="card">
						<header class="card-header">
							<p class="card-header-title">Opção #{{ option.order }}</p>
						</header>
						<div class="card-content">
							<div class="content">
								{{ option.text }}<br />
								<b>Votos: </b>{{ option.votes }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="columns is-multiline" v-else>
				<div class="column is-one-quarter" v-for="(option, index) in pollDetails.options" :key="index">
					<div class="card">
						<header class="card-header">
							<p class="card-header-title">Opção #{{ option.order }}</p>
						</header>
						<div class="card-content">
							<div class="content">
								<div class="field">
									<label for="text" class="label">Texto</label>
									<input class="input" type="text" name="text" id="text" v-model="editingPoll.options[index].text" />
								</div>
								<div class="field">
									<label for="order" class="label">Ordem</label>
									<input class="input" min="1" type="number" name="order" id="order" v-model="editingPoll.options[index].order" />
								</div>
							</div>
						</div>
						<footer class="card-footer">
							<a href="#" class="card-footer-item" @click.prevent="removeOption(index)">Remover</a>
						</footer>
					</div>
				</div>
			</div>
			<div class="mb-5 buttons is-centered">
				<button class="button is-primary" v-if="editing" :disabled="comparePolls" @click.prevent="saveEdit">Salvar Alterações</button>
				<button class="button is-danger" @click.prevent="cancelEdit" v-if="editing">Cancelar</button>
			</div>
		</div>
		<div v-else class="columns is-centered">
			<div class="column is-half">
				<progress class="progress is-small is-primary" max="100">100%</progress>
			</div>
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
				if (!this.optionToInsert.order) return alert('Você precisa inserir a ordem da opção');
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
					this.editing = false;
					this.getPoll();
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
