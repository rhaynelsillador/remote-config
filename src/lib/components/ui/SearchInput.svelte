<script lang="ts">
  let { 
    value = $bindable(''),
    placeholder = 'Search...',
    loading = false,
    className = '',
    oninput,
    onsubmit = undefined
  } = $props();

  let inputElement: HTMLInputElement;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    if (oninput) {
      oninput(event);
    }
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (onsubmit) {
      onsubmit(value);
    }
  }
</script>

<form onsubmit={handleSubmit} class="w-full max-w-md">
  <div class="relative">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {#if loading}
        <svg class="w-4 h-4 text-gray-500 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
          <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      {:else}
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      {/if}
    </div>
    
    <input 
      bind:this={inputElement}
      type="text" 
      {value}
      {placeholder}
      oninput={handleInput}
      class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors duration-200 {className}"
    />
    
    {#if value}
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        onclick={() => {
          value = '';
          if (inputElement) inputElement.focus();
          if (oninput) oninput({ target: { value: '' } });
        }}
      >
        <svg class="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    {/if}
  </div>
</form>
