<template>
	<div class="createPoll">
		<div class="container">
			<div class="columns">
				<div class="column is-four-fifths">
					<h1 class="title is-3">
						Criando Nova Enquete
					</h1>
				</div>
				<div class="column is-one-fifth" align="right">
					<a href="#" @click.prevent="$router.go(-1)" class="button is-primary is-outlined">Voltar</a>
				</div>
			</div>

			<form action="#" @submit.prevent="createPoll">
				<div class="field">
					<label class="label" for="name">Nome:</label>
					<input class="input" required type="text" name="name" id="name" v-model="poll.name" />
				</div>
				<div class="field">
					<label class="checkbox" for="usercantype"
						>Ativar opção "Outro"?
						<input type="checkbox" name="usercantype" id="usercantype" v-model="poll.userCanType" />
					</label>
				</div>

				<div class="field has-addons">
					<div class="control is-expanded">
						<input class="input" type="text" name="text" id="text" v-model="optionToInsert.text" placeholder="Digite a Opção" />
					</div>
					<div class="control"><a class="button is-static">Ordem</a></div>
					<div class="control">
						<input class="input" type="number" name="order" min="1" id="order" v-model="optionToInsert.order" />
					</div>
					<div class="control">
						<a class="button is-primary" href="#" @click.prevent="addOption">Adicionar</a>
					</div>
				</div>
				<h2 class="title is-4">Opções:</h2>
				<div class="columns is-multiline">
					<div class="column is-one-quarter" v-for="(option, index) in poll.options" :key="index">
						<div class="card">
							<header class="card-header">
								<p class="card-header-title">Opção #{{ option.order }}</p>
							</header>
							<div class="card-content">
								<div class="content">{{ option.text }}</div>
							</div>
							<footer class="card-footer">
								<a href="#" class="card-footer-item" @click.prevent="removeOption(index)">Remover</a>
							</footer>
						</div>
					</div>
				</div>

				<button class="button is-primary is-fullwidth" type="submit" :disabled="poll.options.length ? false : true">Criar Enquete</button>
			</form>
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
					order: 1,
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
			removeOption(index) {
				this.poll.options.splice(index, 1);
			},
			async createPoll() {
				if (!this.poll.name) return alert('Vc precisa dar nome pra sua enquete né...');
				if (!this.poll.options.length) return alert('Vc precisa dar opções pra sua enquete né...');
				try {
					const res = await api.post('/poll/new', this.poll, {
						headers: {
							Authorization: getToken(),
						},
					});
					this.poll = {
						name: '',
						userCanType: false,
						options: [],
					};
					alert('Enquete criada com sucesso');
				} catch (error) {
					alert(error);
				}
			},
		},
	};
</script>
