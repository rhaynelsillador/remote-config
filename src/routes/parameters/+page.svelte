<script lang="ts">
    import type { PageProps } from "./$types";
    import { debounce } from "$lib/utils/debounce";
    import { goto } from '$app/navigation';
    import { onMount } from "svelte";
    import { PageHeader, SearchInput, Button, Badge } from '$lib/components/ui';

    let { data }: PageProps = $props();
    let searchQuery = $state("");
    let loading = $state(false);

    const debouncedSearch = debounce(async (query: string) => {
        try {
            loading = true;
            const url = new URL(window.location.href);
            if (query) {
                url.searchParams.set('search', query);
                url.searchParams.set('page', '1');
            } else {
                url.searchParams.delete('search');
            }
            history.replaceState({}, '', url.toString());

            await goto(url.pathname + url.search, {
                replaceState: true,
                noScroll: true
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            loading = false;
        }
    }, 500);

    function handleSearch(event: Event) {
        const query = (event.target as HTMLInputElement).value;
        searchQuery = query;
        debouncedSearch(query);
    }

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);
        searchQuery = urlParams.get('search') || "";
    });

    const handlePageChange = async (page: number) => {
        try {
            loading = true;
            const url = new URL(window.location.href);
            url.searchParams.set('page', page.toString());
            history.replaceState({}, '', url.toString());

            await goto(url.pathname + url.search, {
                replaceState: true,
                noScroll: true
            });
        } catch (error) {
            console.error('Page change error:', error);
        } finally {
            loading = false;
        }
    };

    // Transform data for the table
    const tableData = $derived(() => {
        const rows = [];
        
        for (const param of data.parameters) {
            if (param.variant === "Group") {
                // Add group row
                rows.push({
                    ...param,
                    isGroup: true,
                    level: 0
                });
                
                // Add sub-parameter rows
                for (const subParam of param.sub_params || []) {
                    rows.push({
                        ...subParam,
                        isGroup: false,
                        level: 1,
                        parentId: param.id
                    });
                }
            } else {
                rows.push({
                    ...param,
                    isGroup: false,
                    level: 0
                });
            }
        }
        
        return rows;
    });
</script>

