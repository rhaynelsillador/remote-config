<script lang="ts">
  let { 
    data = [],
    columns = [],
    loading = false,
    emptyMessage = 'No data available',
    className = '',
    rowClassName = '',
    onRowClick
  } = $props();
</script>

<div class="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 {className}">
  {#if loading}
    <div class="flex items-center justify-center p-8">
      <svg class="w-8 h-8 text-gray-500 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
        <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  {:else if data.length === 0}
    <div class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
      <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p>{emptyMessage}</p>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {#each columns as column}
              <th scope="col" class="px-6 py-4 font-medium {column.className || ''}">
                {column.header}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each data as row, index}
            <tr 
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 {rowClassName} {onRowClick ? 'cursor-pointer' : ''}"
              onclick={() => onRowClick && onRowClick(row, index)}
            >
              {#each columns as column}
                <td class="px-6 py-4 {column.cellClassName || ''}">
                  {#if column.cell}
                    {@render column.cell(row[column.key], row, index)}
                  {:else}
                    {row[column.key] || '-'}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
