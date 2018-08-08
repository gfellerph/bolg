<template>
  <div class="drawing" id="zeichne">
    <hr class="blog-divider">
    <p class="italic text-align-center">Zeichne dini Meinig zur Gschicht:</p>
    <div class="drawing__canvas-border">
      <canvas id="drawing" class="drawing__canvas blank"></canvas>
    </div>
    <p class="drawing__error error hide"></p>
    <p class="text-align-center">
      <button class="drawing__clear">Lösche</button>
      <button class="drawing__save">Schicke</button>
    </p>
  </div>
</template>

<script>
import drawing from 'src/modules/drawing';

export default {
  mounted() {
    drawing();
  },
}
</script>

