<template>
	<div id="app">
		<MainMenu :key="lo" v-on:loggedout="changeLo" />
		<router-view v-on:loggedout="changeLo" />
	</div>
</template>
<script>
	// @ is an alias to /src
	import MainMenu from './components/MainMenu.vue';

	export default {
		data() {
			return {
				lo: false,
			};
		},
		methods: {
			changeLo() {
				this.lo = !this.lo; // forçar o rerender do menu pra exibir ou não opções baseado no status logado ou não do usuário
			},
		},
		components: {
			MainMenu,
		},
	};
</script>
<style lang="scss">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
</style>
