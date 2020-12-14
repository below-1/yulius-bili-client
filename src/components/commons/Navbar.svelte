<script>
  import Logo from 'enjel/icons/logo.svg';

  const logoSize = 28;
  const items = [
    { text: 'penyakit', path: '/#/app/penyakit' },
    { text: 'gejala', path: '/#/app/gejala' },
    { text: 'rekam medik', path: '/#/app/rm' },
    { text: 'penentuan', path: '/#/app/cbr' },
    { text: 'kfold', path: '/#/app/kfold' }
  ];
</script>

<nav class="flex items-center px-4 bg-blue-700 text-gray-200">
  <h1 class="font-medium">Case Based Reasoning</h1>
  <div class="flex-grow"></div>
  <ul class="flex flex-row-reverse font-bold">
    {#each items as item (item.path)}
      <li>
        <a href={item.path} class="block ml-2 px-4 h-12 flex items-center justify-center hover:bg-blue-600">
          {item.text}
        </a>
      </li>
    {/each}
  </ul>
</nav>
