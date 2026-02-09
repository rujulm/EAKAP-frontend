<template>
  <header class="header">
    <h2 class="name">AI Assistant</h2>

    <div class="nav">
      <button type="button">Profile</button>
      <button type="button">Logout</button>
    </div>
  </header>
</template>

<style scoped>
.header {
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
</style>
