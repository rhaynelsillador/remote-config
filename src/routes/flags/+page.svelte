<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="flex flex-row flex-wrap p-8 space-x-4">
	<div class="m-8 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
	    <a href="#">
	        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">New Flag</h5>
	    </a>
	    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Static configuration</p>
	    <a href="/flags/new" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
		New
	    </a>
	</div>
	
	{#each data.flags as { id, key, value}}
		<div class="m-8 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
		    <a>
		        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{key}</h5>
		    </a>
		    <div class="mb-3 font-normal text-gray-700 dark:text-gray-400">
			<label class="inline-flex items-center cursor-pointer">
			<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 pr-2">{value}</span>
			<input type="checkbox" value={value} class="sr-only peer">
			<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
			</label>
		</div>
		    <a href="/flags/flag/{id}" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
			Edit
		    </a>
		</div>
	{/each}
</div>





