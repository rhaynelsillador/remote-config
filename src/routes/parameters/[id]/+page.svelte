<script lang="ts">
    import type { PageProps } from "./$types";
    import { PageHeader, Button, Badge, Card } from '$lib/components/ui';

    let { data }: PageProps = $props();
    
    const parameter = data.parameter;
    const conditions = data.conditions || [];
</script>

<div class="space-y-6">
    <PageHeader 
        title="Parameter Details" 
        subtitle="View parameter configuration and conditions"
    >
        {#snippet actions()}
            <div class="flex space-x-3">
                <Button href="/parameters" variant="secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to Parameters
                </Button>
                <Button href="/parameters/edit/{parameter.id}" variant="primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Parameter
                </Button>
            </div>
        {/snippet}
    </PageHeader>

    <!-- Parameter Information -->
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
                                Parameter Key
                            </div>
                            <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <code class="text-sm font-mono text-gray-900 dark:text-white">
                                    {parameter.key}
                                </code>
                            </div>
                        </div>
                        
                        <div>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Parameter Code
                            </div>
                            <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <code class="text-sm font-mono text-gray-900 dark:text-white">
                                    {parameter.code}
                                </code>
                            </div>
                        </div>
                        
                        <div>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Default Value
                            </div>
                            <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <span class="text-sm text-gray-900 dark:text-white">
                                    {parameter.default_value || 'No default value'}
                                </span>
                            </div>
                        </div>
                        
                        <div>
                            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Variant
                            </div>
                            <div class="mt-2">
                                <Badge variant={parameter.variant === 'Group' ? 'primary' : 'secondary'}>
                                    {parameter.variant}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    {#if parameter.description}
                    <div>
                        <div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                        </div>
                        <div class="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <p class="text-sm text-gray-900 dark:text-white">
                                {parameter.description}
                            </p>
                        </div>
                    </div>
                    {/if}
                </div>
            </Card>

            <!-- Parameter Conditions -->
            {#if parameter.condition_json && Array.isArray(parameter.condition_json) && parameter.condition_json.length > 0}
            <Card variant="default">
                <div class="space-y-4">
                    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Parameter Conditions
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Conditional values that this parameter can return based on targeting criteria
                        </p>
                    </div>
                    
                    <div class="space-y-4">
                        {#each parameter.condition_json as conditionGroup}
                        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3 mb-3">
                                        <h4 class="text-lg font-semibold text-blue-900 dark:text-blue-100">
                                            Return Value
                                        </h4>
                                        <code class="bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 px-3 py-1 rounded-md text-sm font-mono text-blue-800 dark:text-blue-200">
                                            {conditionGroup.value}
                                        </code>
                                    </div>
                                    
                                    <div class="space-y-2">
                                        <h5 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                                            Required Conditions ({conditionGroup.conditions.length}):
                                        </h5>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {#each conditionGroup.conditions as condition}
                                            <div class="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-600 rounded-lg p-3">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                                                        {condition.name}
                                                    </span>
                                                    <Badge variant="secondary" size="sm">
                                                        {condition.id}
                                                    </Badge>
                                                </div>
                                                {#if condition.description}
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {condition.description}
                                                </p>
                                                {/if}
                                                {#if condition.condition_json && Array.isArray(condition.condition_json)}
                                                <div class="mt-2 space-y-1">
                                                    {#each condition.condition_json as rule}
                                                    <div class="text-xs bg-gray-50 dark:bg-gray-700 rounded px-2 py-1">
                                                        <span class="font-mono text-purple-600 dark:text-purple-400">{rule.field}</span>
                                                        <span class="text-gray-500 mx-1">{rule.expression}</span>
                                                        <span class="font-mono text-green-600 dark:text-green-400">{rule.value}</span>
                                                    </div>
                                                    {/each}
                                                </div>
                                                {/if}
                                            </div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
            </Card>
            {/if}

          
        </div>

        <!-- Sidebar Information -->
        <div class="space-y-6">
            <Card variant="default">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Metadata</h3>
                    
                    <div class="space-y-3">
                        <div>
                            <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Parameter ID
                            </div>
                            <p class="text-sm font-mono text-gray-900 dark:text-white mt-1">
                                {parameter.id}
                            </p>
                        </div>
                        
                        {#if parameter.environment}
                        <div>
                            <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Environment
                            </div>
                            <div class="mt-1">
                                <Badge variant="primary">
                                    {parameter.environment}
                                </Badge>
                            </div>
                        </div>
                        {/if}
                        
                        {#if parameter.targeting_key}
                        <div>
                            <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Targeting Key
                            </div>
                            <p class="text-sm font-mono text-gray-900 dark:text-white mt-1">
                                {parameter.targeting_key}
                            </p>
                        </div>
                        {/if}
                    </div>
                </div>
            </Card>

            <!-- Quick Actions -->
            <Card variant="default">
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                    
                    <div class="space-y-2">
                        <Button href="/parameters/edit/{parameter.id}" variant="primary" className="w-full">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit Parameter
                        </Button>
                        
                        <Button href="/conditions?search={parameter.key}" variant="secondary" className="w-full">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            View Related Conditions
                        </Button>
                        
                        <Button href="/parameters/new" variant="secondary" className="w-full">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create New Parameter
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</div>
