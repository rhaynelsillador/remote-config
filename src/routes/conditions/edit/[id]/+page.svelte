<script lang="ts">
    import { Alert, Button, Modal } from "flowbite-svelte";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { PageHeader, Card } from "$lib/components/ui";
    import ConditionRulesEditor from "$lib/components/conditions/ConditionRulesEditor.svelte";

    let { data, form } = $props();
    let condition = $state({ ...data.condition });
    let rules = $state(
        data.condition.condition_json && Array.isArray(data.condition.condition_json) 
            ? [...data.condition.condition_json] 
            : []
    );
    let deleteModal = $state(false);
    let initialDataId = $state(data.condition.id); // Track which condition we're editing

    function handleRulesChange(event: CustomEvent) {
        rules = event.detail;
    }

    // Only reinitialize if we're editing a different condition (different ID)
    $effect(() => {
        if (data.condition && data.condition.id !== initialDataId) {
            condition = { ...data.condition };
            rules = data.condition.condition_json && Array.isArray(data.condition.condition_json) 
                ? [...data.condition.condition_json] 
                : [];
            initialDataId = data.condition.id;
        }
    });
</script>

<div class="space-y-6">
    {#if form?.success}
        <Alert color="green" class="mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Condition updated successfully! Your changes have been saved.</span>
            </div>
        </Alert>
    {/if}

    {#if form?.error}
        <Alert color="red" class="mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Error: {form.message || 'Failed to update condition'}</span>
            </div>
        </Alert>
    {/if}

    <PageHeader 
        title="Edit Condition" 
        subtitle="Modify condition configuration and rules"
    >
        {#snippet actions()}
            <div class="flex space-x-3">
                <Button href="/conditions" variant="secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Conditions
                </Button>
                <Button href="/conditions/{data.condition.id}" variant="secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View Details
                </Button>
                <Button 
                    on:click={() => deleteModal = true} 
                    variant="destructive"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                </Button>
            </div>
        {/snippet}
    </PageHeader>

    <form class="space-y-8" method="POST" action="?/update" use:enhance={({ cancel }) => {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                // Update the condition object with the latest values but keep rules as-is
                // This prevents the $effect from resetting the rules
                condition.name = condition.name; // Keep current form values
                condition.description = condition.description;
                // Don't reset rules - keep the current state
            }
            await update({ reset: false }); // Don't reset the form
        };
    }}>
        <!-- Basic Information -->
        <div class="w-full">
            <Card variant="default">
                <div class="space-y-6">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Basic Information
                        </h3>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Configure the basic properties of this condition.
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Condition Name *
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                bind:value={condition.name}
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="e.g., android_10.0.10"
                                required
                            >
                        </div>
                        
                        <div>
                            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <input 
                                type="text" 
                                id="description" 
                                name="description" 
                                bind:value={condition.description}
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="Optional description"
                            >
                        </div>
                    </div>
                </div>
            </Card>
        </div>
        
        <!-- Condition Rules -->
        <div class="w-full">
            <Card variant="default">
                <ConditionRulesEditor {rules} readonly={false} on:rulesChange={handleRulesChange} />
            </Card>
        </div>

        <!-- Hidden input for rules -->
        <input type="hidden" name="rules" value={JSON.stringify(rules)} />

        <!-- Submit Button -->
        <div class="w-full">
            <Card variant="default" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ready to Update Condition?</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Review your changes to the condition configuration and rules before updating.
                        </p>
                    </div>
                    <button
                        type="submit"
                        class="flex items-center justify-center px-8 py-3 text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl dark:focus:ring-green-800"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Update Condition
                    </button>
                </div>
            </Card>
        </div>
    </form>
</div>

<!-- Delete Confirmation Modal -->
<Modal bind:open={deleteModal} size="sm">
    <div class="text-center">
        <svg class="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Condition</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to delete this condition? This action cannot be undone.
        </p>
        <div class="flex justify-center space-x-3">
            <Button variant="secondary" onclick={() => deleteModal = false}>
                Cancel
            </Button>
            <form method="POST" action="?/delete" use:enhance={({ cancel }) => {
                return async ({ result, update }) => {
                    if (result.type === 'redirect') {
                        // Manually navigate to conditions page after successful deletion
                        await goto('/conditions');
                    } else if (result.type === 'failure') {
                        // Show error message
                        await update();
                        deleteModal = false;
                    } else {
                        await update();
                    }
                };
            }}>
                <Button type="submit" variant="destructive">
                    Delete Condition
                </Button>
            </form>
        </div>
    </div>
</Modal>
