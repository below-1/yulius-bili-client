<script>
  import Router from 'svelte-spa-router';
  import App from './app/index.svelte';
  import Landing from './Landing.svelte';
  import Login from './Login.svelte';
  import Cbr from "./Cbr.svelte";

  const routes = {
    '/': Landing,
    '/app': App,
    '/app/*': App,
    '/cbr': Cbr,
    '/cbr/*': Cbr,
    '/login': Login
  };
</script>

<Router {routes}></Router>