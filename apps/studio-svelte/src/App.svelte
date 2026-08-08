<script lang="ts">
  import { onMount } from "svelte";
  import { Draw } from "draw-svelte";
  import "draw-svelte/styles.css";

  const query = new URLSearchParams(window.location.search);
  const placement =
    query.get("placement") === "left" || query.get("placement") === "right"
      ? (query.get("placement") as "left" | "right")
      : "bottom";
  const theme = query.get("theme") === "dark" ? "dark" : "light";
  const settings = query.get("settings") === "tool" ? "tool" : "bar";
  const motion = query.get("motion") === "none" ? "none" : "rise";
  let chrome = $state(query.get("chrome") !== "false");

  onMount(() => {
    if (query.get("replay") !== "true") return;
    const hide = window.setTimeout(() => {
      chrome = false;
    }, 250);
    const show = window.setTimeout(() => {
      chrome = true;
    }, 1_000);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(show);
    };
  });
</script>

<main>
  <Draw
    {placement}
    {theme}
    {settings}
    {motion}
    {chrome}
    background={theme === "dark" ? "#17171a" : "#ffffff"}
  />
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
  }
</style>
