<script lang="ts">
    import { Alert, Button } from "flowbite-svelte";
    import { dataTypes } from "$lib/constants";
    import { Card, PageHeader } from "$lib/components/ui";

    interface Props {
        flag: any;
    }

    let { flag }: Props = $props();
    
    let jsonValidationError = $state("");
    let isValidJson = $state(true);
    
    function validateJson(value: string) {
        if (!value.trim()) {
            jsonValidationError = "";
            isValidJson = true;
            return;
        }
        
        try {
            JSON.parse(value);
            jsonValidationError = "";
            isValidJson = true;
        } catch (error) {
            jsonValidationError = error instanceof Error ? error.message : "Invalid JSON format";
            isValidJson = false;
        }
    }
    
    function handleJsonInput(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        flag.default_value = target.value;
        if (flag.variant === "Object") {
            validateJson(target.value);
        }
    }
</script>

<Card variant="default" className="w-full">
    <div class="space-y-6">
        <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Parameter Configuration
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Configure the parameter details and settings below.
            </p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Hidden Fields -->
            <input type="hidden" name="id" value={flag.id} />
            <input type="hidden" name="targeting_key" value={flag.targeting_key} />

            <!-- Code Field -->
            <div class="space-y-2">
                <label for="code" class="block text-sm font-semibold text-gray-900 dark:text-white">
                    Code <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="code"
                    id="code"
                    bind:value={flag.code}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                    placeholder="Enter parameter code"
                    required
                />
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Unique identifier for the parameter
                </p>
            </div>

            <!-- Key Field -->
            <div class="space-y-2">
                <label for="key" class="block text-sm font-semibold text-gray-900 dark:text-white">
                    Key <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="key"
                    id="key"
                    bind:value={flag.key}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                    placeholder="Enter parameter key"
                    required
                />
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Human-readable parameter name
                </p>
            </div>

            <!-- Data Type Field -->
            <div class="space-y-2">
                <label for="variant" class="block text-sm font-semibold text-gray-900 dark:text-white">
                    Data Type <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <select
                        name="variant"
                        id="variant"
                        bind:value={flag.variant}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 appearance-none"
                        required
                    >
                        <option value="" disabled>Select data type</option>
                        {#each dataTypes as type}
                            <option value={type}>{type}</option>
                        {/each}
                    </select>
                    <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    The data type of the parameter value
                </p>
            </div>
        </div>

        <!-- Default Value Field - Full Width for Long Values -->
        {#if flag.variant !== "Group"}
        <div class="space-y-2">
            <label for="default_value" class="block text-sm font-semibold text-gray-900 dark:text-white">
                Default Value <span class="text-red-500">*</span>
            </label>
            {#if flag.variant === "Boolean"}
                <div class="relative">
                    <select
                        name="default_value"
                        id="default_value"
                        bind:value={flag.default_value}
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 appearance-none"
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
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Select true or false for boolean parameters.
                </p>
            {:else if flag.variant === "Object"}
                <div class="relative">
                    <textarea
                        name="default_value"
                        id="default_value"
                        value={flag.default_value}
                        oninput={handleJsonInput}
                        rows="4"
                        class="w-full px-4 py-3 border {isValidJson ? 'border-gray-300 focus:border-blue-500' : 'border-red-300 focus:border-red-500'} rounded-lg focus:ring-2 {isValidJson ? 'focus:ring-blue-500' : 'focus:ring-red-500'} transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm resize-y"
                        placeholder={`{"key": "value"} or ["item1", "item2"]`}
                        required
                    ></textarea>
                    {#if !isValidJson}
                        <div class="absolute right-3 top-3">
                            <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    {:else if flag.default_value.trim()}
                        <div class="absolute right-3 top-3">
                            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    {/if}
                </div>
                {#if jsonValidationError}
                    <p class="text-xs text-red-500 dark:text-red-400 flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        {jsonValidationError}
                    </p>
                {:else}
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        Enter valid JSON object or array.
                    </p>
                {/if}
            {:else}
                <textarea
                    name="default_value"
                    id="default_value"
                    bind:value={flag.default_value}
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 resize-y"
                    placeholder="Enter default value (supports multi-line for long values)"
                    required
                ></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Default value when no conditions match. Use this text area for longer values.
                </p>
            {/if}
        </div>
        {/if}

        <!-- Description Field -->
        <div class="space-y-2">
            <label for="description" class="block text-sm font-semibold text-gray-900 dark:text-white">
                Description
            </label>
            <textarea
                name="description"
                id="description"
                bind:value={flag.description}
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 resize-none"
                placeholder="Describe the purpose and usage of this parameter..."
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400">
                Optional description to help other users understand this parameter
            </p>
        </div>
    </div>
</Card>

<style>
    .form-group {
        margin-bottom: 16px;
    }
</style>