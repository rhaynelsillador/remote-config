<script lang="ts">
    import { Alert, Button, Modal } from "flowbite-svelte";
    import { enhance } from "$app/forms";
    import ParameterForm from "$lib/components/parameters/ParameterForm.svelte";
    import ConditionsTable from "$lib/components/parameters/ConditionsTable.svelte";
    import { PageHeader, Card } from "$lib/components/ui";

    let { data, form } = $props();
    let flag = $state({ ...data.flag });
    let defaultModal = $state(false);
    let targetKeys = $state([...data.targetKeys]);

    // Remove the problematic $effect that was resetting targetKeys

    function addCondition() {
        const newRow = {
            id: null,
            name: "",
            value: "",
            condition_order: targetKeys.length + 1,
        };

        targetKeys = [...targetKeys, newRow];
        console.log('Added condition, total conditions:', targetKeys.length);
    }

    function removeCondition(index: number) {
        targetKeys = targetKeys.filter((_, i) => i !== index);
        console.log('Removed condition, total conditions:', targetKeys.length);
    }
</script>

<div class="space-y-6">
    {#if form?.success}
        <Alert color="green" class="mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Parameter updated successfully! Your changes have been saved.</span>
            </div>
        </Alert>
    {/if}

    {#if form?.error}
        <Alert color="red" class="mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Error: {form.message || 'Failed to update parameter'}</span>
            </div>
        </Alert>
    {/if}

    <PageHeader 
        title="Edit Parameter" 
        subtitle="Modify parameter configuration and conditions"
    >
        {#snippet actions()}
            <div class="flex space-x-3">
                <Button href="/parameters" variant="secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Parameters
                </Button>
                <Button href="/parameters/{data.flag.id}" variant="secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    View Details
                </Button>
            </div>
        {/snippet}
    </PageHeader>

    <form class="space-y-8" method="POST" action="?/update" use:enhance={({ formData, cancel }) => {
        // Add targetKeys to form data before submission
        formData.set('targetKeys', JSON.stringify(targetKeys));
        
        return async ({ result }) => {
            if (result.type === 'success') {
                // Only update flag data, keep targetKeys as they are in current state
                if (result.data?.flag) {
                    flag = { ...result.data.flag };
                }
                // Don't touch targetKeys - let them stay as user configured
                console.log('Form updated successfully, preserving targetKeys state');
            }
        };
    }}>
        <!-- Hidden input for targetKeys - reactive to changes -->
        <input type="hidden" name="targetKeys" value={JSON.stringify(targetKeys)} />
        <!-- Parameter Form - Full Width at Top -->
        <div class="w-full">
            <ParameterForm {flag} />
        </div>
        
        <!-- Conditions Section - Full Width at Bottom -->
        <div class="w-full">
            <Card variant="default">
                <div class="space-y-6">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg class="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Conditions & Targeting
                            <span class="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                {targetKeys.length} condition{targetKeys.length !== 1 ? 's' : ''}
                            </span>
                        </h3>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Modify conditions that determine when this parameter should return specific values.
                            <span class="text-xs text-blue-600 ml-2">
                                Debug: Currently {targetKeys.length} conditions in state
                            </span>
                        </p>
                    </div>
                    <ConditionsTable {flag} {targetKeys} {data} {addCondition} {removeCondition} />
                </div>
            </Card>
        </div>

        <!-- Submit Button - At the Bottom -->
        <div class="w-full">
            <Card variant="default" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ready to Update Parameter?</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Review your changes to the parameter configuration and conditions before updating.
                        </p>
                    </div>
                    <button
                        type="submit"
                        class="flex items-center justify-center px-8 py-3 text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl dark:focus:ring-green-800"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Update Parameter
                    </button>
                </div>
            </Card>
        </div>
    </form>
</div>

<style>
    .form-group {
        margin-bottom: 16px;
    }
/* 
    .group-message {
        margin-bottom: 60px;
        display: block;
        text-align: center;
        margin-top: 60px;
    } */
</style>
