<script>
	export let show = false;
</script>

<!-- Backrdrop -->
{#if show}
	<div 
		class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center"
		style="z-index: 99; background: rgba(255, 255, 255, 0.6)"
		on:click|self={() => {
			show = false;
		}}
	>
		<slot name="content"></slot>
	</div>
{/if}