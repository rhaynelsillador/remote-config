<script lang="ts">
        import { Alert } from 'flowbite-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	console.log(form)
</script>

<div class="p-8">
<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form class="space-y-6" method="POST" action="?/create">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">Create New Flag</h5>
        <div>
            <label for="platform" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Platform</label>
            <input type="text" name="platform" id="platform" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="platform" required />
        </div>
        <div>
            <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
            <input type="text" name="code" id="code" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input code" required />
        </div>
        <div>
            <label for="key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key</label>
            <input type="text" name="key" id="key" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input key" required />
        </div>
        <div>
            <label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Value</label>
            <input type="text" name="value" id="value" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input flag key" required />
        </div>
        <div>
            <label for="meta" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Meta-data</label>
            <input type="text" name="meta" id="meta" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input meta data as json"/>
        </div>
        <button formaction="?/create" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
    </form>
</div>
</div>
{#if form?.success}
    <Alert color="green">
        <span class="font-medium">Successfully created!</span>
    </Alert>
{/if}
