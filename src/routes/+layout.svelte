<script lang="ts">
  import "../app.css";
  import Header from "./components/Header.svelte";
  import Menu from "./components/Menu.svelte";

  let { children, data } = $props();
</script>

<main class="app bg-gray-50 dark:bg-gray-900 min-h-screen">
  <aside>
    <Header data={data}></Header>
    <Menu />
  </aside>
  <section>
    <div
      id="main-content"
      class="relative min-h-screen bg-gray-50 lg:ml-64 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto">
        {@render children()}
      </div>
    </div>
  </section>
</main>

<style>
  #main-content {
    padding: 1.5rem;
    padding-top: 6rem;
  }
  
  @media (max-width: 1024px) {
    #main-content {
      padding: 1rem;
      padding-top: 5rem;
    }
  }
</style>
