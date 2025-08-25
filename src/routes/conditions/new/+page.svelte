<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import { PageHeader, Card, Button, Badge } from '$lib/components/ui';
    import ConditionRulesEditor from '$lib/components/conditions/ConditionRulesEditor.svelte';

    let { data, form }: PageProps = $props();
    
    let condition = $state({
        name: "",
        description: ""
    });

    let rules = $state<Array<{field: string, expression: string, value: string}>>([]);

    function handleRulesChange(event: CustomEvent) {
        rules = event.detail;
    }

    let selectedParameter = $state(null);
</script>

<div class="space-y-6">
    <PageHeader 
        title="Create Condition" 
        subtitle="Add a new condition for targeted parameter values"
    >
        {#snippet actions()}
            <Button href="/conditions" variant="secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Conditions
            </Button>
        {/snippet}
    </PageHeader>

    <form class="space-y-8" method="POST" action="?/create" use:enhance>
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
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button href="/conditions" variant="secondary">
                Cancel
            </Button>
            <button
                type="submit"
                class="flex items-center justify-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl dark:focus:ring-blue-800"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Condition
            </button>
        </div>
    </form>

    {#if form?.success === false}
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium text-red-800 dark:text-red-200">
                    {form.error || 'An error occurred while creating the condition'}
                </span>
            </div>
        </div>
    {/if}
</div>
