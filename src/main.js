import App from './components/index.svelte';
import './styles/index.css';

export default new App({
	target: document.body,
	props: {
		name: 'world'
	}
});