<div class="space-y-6">
    <PageHeader 
        title="Parameters" 
        subtitle="Manage configuration parameters and their values"
    >
        {#snippet actions()}
            <Button href="/parameters/new" variant="primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Parameter
            </Button>
        {/snippet}
        
        {#snippet children()}
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <SearchInput 
                    bind:value={searchQuery}
                    placeholder="Search parameters..."
                    {loading}
                    oninput={handleSearch}
                    className="w-full sm:w-96"
                />
                
                {#if searchQuery}
                    <Badge variant="primary">
                        {data.totalCount} result{data.totalCount !== 1 ? 's' : ''} for "{searchQuery}"
                    </Badge>
                {/if}
            </div>
        {/snippet}
    </PageHeader>

    <div class="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {#if loading}
            <div class="flex items-center justify-center p-8">
                <svg class="w-8 h-8 text-gray-500 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2 text-gray-600 dark:text-gray-400">Loading parameters...</span>
            </div>
        {:else if tableData().length === 0}
            <div class="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
                <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No parameters found</h3>
                <p class="text-center max-w-md">
                    {#if searchQuery}
                        No parameters match your search for "{searchQuery}". Try adjusting your search terms.
                    {:else}
                        Get started by creating your first configuration parameter.
                    {/if}
                </p>
                {#if !searchQuery}
                    <Button href="/parameters/new" variant="primary" className="mt-4">
                        Create First Parameter
                    </Button>
                {/if}
            </div>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-4 font-medium">Parameter Key</th>
                            <th scope="col" class="px-6 py-4 font-medium">Default Value & Conditions</th>
                            <th scope="col" class="px-6 py-4 font-medium">Type</th>
                            <th scope="col" class="px-6 py-4 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each tableData() as row}
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 {row.isGroup ? 'bg-blue-50 dark:bg-blue-900/20' : ''}">
                                <!-- Key Column -->
                                <td class="px-6 py-4">
                                    <div class="flex items-center {row.level > 0 ? 'ml-8' : ''}">
                                        {#if row.isGroup}
                                            <svg class="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                                            </svg>
                                        {:else if row.level > 0}
                                            <svg class="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                                            </svg>
                                        {/if}
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">
                                                {row.key}
                                            </div>
                                            {#if row.description}
                                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                                    {row.description}
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </td>
                                
                                <!-- Default Value Column -->
                                <td class="px-6 py-4">
                                    {#if row.isGroup}
                                        <span class="text-gray-400 italic">Group</span>
                                    {:else}
                                        <div class="space-y-2">
                                            <!-- Default Value -->
                                            {#if row.default_value}
                                                <div>
                                                    <span class="text-xs text-gray-500 font-medium block mb-1">Default:</span>
                                                    <code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                                                        {row.default_value}
                                                    </code>
                                                </div>
                                            {/if}
                                            
                                            <!-- Conditions -->
                                            {#if row.condition_json && Array.isArray(row.condition_json) && row.condition_json.length > 0}
                                                <div>
                                                    <span class="text-xs text-gray-500 font-medium block mb-1">Conditions:</span>
                                                    <div class="space-y-1">
                                                        {#each row.condition_json as conditionGroup}
                                                            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded px-2 py-1">
                                                                <div class="flex items-center justify-between text-xs">
                                                                    
                                                                    {conditionGroup.conditions.map(c => `${c.name}`).join(', ')}
                                                                    <span class="text-blue-600 dark:text-blue-400 ml-2">
                                                                        {conditionGroup.conditions.length} condition{conditionGroup.conditions.length > 1 ? 's' : ''}
                                                                    </span>
                                                                </div>
                                                                <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">
																	<code class="text-blue-800 dark:text-blue-200 font-medium">
                                                                        {conditionGroup.value}
                                                                    </code>
                                                                </div>
                                                            </div>
                                                        {/each}
                                                    </div>
                                                </div>
                                            {:else if !row.default_value}
                                                <span class="text-gray-400 italic">No default</span>
                                            {/if}
                                            
                                        </div>
                                    {/if}
                                </td>
                                
                                <!-- Type Column -->
                                <td class="px-6 py-4">
                                    <Badge variant={row.variant === 'Group' ? 'info' : 'secondary'}>
                                        {row.variant}
                                    </Badge>
                                </td>
                                
                                <!-- Actions Column -->
                                <td class="px-6 py-4">
                                    <div class="flex space-x-2">
                                        <Button href="/parameters/{row.id}" variant="secondary" size="sm">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                            </svg>
                                            View
                                        </Button>
                                        <Button href="/parameters/edit/{row.id}" variant="secondary" size="sm">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                            Edit
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>

    <!-- Pagination -->
    {#if data.totalCount > 0}
        <div class="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div class="text-sm text-gray-500 dark:text-gray-400">
                Showing {((data.page - 1) * data.pageSize) + 1} to {Math.min(data.page * data.pageSize, data.totalCount)} of {data.totalCount} parameters
            </div>
            
            {#if data.totalPages > 1}
                <div class="flex space-x-2">
                    <!-- Previous Button -->
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        disabled={data.page === 1}
                        onclick={() => handlePageChange(data.page - 1)}
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Previous
                    </Button>
                    
                    <!-- Page Numbers -->
                    {#each Array.from({length: Math.min(5, data.totalPages)}, (_, i) => {
                        const start = Math.max(1, data.page - 2);
                        return start + i;
                    }).filter(page => page <= data.totalPages) as page}
                        <Button 
                            variant={page === data.page ? 'primary' : 'secondary'} 
                            size="sm"
                            onclick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    {/each}
                    
                    <!-- Next Button -->
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        disabled={data.page === data.totalPages}
                        onclick={() => handlePageChange(data.page + 1)}
                    >
                        Next
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Button>
                </div>
            {/if}
        </div>
    {/if}
</div>