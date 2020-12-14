<script>
  import Logo from 'enjel/icons/logo.svg';

  const items = [
    { text: 'about', path: '/#/about' },
    { text: 'login', path: '/#/login' }
  ];
  const logoSize = 28;
</script>

<div class="flex flex-col" style="min-height: 100vh;">
  <nav class="flex items-center h-12 px-12 bg-indigo-800 text-white shadow-lg">
    <div class="bg-indigo-900 px-4 mr-2 h-12 flex items-center justify-center">
      <img src={Logo} height={logoSize} width={logoSize}/>
    </div>
    <h1 class="font-black text-xl">cbr</h1>
    <div class="flex-grow"></div>
    <ul class="flex flex-row-reverse">
      {#each items as item (item.path)}
        <li>
          <a href={item.path} class="ml-2 px-4 h-16 text-center font-black hover:bg-cb">
            {item.text}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <section 
    class="flex-grow flex flex-col items-center justify-center text-gray-900"
    style="background: linear-gradient(to bottom, rgba(250, 250, 250, 0.7), rgba(250, 250, 250, 0.7)), url(/bg.png);"
  >
    <h2 class="font-black text-4xl">Applikasi CBR Studi Kasus Penyakit GIGI</h2>
    <h3 class="font-semibold text-lg">Menggunakan <i>Naive Bayes</i> dan <i>KNN</i></h3>
  </section>

  <footer class="flex justify-center items-center h-12 px-12 bg-indigo-900">
    <h3 class="text-gray-300 font-bold">copyright Yulius Bili</h3>
  </footer>
</div>
