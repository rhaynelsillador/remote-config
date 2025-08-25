<script lang="ts">
    import type { PageProps } from "./$types";
    import { PageHeader, Button, Badge, Card } from '$lib/components/ui';
    import ConditionRulesEditor from "$lib/components/conditions/ConditionRulesEditor.svelte";

    let { data }: PageProps = $props();
    
    const condition = data.condition;
    const parametersUsing = data.parametersUsing || [];
    
    let rules = $state(
        condition.condition_json && Array.isArray(condition.condition_json) 
            ? [...condition.condition_json] 
            : []
    );
</script>

<div class="space-y-6">
    <PageHeader 
        title="Condition Details" 
        subtitle="View condition configuration and usage"
    >
        {#snippet actions()}
            <div class="flex space-x-3">
                <Button href="/conditions" variant="secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Conditions
                </Button>
                <Button href="/conditions/edit/{condition.id}" variant="primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Condition
                </Button>
            </div>
        {/snippet}
    </PageHeader>

    <!-- Condition Information -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Information -->
        <div class="lg:col-span-2 space-y-6">
            <Card variant="default">
                <div class="space-y-6">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Condition Name
                            </div>
                            <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <code class="text-sm font-mono text-gray-900 dark:text-white">
                                    {condition.name}
                                </code>
                            </div>
                        </div>
                        
                        <div>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Condition ID
                            </div>
                            <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <Badge variant="secondary">
                                    {condition.id}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    {#if condition.description}
                    <div>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Description
                        </div>
                        <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <p class="text-sm text-gray-900 dark:text-white">
                                {condition.description}
                            </p>
                        </div>
                    </div>
                    {/if}
                </div>
            </Card>

            <!-- Condition Rules -->
            {#if rules.length > 0}
            <Card variant="default">
                <ConditionRulesEditor {rules} readonly={true} />
            </Card>
            {/if}

            <!-- Parameters Using This Condition -->
            {#if parametersUsing && parametersUsing.length > 0}
            <Card variant="default">
                <div class="space-y-4">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                            </svg>
                            Parameters Using This Condition
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Parameters that reference this condition ({parametersUsing.length})
                        </p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each parametersUsing as parameter}
                        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
                                            {parameter.key}
                                        </h4>
                                        <Badge variant="secondary" size="sm">
                                            {parameter.variant}
                                        </Badge>
                                    </div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        Returns: <span class="font-mono text-green-700 dark:text-green-300">{parameter.condition_value}</span>
                                    </p>
                                    {#if parameter.default_value}
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Default: <span class="font-mono">{parameter.default_value}</span>
                                    </p>
                                    {/if}
                                </div>
                                <div class="flex space-x-1 ml-2">
                                    <Button href="/parameters/{parameter.id}" variant="secondary" size="sm">
                                        View
                                    </Button>
                                    <Button href="/parameters/edit/{parameter.id}" variant="secondary" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
            </Card>
            {:else}
            <Card variant="default">
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">No Parameters</h3>
                    <p class="text-gray-500 dark:text-gray-400 mt-1">
                        This condition is not currently used by any parameters
                    </p>
                </div>
            </Card>
            {/if}
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
            <Card variant="default">
                <div class="space-y-4">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Parameters Using</span>
                            <Badge variant="info">
                                {parametersUsing.length}
                            </Badge>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Rules Defined</span>
                            <Badge variant="secondary">
                                {condition.condition_json ? condition.condition_json.length : 0}
                            </Badge>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Created</span>
                            <span class="text-sm text-gray-900 dark:text-white">
                                {new Date(condition.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500 dark:text-gray-400">Updated</span>
                            <span class="text-sm text-gray-900 dark:text-white">
                                {new Date(condition.updated_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</div>
