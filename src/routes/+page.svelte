<script lang="ts">
	import { PageHeader, Card, Button, Badge } from '$lib/components/ui';
</script>

<div class="space-y-6">
	<PageHeader 
		title="Dashboard" 
		subtitle="Welcome to Configzero - Your configuration management hub"
	/>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<Card variant="elevated">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Configuration Parameters</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Manage dynamic configuration values</p>
				</div>
			</div>
			<div class="mt-4">
				<Button href="/parameters" variant="ghost" size="sm">
					View Parameters →
				</Button>
			</div>
		</Card>

		<Card variant="elevated">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Feature Flags</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Control feature toggles and rollouts</p>
				</div>
			</div>
			<div class="mt-4">
				<Button href="/flags" variant="ghost" size="sm">
					View Flags →
				</Button>
			</div>
		</Card>

		<Card variant="elevated">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Conditions</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">Set up conditional logic rules</p>
				</div>
			</div>
			<div class="mt-4">
				<Button href="/conditions" variant="ghost" size="sm">
					View Conditions →
				</Button>
			</div>
		</Card>
	</div>

	<!-- Quick Actions -->
	<Card variant="elevated">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<Button href="/parameters/new" variant="primary" className="h-20 flex-col">
				<svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
				</svg>
				New Parameter
			</Button>

			<Button href="/flags/new" variant="success" className="h-20 flex-col">
				<svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
				</svg>
				New Flag
			</Button>

			<Button href="/conditions/new" variant="warning" className="h-20 flex-col">
				<svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
				</svg>
				New Condition
			</Button>

			<Button href="/docs" variant="ghost" className="h-20 flex-col">
				<svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
				Documentation
			</Button>
		</div>
	</Card>

	<!-- Getting Started -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card variant="outlined">
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
						New to Configzero? Here are some resources to help you get started with configuration management.
					</p>
					<div class="space-y-2">
						<a href="#" class="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
							→ Configuration Best Practices
						</a>
						<a href="#" class="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
							→ Feature Flag Strategies  
						</a>
						<a href="#" class="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
							→ API Documentation
						</a>
					</div>
				</div>
			</div>
		</Card>

		<Card variant="outlined">
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
						<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">System Status</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
						All systems are operational and running smoothly.
					</p>
					<div class="flex items-center space-x-2">
						<Badge variant="success">API Online</Badge>
						<Badge variant="success">Database Connected</Badge>
					</div>
				</div>
			</div>
		</Card>
	</div>
</div>