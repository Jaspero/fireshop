<script>
    /** @type { number } */
    export let status;
    /** @type { Error } */
    export let error;
</script>

<main>
    <h1>{status}</h1>
    <p>Something went wrong!</p>
    <pre>{error.stack}</pre>
</main>
