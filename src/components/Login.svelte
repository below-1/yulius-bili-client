<script>
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import Logo from 'enjel/icons/logo.svg';
  import http from 'enjel/services/axios.js';
  import { post } from 'enjel/gql/Login.js';

  const items = [
    { text: 'about', path: '/#/about' },
    { text: 'login', path: '/#/login' }
  ];
  const logoSize = 28;

  let username = '';
  let password = '';
  let errorMessage = null;

  async function login () {
    const payload = {
      username,
      password
    };
    try {
      const response = await http.post('/v1/api/auth/login', payload);
      localStorage.setItem("cbr.username", "admin");
      replace('/app');
      return;
    } catch (err) {
      console.log(err);
      const message = err.message;
      switch (message) {
        case 'user_not_found':
          errorMessage = `tidak dapat menemukan user dengan nama ${username}`;
          break;
        case 'user_not_found':
          errorMessage = `password salah`;
          break;
        default:
          errorMessage = 'terjadi kesalahan';
          break;
      }
    }
  }

  onMount(() => {
    const username = localStorage.getItem('cbr.username');
    if (username) {
      replace('/app');
      return;
    }
  })
</script>

<div class="flex flex-col" style="min-height: 100vh;">
  <nav class="flex items-center h-12 px-12 bg-orange-600 text-white">
    <div class="bg-cb px-4 mr-2 h-12 flex items-center justify-center">
      <img src={Logo} height={logoSize} width={logoSize}/>
    </div>
    <h1 class="font-black text-xl">sigizi</h1>
    <div class="flex-grow"></div>
    <ul class="flex flex-row-reverse">
      {#each items as item (item.path)}
        <li>
          <a href={item.path} class="ml-2 px-4 h-16 text-center font-black hover:bg-red-800">
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <section 
    class="flex-grow flex flex-col items-center justify-center"
  >
    <form>
      {#if errorMessage}
        <div>{errorMessage}</div>
      {/if}
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Username
        </label>
        <input
          bind:value={username} 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Password
        </label>
        <input
          type="password" 
          bind:value={password} 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
    </form>

    <button 
      class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
      type="button"
      on:click={login}
    >
      Login
    </button>
  </section>

  <footer class="flex justify-center items-center h-12 px-12 border-t border-gray-300 bg-gray-100">
    <h3 class="text-gray-500 font-bold">copyright enjel ilkom 2020</h3>
  </footer>
</div>
