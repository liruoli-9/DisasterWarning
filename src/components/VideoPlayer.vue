<template>
  <div class="video-player">
    <video ref="videoPlayer" controls>
      <source :src="videoSrc" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    videoSrc: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.playVideo();
  },
  methods: {
    playVideo() {
      this.$refs.videoPlayer.play();
    }
  }
};
</script>

<style scoped>
.video-player {
  max-width: 640px;
  margin: 0 auto;
}
video {
  width: 100%;
  height: auto;
}
</style>