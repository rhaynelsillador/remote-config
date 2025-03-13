<script lang="ts">
        import { Button, Modal } from 'flowbite-svelte';
    	import { enhance } from '$app/forms';

	let { data, form } = $props();
        let flag = data.flag;
        let defaultModal = $state(false);
</script>

<div class="flex flex-row">
	<div class="basis-1/3 p-8">
<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form class="space-y-6" method="POST" use:enhance action="?/update">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">Edit Flag</h5>
            <input type="hidden" name="id" id="id" value={flag.id} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"/>
        <div>
            <label for="platform" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Platform</label>
            <input type="text" name="platform" id="platform" value={flag.platform} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="platform" required />
        </div>
        <div> <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code</label>
            <input type="text" name="code" id="code" value={flag.code} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input code" required />
        </div>
        <div>
            <label for="key" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key</label>
            <input type="text" name="key" id="key" value={flag.key} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input key" required />
        </div>
        <div>
            <label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Value</label>
            <input type="text" name="value" id="value" value={flag.value} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input flag key" required />
        </div>
        <div>
            <label for="meta" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Meta-data</label>
            <input type="text" name="meta" id="meta" value={flag.meta_data} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input meta data as json"/>
        </div>
        <button class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>
    </form>

    <form class="space-y-6" method="POST" action="?/upload" use:enhance enctype="multipart/form-data">
        <div>
            <input type="hidden" name="key" id="key" value={flag.key} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input key" required />
        </div>
        <input type="hidden" name="platform" id="platform" value={flag.platform} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="platform" required />
         <div>
            <input type="hidden" name="code" id="code" value={flag.code} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input flag key" required />
        </div>
        <div>
            <label for="meta" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload targets</label>
            <input type="file" id="file" name="fileToUpload" accept=".json" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Input meta data as json"/>
        </div>
        <button formaction="?/upload" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Upload</button>
    </form>

</div>

	</div>
	<div class="basis-2/3">

	<div class="flex flex-row-reverse py-8">
	    <div class="basis-64 pr-4">
	    </div>
	</div>

	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <span class="text-2xl font-bold">Targets</span>

    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
			Target Key
                </th>
                <th scope="col" class="px-6 py-3">
			Value
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
            {#each data.targetKeys as { id, targeting_key, value }}
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {targeting_key}
                </th>
                <td class="px-6 py-4">
                                {value}
                </td>
                <td class="px-6 py-4 text-right">
                    <Button color="red" size="xs" on:click={() => (defaultModal = true)}>delete</Button> 
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
</div>
</div>
</div>

<Modal title="Delete target" bind:open={defaultModal} autoclose>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">Are you sure do want to delete this target?</p>
  <svelte:fragment slot="footer">
    <Button on:click={ async (e) => {
        const response = await fetch('/todo', {
	    method: 'DELETE',
	    headers: {
	        'Content-Type': 'application/json'
	    }
	});
    }}>Ok</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>

{#if form?.success}
    <Alert color="green">
        <span class="font-medium">Successfully created!</span>
    </Alert>
{/if}
