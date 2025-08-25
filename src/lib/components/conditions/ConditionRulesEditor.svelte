<script lang="ts">
    import { Button } from '$lib/components/ui';
    import { createEventDispatcher } from 'svelte';

    interface Rule {
        field: string;
        expression: string;
        value: string;
    }

    interface Props {
        rules: Rule[];
        readonly?: boolean;
    }

    let { rules, readonly = false }: Props = $props();
    
    const dispatch = createEventDispatcher();

    const expressionOptions = [
        { value: "EQUALS", label: "Equals" },
        { value: "NOT_EQUALS", label: "Not Equals" },
        { value: "CONTAINS", label: "Contains" },
        { value: "NOT_CONTAINS", label: "Not Contains" },
        { value: "STARTSWITH", label: "Starts With" },
        { value: "ENDSWITH", label: "Ends With" },
        { value: "GREATER_THAN", label: "Greater Than" },
        { value: "LESS_THAN", label: "Less Than" },
        { value: "IN", label: "In List" },
        { value: "NOT_IN", label: "Not In List" }
    ];

    const fieldOptions = [
        { value: "platform", label: "Platform" },
        { value: "version", label: "Version" },
        { value: "build_number", label: "Build Number" },
        { value: "mobile_number", label: "Mobile Number" },
        { value: "user_id", label: "User ID" },
        { value: "country", label: "Country" },
        { value: "device_type", label: "Device Type" }
    ];

    function addRule() {
        const newRules = [...rules, { field: "", expression: "EQUALS", value: "" }];
        dispatch('rulesChange', newRules);
    }

    function removeRule(index: number) {
        const newRules = rules.filter((_, i) => i !== index);
        dispatch('rulesChange', newRules);
    }

    function updateRule(index: number, field: keyof Rule, value: string) {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        
        // If field is being changed to "platform", auto-set expression to "EQUALS"
        if (field === 'field' && value === 'platform') {
            newRules[index].expression = 'EQUALS';
        }
        
        dispatch('rulesChange', newRules);
    }

    // Get available fields for each rule (excluding already selected ones)
    function getAvailableFields(currentIndex: number) {
        const selectedFields = rules
            .map((rule, index) => index !== currentIndex ? rule.field : null)
            .filter(field => field && field.trim() !== '');
        
        return fieldOptions.filter(option => !selectedFields.includes(option.value));
    }

    // Get available expressions based on the selected field
    function getAvailableExpressions(field: string) {
        if (field === 'platform') {
            // For platform field, only allow "Equals"
            return expressionOptions.filter(option => option.value === 'EQUALS');
        }
        
        // For all other fields, allow all expressions
        return expressionOptions;
    }
</script>

<div class="space-y-6">
    <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Condition Rules
                    <span class="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                        {rules.length} rule{rules.length !== 1 ? 's' : ''}
                    </span>
                </h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Define the rules that determine when this condition is met. All rules must be satisfied.
                </p>
            </div>
            {#if !readonly}
            <Button 
                type="button"
                onclick={addRule}
                variant="secondary"
                size="sm"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Rule
            </Button>
            {/if}
        </div>
    </div>

    {#if rules.length === 0}
        <div class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">No Rules</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-1 mb-4">
                {readonly ? 'No rules defined for this condition' : 'Start by adding a rule to define this condition'}
            </p>
            {#if !readonly}
            <Button 
                type="button"
                onclick={addRule}
                variant="primary"
                size="sm"
            >
                Add First Rule
            </Button>
            {/if}
        </div>
    {:else}
        <div class="space-y-4">
            {#each rules as rule, index}
                <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <!-- Field -->
                        <div class="md:col-span-4">
                            <label for="rule-{index}-field" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Field
                            </label>
                            {#if readonly}
                                <div class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                                    {fieldOptions.find(f => f.value === rule.field)?.label || rule.field}
                                </div>
                            {:else}
                                <select 
                                    id="rule-{index}-field"
                                    name="rules[{index}].field"
                                    value={rule.field}
                                    onchange={(e) => updateRule(index, 'field', e.currentTarget.value)}
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="">Select a field...</option>
                                    {#each getAvailableFields(index) as fieldOption}
                                        <option value={fieldOption.value}>{fieldOption.label}</option>
                                    {/each}
                                    <!-- Keep current value even if it would normally be disabled -->
                                    {#if rule.field && !getAvailableFields(index).find(f => f.value === rule.field)}
                                        <option value={rule.field} selected>
                                            {fieldOptions.find(f => f.value === rule.field)?.label || rule.field}
                                        </option>
                                    {/if}
                                </select>
                            {/if}
                        </div>
                        
                        <!-- Expression -->
                        <div class="md:col-span-3">
                            <label for="rule-{index}-expression" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Expression
                            </label>
                            {#if readonly}
                                <div class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
                                    {expressionOptions.find(e => e.value === rule.expression)?.label || rule.expression}
                                </div>
                            {:else}
                                <select 
                                    id="rule-{index}-expression"
                                    name="rules[{index}].expression"
                                    value={rule.expression}
                                    onchange={(e) => updateRule(index, 'expression', e.currentTarget.value)}
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                    disabled={rule.field === 'platform'}
                                >
                                    {#each getAvailableExpressions(rule.field) as option}
                                        <option value={option.value}>{option.label}</option>
                                    {/each}
                                </select>
                                
                            {/if}
                        </div>
                        
                        <!-- Value -->
                        <div class="md:col-span-4">
                            <label for="rule-{index}-value" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Value
                            </label>
                            {#if readonly}
                                <div class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono">
                                    {rule.value}
                                </div>
                            {:else if rule.field === 'platform'}
                                <select 
                                    id="rule-{index}-value"
                                    name="rules[{index}].value"
                                    value={rule.value}
                                    onchange={(e) => updateRule(index, 'value', e.currentTarget.value)}
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="">Select platform...</option>
                                    <option value="android">Android</option>
                                    <option value="ios">iOS</option>
                                </select>
                            {:else}
                                <input 
                                    id="rule-{index}-value"
                                    type="text" 
                                    name="rules[{index}].value"
                                    value={rule.value}
                                    oninput={(e) => updateRule(index, 'value', e.currentTarget.value)}
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="e.g., android, 10.0.10"
                                    required
                                />
                            {/if}
                        </div>
                        
                        <!-- Remove Button -->
                        {#if !readonly}
                        <div class="md:col-span-1">
                            <Button 
                                type="button"
                                onclick={() => removeRule(index)}
                                variant="destructive"
                                size="sm"
                                class="w-full"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </Button>
                        </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
