<script lang="ts">
	import type { PageProps } from './$types';
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
</script>

<div class="space-y-6">
	<PageHeader 
		title="Feature Flags" 
		subtitle="Manage feature toggles and configuration flags"
	>
		{#snippet actions()}
			<Button href="/flags/new" variant="primary">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
				</svg>
				Create Flag
			</Button>
		{/snippet}
		
		{#snippet children()}
			<div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
				<SearchInput 
					bind:value={searchQuery}
					placeholder="Search flags..."
					{loading}
					oninput={handleSearch}
					className="w-full sm:w-96"
				/>
				
				{#if searchQuery}
					<Badge variant="primary">
						{data.pagination.totalCount} result{data.pagination.totalCount !== 1 ? 's' : ''} for "{searchQuery}"
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
				<span class="ml-2 text-gray-600 dark:text-gray-400">Loading flags...</span>
			</div>
		{:else if data.flags.length === 0}
			<div class="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-gray-400">
				<svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
				</svg>
				<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No flags found</h3>
				<p class="text-center max-w-md">
					{#if searchQuery}
						No flags match your search for "{searchQuery}". Try adjusting your search terms.
					{:else}
						Get started by creating your first feature flag to control feature rollouts.
					{/if}
				</p>
				{#if !searchQuery}
					<Button href="/flags/new" variant="primary" className="mt-4">
						Create First Flag
					</Button>
				{/if}
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-6 py-4 font-medium">Flag Name</th>
							<th scope="col" class="px-6 py-4 font-medium">Value</th>
							<th scope="col" class="px-6 py-4 font-medium">Description</th>
							<th scope="col" class="px-6 py-4 font-medium">Created</th>
							<th scope="col" class="px-6 py-4 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.flags as flag}
							<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
								<!-- Name Column -->
								<td class="px-6 py-4">
									<div class="flex items-center">
										<div class="flex-shrink-0 mr-3">
											<div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
												<svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
												</svg>
											</div>
										</div>
										<div>
											<div class="font-medium text-gray-900 dark:text-white">
												{flag.name}
											</div>
											<div class="text-sm text-gray-500 dark:text-gray-400">
												ID: {flag.id}
											</div>
										</div>
									</div>
								</td>
								
								<!-- Value Column -->
								<td class="px-6 py-4">
									<div class="flex items-center">
										{#if typeof flag.value === 'boolean'}
											<Badge variant={flag.value ? 'success' : 'secondary'}>
												{flag.value ? 'Enabled' : 'Disabled'}
											</Badge>
										{:else}
											<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
												{flag.value}
											</code>
										{/if}
									</div>
								</td>
								
								<!-- Description Column -->
								<td class="px-6 py-4">
									{#if flag.description}
										<div class="text-gray-900 dark:text-white max-w-xs truncate" title={flag.description}>
											{flag.description}
										</div>
									{:else}
										<span class="text-gray-400 italic">No description</span>
									{/if}
								</td>
								
								<!-- Created Column -->
								<td class="px-6 py-4">
									<div class="text-sm text-gray-500 dark:text-gray-400">
										{new Date(flag.created_at).toLocaleDateString()}
									</div>
								</td>
								
								<!-- Actions Column -->
								<td class="px-6 py-4">
									<div class="flex space-x-2">
										<Button href="/flags/{flag.id}" variant="secondary" size="sm">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
											</svg>
											View
										</Button>
										<Button href="/flags/edit/{flag.id}" variant="secondary" size="sm">
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
	{#if data.pagination.totalCount > 0}
		<div class="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 border border-gray-200 dark:border-gray-700 rounded-xl">
			<div class="text-sm text-gray-500 dark:text-gray-400">
				Showing {((data.pagination.page - 1) * data.pagination.pageSize) + 1} to {Math.min(data.pagination.page * data.pagination.pageSize, data.pagination.totalCount)} of {data.pagination.totalCount} flags
			</div>
			
			{#if data.pagination.totalPages > 1}
				<div class="flex space-x-2">
					<!-- Previous Button -->
					<Button 
						variant="secondary" 
						size="sm" 
						disabled={data.pagination.page === 1}
						onclick={() => handlePageChange(data.pagination.page - 1)}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
						</svg>
						Previous
					</Button>
					
					<!-- Page Numbers -->
					{#each Array.from({length: Math.min(5, data.pagination.totalPages)}, (_, i) => {
						const start = Math.max(1, data.pagination.page - 2);
						return start + i;
					}).filter(page => page <= data.pagination.totalPages) as page}
						<Button 
							variant={page === data.pagination.page ? 'primary' : 'secondary'} 
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
						disabled={data.pagination.page === data.pagination.totalPages}
						onclick={() => handlePageChange(data.pagination.page + 1)}
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