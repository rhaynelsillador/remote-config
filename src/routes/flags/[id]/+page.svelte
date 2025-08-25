<script lang="ts">
	import { Button, Badge } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { flag } = data;

	function handleEdit() {
		goto(`/flags/edit/${flag.id}`);
	}

	function handleBack() {
		goto('/flags');
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>{flag.name} - Flag Details - ConfigZero Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">{flag.name}</h1>
				<p class="mt-2 text-gray-600 dark:text-gray-400">Flag details and configuration</p>
			</div>
			<div class="flex gap-3">
				<Button color="alternative" onclick={handleBack}>
					← Back to Flags
				</Button>
				<Button onclick={handleEdit}>
					Edit Flag
				</Button>
			</div>
		</div>

		<!-- Flag Details Card -->
		<div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
			<!-- Basic Information -->
			<div class="p-6 border-b border-gray-200 dark:border-gray-700">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flag Information</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Flag ID
						</label>
						<p class="text-gray-900 dark:text-white text-sm">
							{flag.id}
						</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Flag Name
						</label>
						<p class="text-gray-900 dark:text-white font-mono text-sm bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
							{flag.name}
						</p>
					</div>
				</div>
			</div>

			<!-- Flag Value -->
			<div class="p-6 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Value</h3>
				<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
					<pre class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono">{flag.value}</pre>
				</div>
			</div>

			<!-- Description -->
			<div class="p-6 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
				{#if flag.description}
					<p class="text-gray-900 dark:text-white text-sm leading-relaxed">
						{flag.description}
					</p>
				{:else}
					<p class="text-gray-500 dark:text-gray-400 text-sm italic">
						No description provided
					</p>
				{/if}
			</div>

			<!-- Metadata -->
			<div class="p-6">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metadata</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Created At
						</label>
						<p class="text-gray-900 dark:text-white text-sm">
							{formatDate(flag.created_at)}
						</p>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Last Updated
						</label>
						<p class="text-gray-900 dark:text-white text-sm">
							{formatDate(flag.updated_at)}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
