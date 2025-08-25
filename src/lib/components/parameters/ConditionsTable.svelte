<script lang="ts">
    import { Button } from "flowbite-svelte";

    interface Props {
        flag: any;
        targetKeys: any[];
        data: any;
        addCondition: () => void;
        removeCondition: (index: number) => void;
    }

    let { flag, targetKeys, data, addCondition, removeCondition }: Props = $props();
    
    let jsonValidationErrors = $state<{[key: number]: string}>({});
    let isValidJson = $state<{[key: number]: boolean}>({});
    
    function validateJson(value: string, index: number) {
        if (!value.trim()) {
            jsonValidationErrors[index] = "";
            isValidJson[index] = true;
            return;
        }
        
        try {
            JSON.parse(value);
            jsonValidationErrors[index] = "";
            isValidJson[index] = true;
        } catch (error) {
            jsonValidationErrors[index] = error instanceof Error ? error.message : "Invalid JSON format";
            isValidJson[index] = false;
        }
    }
    
    function handleJsonInput(event: Event, index: number) {
        const target = event.target as HTMLTextAreaElement;
        targetKeys[index].value = target.value;
        if (flag.variant === "Object") {
            validateJson(target.value, index);
        }
    }
</script>

<div class="space-y-4">
    {#if flag.variant === "Group"}
        <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex flex-col items-center">
                <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Group Parameter</h3>
                <p class="text-gray-500 dark:text-gray-400">
                    Cannot assign conditions to Group type parameters. Group parameters organize other parameters.
                </p>
            </div>
        </div>
    {:else}
        <!-- Conditions Management -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-white">Parameter Conditions</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400">Define conditional values based on targeting criteria</p>
            </div>
            <Button 
                color="green" 
                size="sm" 
                on:click={addCondition}
                class="flex items-center"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Condition
            </Button>
        </div>

        {#if targetKeys.length === 0}
            <div class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">No Conditions</h3>
                <p class="text-gray-500 dark:text-gray-400 mt-1 mb-4">
                    This parameter will always return the default value. Add conditions to make it dynamic.
                </p>
                <Button color="blue" size="sm" on:click={addCondition}>
                    Create First Condition
                </Button>
            </div>
        {:else}
            <div class="space-y-4">
                {#each targetKeys as { id, name, value, condition_order }, index}
                    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                            <!-- Condition Selection -->
                            <div class="lg:col-span-4">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Condition
                                </label>
                                <select 
                                    required
                                    name="conditions[{index}].id" 
                                    id="conditions[{index}].id" 
                                    value={id}
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select a condition...</option>
                                    {#each data.conditions as condition}
                                        <option value={condition.id}>{condition.name}</option>
                                    {/each}
                                </select>
                            </div>

                            <!-- Value Input -->
                            <div class="lg:col-span-6">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Return Value
                                </label>
                                {#if flag.variant === "Object"}
                                    <div class="relative">
                                        <textarea 
                                            name="conditions[{index}].value" 
                                            id="conditions[{index}].value" 
                                            value={value}
                                            oninput={(e) => handleJsonInput(e, index)}
                                            rows="3"
                                            class="w-full px-3 py-2 border {isValidJson[index] !== false ? 'border-gray-300 dark:border-gray-600 focus:border-blue-500' : 'border-red-300 dark:border-red-600 focus:border-red-500'} rounded-lg focus:ring-2 {isValidJson[index] !== false ? 'focus:ring-blue-500' : 'focus:ring-red-500'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y font-mono text-sm"
                                            placeholder={`{"key": "value"} or ["item1", "item2"]`}
                                            required
                                        ></textarea>
                                        {#if isValidJson[index] === false}
                                            <div class="absolute right-3 top-3">
                                                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        {:else if value?.trim()}
                                            <div class="absolute right-3 top-3">
                                                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                                </svg>
                                            </div>
                                        {/if}
                                    </div>
                                    {#if jsonValidationErrors[index]}
                                        <p class="text-xs text-red-500 dark:text-red-400 flex items-center mt-1">
                                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                            </svg>
                                            {jsonValidationErrors[index]}
                                        </p>
                                    {/if}
                                {:else if flag.variant === "Number"}
                                    <input 
                                        type="number" 
                                        name="conditions[{index}].value" 
                                        id="conditions[{index}].value"
                                        value={value}
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Enter numeric value"
                                        required
                                    >
                                {:else if flag.variant === "Boolean"}
                                    <div class="relative">
                                        <select
                                            name="conditions[{index}].value"
                                            id="conditions[{index}].value"
                                            value={value}
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                                            required
                                        >
                                            <option value="">Select boolean value...</option>
                                            <option value="true">true</option>
                                            <option value="false">false</option>
                                        </select>
                                        <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                {:else}
                                    <textarea 
                                        name="conditions[{index}].value" 
                                        id="conditions[{index}].value" 
                                        {value}
                                        rows="2"
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-y"
                                        placeholder="Enter return value (supports multi-line)"
                                        required
                                    ></textarea>
                                {/if}
                            </div>

                            <!-- Order and Actions -->
                            <div class="lg:col-span-1">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Order
                                </label>
                                <input 
                                    type="number" 
                                    name="conditions[{index}].condition_order"
                                    id="conditions[{index}].condition_order" 
                                    value={condition_order}
                                    min="1"
                                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="1"
                                    required
                                >
                            </div>

                            <div class="lg:col-span-1 flex items-end">
                                <Button 
                                    color="red" 
                                    size="sm" 
                                    on:click={() => removeCondition(index)}
                                    class="w-full"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </Button>
                            </div>
                        </div>

                        <!-- Condition Info -->
                        <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
                            Condition #{index + 1}: When the selected condition is met, return the specified value instead of the default value.
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    .group-message {
        margin-bottom: 60px;
        display: block;
        text-align: center;
        margin-top: 60px;
    }
</style>
