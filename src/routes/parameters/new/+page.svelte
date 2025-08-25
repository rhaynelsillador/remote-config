<script lang="ts">
    import { Alert, Button, Modal } from "flowbite-svelte";
    import { enhance } from "$app/forms";
    import { onMount } from 'svelte';
    import ParameterForm from "$lib/components/parameters/ParameterForm.svelte";
    import ConditionsTable from "$lib/components/parameters/ConditionsTable.svelte";
    import { PageHeader, Card } from "$lib/components/ui";

    let { data, form } = $props();
    let targetingKey = '';
    
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        targetingKey = params.get('targeting_key') || '';
        flag.targeting_key = targetingKey;
    });

    let flag = $state({
        id: null,
        code: "",
        key: "",
        variant: "String",
        default_value: "",
        description: "",
        targeting_key: targetingKey || "" // Initialize with the query param value
    });
    let defaultModal = $state(false);
    let targetKeys = $state([]);

    function addCondition() {
        const newRow = {
            id: null,
            name: "",
            value: "",
            condition_order: targetKeys.length + 1,
        };

        targetKeys = [...targetKeys, newRow]; // Triggers reactivity
        console.log("Adding new condition", newRow);
    }

    function removeCondition(index: number) {
        targetKeys = targetKeys.filter((_, i) => i !== index);
    }
    
    function handleSubmit(event: Event) {
        const formData = new FormData(event.target as HTMLFormElement);
        formData.append('targetKeys', JSON.stringify(targetKeys));
        return true;
    }
</script>

<div class="space-y-6">
    <PageHeader 
        title="Create Parameter" 
        subtitle="Add a new configuration parameter to the system"
    >
        {#snippet actions()}
            <Button href="/parameters" variant="secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Parameters
            </Button>
        {/snippet}
    </PageHeader>

    <form class="space-y-8" method="POST" use:enhance action="?/create" on:submit|preventDefault={handleSubmit}>
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
                        </h3>
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Define conditions that determine when this parameter should return specific values.
                        </p>
                    </div>
                    <ConditionsTable {flag} {targetKeys} {data} {addCondition} {removeCondition} />
                </div>
            </Card>
        </div>

        <!-- Submit Button - At the Bottom -->
        <div class="w-full">
            <Card variant="default" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ready to Create Parameter?</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Review your parameter configuration and conditions before creating.
                        </p>
                    </div>
                    <button
                        type="submit"
                        class="flex items-center justify-center px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl dark:focus:ring-blue-800"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Create Parameter
                    </button>
                </div>
            </Card>
        </div>
    </form>

    {#if form?.success}
        <Alert color="green" class="mb-6">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-medium">Parameter created successfully!</span>
            </div>
        </Alert>
    {/if}
</div>

<style>
    .form-group {
        margin-bottom: 16px;
    }

    .group-message {
        margin-bottom: 60px;
        display: block;
        text-align: center;
        margin-top: 60px;
    }
</style>
