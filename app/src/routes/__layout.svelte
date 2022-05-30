<script>
  import { authStore } from '$lib/auth.js';

  // Register our user class with Moralis
  import Player from '$lib/moralisobjects/player.js';

  authStore.init('moralis');
</script>

<slot />
