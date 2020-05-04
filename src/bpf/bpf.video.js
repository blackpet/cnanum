import videojs from 'video.js';
// require('videojs-youtube');
import 'videojs-youtube';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/fantasy/index.css';


// initialize
(() => {
  console.log('bpf.videojs started!!');

  let timer = {
    played: 0,
    opened: 0,

    timestamp: 0,
    elapsed: 0,
    interval: 5, // 진도체크 갱신 단위 (s)

    /**
     * start timer
     */
    start: () => {
      timer.timestamp = new Date().getTime();
    },

    /**
     * count-up timer
     * @param player
     */
    increseTime: (player, updateProgress) => {
      console.log(timer);
      if(updateProgress) console.log('forced updateProgress!');

      timer.elapsed = (new Date().getTime() - timer.timestamp) / 1000;
      // played time
      timer.played += player.paused() ? 0 : timer.elapsed * player.playbackRate();
      // opened time
      timer.opened += timer.elapsed;

      timer.timestamp = new Date().getTime();

      // update study progress
      if (updateProgress || timer.opened % timer.interval < 1) {
        timer.updateProgress();
      }
    },

    /**
     * update study progress
     */
    updateProgress: () => {
      console.log('updateProgress > played: ', timer.played);
      console.log('updateProgress > opened: ', timer.opened);

      // TODO blackpet: call server program
      console.log(video.el().dataset);
    }
  };

  // const video = videojs('my-video', {
  //   width: 800,
  //   height: 450,
  //   autoplay: true,
  //   controls: true,
  //   preload: 'auto',
  //   // controlBar: {
  //   //   children: [
  //   //       'playToggle',
  //   //       'volumePanel',
  //   //       'currentTimeDisplay',
  //   //       'timeDivider',
  //   //       'durationDisplay',
  //   //       'progressControl',
  //   //       'liveDisplay',
  //   //       'seekToLive',
  //   //       'remainingTimeDisplay',
  //   //       'customControlSpacer',
  //   //       'playbackRateMenuButton',
  //   //       'chaptersButton',
  //   //       'descriptionsButton',
  //   //       'subsCapsButton',
  //   //       'audioTrackButton',
  //   //       'fullscreenToggle'
  //   //     ],
  //   // }
  //   // controlBar: {
  //   //   audioButtonMenuButton: true,
  //   //   // currentTime: true,
  //   //   // playbackRate: false,
  //   //   // playbackRateMenuButton: false,
  //   //   // progressControl: false,
  //   // },
  //   // playbackRates: [0.2, 0.5, 1, 1.2, 1.5, 2, 4],
  //
  //   // techOrder: ['youtube'],
  //   // forceSSL: true,
  //   // forceHTML5: true,
  //   // Origin: 'http://localhost:4000'
  // });

  const defaultOptions = {
    width: 800,
    height: 450,
    autoplay: true,
    controls: true,
    preload: 'auto',
    playbackRates: [0.2, 0.5, 1, 1.2, 1.5, 2],
    // controlBar: {
    //   playToggle: true,
    //   currentTimeDisplay: true,
    //   durationDisplay: true,
    //   progressControl: true,
    //   remainingTimeDisplay: true,
    //   timeDivider: true,
    // }
  };

  const video = videojs('my-video', defaultOptions);


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
        // return dur / player.playbackRate();
        return dur;
      },

      currentTime(ct) {
        // console.log('currentTime', ct);
        // return ct / player.playbackRate();
        return ct;
      },

      setCurrentTime(ct) {
        console.log('setCurrentTime', ct);
        // return ct * player.playbackRate();
        return ct;
      },

      buffered(bf) {
        console.log('buffered', bf);
        // return createNewRanges(bf, player.playbackRate());
        return bf;
      },

      seekable(seekable) {
        console.log('seekable', seekable);
        // return createNewRanges(seekable, player.playbackRate());
        return seekable;
      },

      played(played) {
        console.log('played', played);
        // return createNewRanges(played, player.playbackRate());
        return played;
      }

    };
  };

// +++ Register the middleware with the player +++
  videojs.use('*', playbackrateAdjuster);

  // video.ready(function(){
  //   // When the player is ready, get a reference to it
  //   const myPlayer = this;
  //   // +++ Define the playback rate options +++
  //   const options = {"playbackRates":[0.5, 1, 1.5, 2, 4]};
  //   // +++ Initialize the playback rate button +++
  //   myPlayer.controlBar.playbackRateMenuButton = myPlayer.controlBar.addChild('PlaybackRateMenuButton', {
  //     playbackRates: options.playbackRates
  //   });
  // });


  video.ready(function () {
    // TODO debug log
    console.log('currentSrc', this.currentSrc());
    console.log('currentType', this.currentType());
    console.log(this.el().dataset);

    let options = {};

    if (this.currentType() === 'video/youtube') {
      options = Object.assign(options, {
        techOrder: ['youtube'],
        forceSSL: true,
        forceHTML5: true,
        Origin: 'http://localhost:4000'
      });
    }

    this.options(options);
    this.play();

    // start timer
    timer.start();
    video.setInterval(function () {
      console.log('interval each 1 sec');

      timer.increseTime(this);

      // 최초에 자동재생 되지 않은 경우는 재생 하자!
      if(timer.opened < 2 && this.paused()) this.play();
    }, 1000);
  });

  video.on('ended', () => timer.increseTime(video, true));
})();


