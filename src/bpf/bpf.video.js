import videojs from 'video.js';
require('videojs-youtube');
// import 'videojs-youtube';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/fantasy/index.css';


// initialize
(() => {
  console.log('bpf.videojs started!!');

  // const video = videojs('my-video', {
  //   autoplay: true,
  //   controls: true,
  //   preload: 'auto',
  //   playbackRates: [0.5, 1, 1.2, 1.5, 2]
  // });
  const video = videojs('my-video', {
    autoplay: true,
    controls: true,
    preload: 'auto',

    techOrder: ['youtube'],
    forceSSL: true,
    forceHTML5: true
  });

  // +++ Define the middleware function +++
// Calculate playback time ranges
  const createNewRanges = (timeRanges, playbackRate) => {
    const newRanges = [];

    for (let i = 0; i < timeRanges.length; i++) {
      newRanges.push([
        timeRanges.start(i) / playbackRate,
        timeRanges.end(i) / playbackRate]);
    }

    console.log('createNewRanges', newRanges);
    return videojs.createTimeRange(newRanges);
  };

// Adjust values based on playback rate
  const playbackrateAdjuster = function(player) {
    let tech;

    // Listen for ratechange event
    player.on('ratechange', function() {
      tech.trigger('durationchange');
      tech.trigger('timeupdate');
    });

    // Implement setSource() to work with all sources
    return {
      setSource(srcObj, next) {
        next(null, srcObj);
      },

      // Store the tech that Video.js gives us after source selection is complete.

      setTech(newTech) {
        tech = newTech;
      },

      // Override methods
      duration(dur) {
        console.log('duration', dur);
        return dur / player.playbackRate();
      },

      currentTime(ct) {
        // console.log('currentTime', ct);
        return ct / player.playbackRate();
      },

      setCurrentTime(ct) {
        console.log('setCurrentTime', ct);
        return ct * player.playbackRate();
      },

      buffered(bf) {
        console.log('buffered', bf);
        return createNewRanges(bf, player.playbackRate());
      },

      seekable(seekable) {
        console.log('seekable', seekable);
        return createNewRanges(seekable, player.playbackRate());
      },

      played(played) {
        console.log('played', played);
        return createNewRanges(played, player.playbackRate());
      }

    };
  };

// +++ Register the middleware with the player +++
  videojs.use('*', playbackrateAdjuster);

  video.ready(function(){
    // When the player is ready, get a reference to it
    const myPlayer = this;
    // +++ Define the playback rate options +++
    const options = {"playbackRates":[0.5, 1, 1.5, 2, 4]};
    // +++ Initialize the playback rate button +++
    myPlayer.controlBar.playbackRateMenuButton = myPlayer.controlBar.addChild('PlaybackRateMenuButton', {
      playbackRates: options.playbackRates
    });
  });
})();


