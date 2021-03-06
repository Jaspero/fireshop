<script>
    import Nav from '$components/Nav.svelte';
    import Footer from '$components/Footer.svelte';

    const blank = '';
</script>

<Nav />

<main>
    <slot />
</main>

<Footer />

{blank}
