<script lang="ts">
  import { Draw } from "draw-svelte";
  import "draw-svelte/styles.css";

  const query = new URLSearchParams(window.location.search);
  const placement =
    query.get("placement") === "left" || query.get("placement") === "right"
      ? (query.get("placement") as "left" | "right")
      : "bottom";
  const theme = query.get("theme") === "dark" ? "dark" : "light";
  const settings = query.get("settings") === "tool" ? "tool" : "bar";
</script>

<main>
  <Draw
    {placement}
    {theme}
    {settings}
    background={theme === "dark" ? "#17171a" : "#ffffff"}
  />
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
  }
</style>
