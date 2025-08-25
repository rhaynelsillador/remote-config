<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Alert, Modal } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let { flag } = data;

	let name = $state(flag.name);
	let value = $state(flag.value);
	let description = $state(flag.description || '');
	let submitting = $state(false);
	let showDeleteModal = $state(false);

	function handleCancel() {
		goto(`/flags/${flag.id}`);
	}

	function handleDelete() {
		showDeleteModal = true;
	}

	function handleSubmit() {
		return async ({ update }) => {
			submitting = true;
			await update();
			submitting = false;
		};
	}

	function handleDeleteConfirm() {
		return async ({ update }) => {
			submitting = true;
			await update();
			submitting = false;
			showDeleteModal = false;
		};
	}
</script>

<svelte:head>
	<title>Edit {flag.name} - ConfigZero Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="max-w-2xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Edit Flag</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				Update the configuration for <span class="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{flag.name}</span>
			</p>
		</div>

		<!-- Error Alert -->
		{#if form?.error}
			<div class="mb-6">
				<Alert color="red" dismissable>
					<span class="font-medium">Error:</span> {form.message}
				</Alert>
			</div>
		{/if}

		<!-- Edit Form -->
		<form method="POST" action="?/update" use:enhance={handleSubmit}>
			<div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
				<!-- Flag Name -->
				<div>
					<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Flag Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						bind:value={name}
						required
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Enter flag name (e.g., enable_new_feature)"
					/>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
						Use a descriptive name that clearly identifies the feature or functionality.
					</p>
				</div>

				<!-- Flag Value -->
				<div>
					<label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Flag Value *
					</label>
					<textarea
						id="value"
						name="value"
						bind:value={value}
						required
						rows="4"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 font-mono"
						placeholder="Enter flag value (e.g., true, false, config-value)"
					></textarea>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
						The value that this flag will return. Can be boolean, string, number, or JSON.
					</p>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						bind:value={description}
						rows="3"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Optional description of what this flag controls..."
					></textarea>
					<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
						Optional description to help others understand the purpose of this flag.
					</p>
				</div>

				<!-- Form Actions -->
				<div class="flex gap-4 pt-4">
					<Button
						type="submit"
						disabled={submitting || !name.trim() || !value.trim()}
						class="flex-1"
					>
						{submitting ? 'Updating...' : 'Update Flag'}
					</Button>
					<Button
						type="button"
						color="alternative"
						onclick={handleCancel}
						class="flex-1"
					>
						Cancel
					</Button>
				</div>
			</div>
		</form>

		<!-- Danger Zone -->
		<div class="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
			<h3 class="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Danger Zone</h3>
			<p class="text-red-700 dark:text-red-300 text-sm mb-4">
				Once you delete this flag, there is no going back. Please be certain.
			</p>
			<Button color="red" onclick={handleDelete}>
				Delete Flag
			</Button>
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
<Modal bind:open={showDeleteModal} autoclose={false} class="w-full">
	<div class="text-center">
		<svg
			class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 20 20"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete the flag <span class="font-mono font-semibold">{flag.name}</span>?
		</h3>
		<p class="mb-5 text-sm text-gray-400 dark:text-gray-500">
			This action cannot be undone.
		</p>
		<div class="flex justify-center gap-4">
			<form method="POST" action="?/delete" use:enhance={handleDeleteConfirm}>
				<Button type="submit" color="red" disabled={submitting}>
					{submitting ? 'Deleting...' : 'Yes, delete it'}
				</Button>
			</form>
			<Button color="alternative" onclick={() => showDeleteModal = false}>
				Cancel
			</Button>
		</div>
	</div>
</Modal>
