<script>
  import { push } from "svelte-spa-router";
  import Logo from 'enjel/icons/logo.svg';

  const logoSize = 28;

  function onLogout() {
    localStorage.removeItem("sigizi.username");
    push("/");
    return false;
  }

  function onUji () {
    push("/app/uji");
    return false;
  }
</script>

<nav class="flex items-center h-12 px-4 bg-gray-900 text-white">
  <div class="bg-gray-700 px-4 mr-2 h-12 flex items-center justify-center">
    <img src={Logo} height={logoSize} width={logoSize}/>
  </div>
  <h1 class="font-black text-xl">cbr</h1>
  <div class="flex-grow"></div>
  <ul class="flex flex-row-reverse text-gray-600">
    <li>
      <a 
        on:click|preventDefault={onLogout}
        href="/"
        class="block ml-2 px-4 h-12 flex items-center justify-center font-black hover:bg-gray-700 visited:text-gray-200"
      >
        logout
      </a>
    </li>
    <li>
      <a href='/about' class="block ml-2 px-4 h-12 flex items-center justify-center font-black hover:bg-gray-700 visited:text-gray-200">
        about
      </a>
    </li>
  </ul>
</nav>
