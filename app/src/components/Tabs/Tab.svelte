<script>
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(tab);
</script>

<style>
	button {
		background: none;
/* 		border: none; */
/* 		border-bottom: 2px solid white; */
/* 		border-radius: 0; */
/* 		margin: 0; */
/* 		color: #ccc; */
		
		justify-content: center;
		align-items: center;

		position: static;
		width: 102px;
		height: 36px;
		background: #F2F4F5;
		border-radius: 32px;
	}
	
	.selected {
/* 		border: 2px solid teal; */
/* 		color: #333; */
		background: #f2e7ff;
	}
</style>

<button class:selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
	<slot></slot>
</button>