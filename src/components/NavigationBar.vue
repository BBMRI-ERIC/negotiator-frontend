<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Negotiator Home</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 ">
          <li class="nav-item btn-nav">
            <button class="btn btn-outline-primary my-2 my-sm-0">Login</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navigation-bar",
}
</script>

<style>
nav {
  width: 100%;
  font-size: 1rem;
  text-align: left;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
  } 
}
</style>

