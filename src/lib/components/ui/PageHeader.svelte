<script lang="ts">
  let { 
    title = '',
    subtitle = '',
    actions = undefined,
    breadcrumbs = undefined,
    children = undefined
  } = $props();
</script>

<div class="mb-8">
  {#if breadcrumbs}
    <nav class="flex mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        {@render breadcrumbs()}
      </ol>
    </nav>
  {/if}

  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {#if subtitle}
        <p class="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
      {/if}
    </div>
    
    {#if actions}
      <div class="flex items-center gap-3">
        {@render actions()}
      </div>
    {/if}
  </div>

  {#if children}
    <div class="mt-6">
      {@render children()}
    </div>
  {/if}
</div>
