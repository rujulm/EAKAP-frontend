<template>
  <div>
    <header>
      <h2 class="name">AI Assistant</h2>
      <div class="nav">
        <button>Profile</button>
        <button>Logout</button>
      </div>
    </header>
    <main class="page">
      <slot />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 50px;
  background-color: rgb(81, 123, 170);
  padding: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

.name {
  color: white;
  margin: 0;
}

.nav {
  display: flex;
  gap: 8px;
}

.page {
  margin: 1rem auto;
  padding: 0 12px;
  width: 90%;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
