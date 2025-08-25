<script lang="ts">
  let { 
    currentPage = 1,
    totalPages = 1,
    totalCount = 0,
    onPageChange,
    showInfo = true,
    className = ''
  } = $props();

  function handlePrevious() {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  }

  function handleNext() {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  }

  function handlePageClick(page: number) {
    if (page !== currentPage && onPageChange) {
      onPageChange(page);
    }
  }

  // Generate page numbers to show
  const visiblePages = $derived(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index);
  });
</script>

<div class="flex flex-col items-center space-y-4 {className}">
  {#if showInfo}
    <span class="text-sm text-gray-700 dark:text-gray-400">
      Showing page <span class="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of 
      <span class="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
      {#if totalCount > 0}
        (<span class="font-semibold text-gray-900 dark:text-white">{totalCount}</span> total entries)
      {/if}
    </span>
  {/if}

  {#if totalPages > 1}
    <nav class="inline-flex items-center -space-x-px rounded-md shadow-sm" aria-label="Pagination">
      <!-- Previous button -->
      <button
        onclick={handlePrevious}
        disabled={currentPage === 1}
        class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span class="ml-1">Previous</span>
      </button>

      <!-- Page numbers -->
      {#each visiblePages() as page}
        {#if page === '...'}
          <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
            ...
          </span>
        {:else}
          <button
            onclick={() => typeof page === 'number' && handlePageClick(page)}
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium border {page === currentPage 
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 focus:z-20 dark:bg-blue-900 dark:border-blue-500 dark:text-blue-300' 
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700 focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }"
          >
            {page}
          </button>
        {/if}
      {/each}

      <!-- Next button -->
      <button
        onclick={handleNext}
        disabled={currentPage === totalPages}
        class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 focus:z-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <span class="mr-1">Next</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </nav>
  {/if}
</div>
