const host = window.location.host;
const overlayCheckInterval = setInterval(checkForEmbeds, 3000);

self.port.on('detach', function() {
  clearInterval(overlayCheckInterval);
  Array.from(document.querySelectorAll('.minvid__overlay__wrapper'))
       .forEach(removeOverlay);
});

function removeOverlay(el) {
  el.classList.remove('minvid__overlay__wrapper');
  const containerEl = el.querySelector('.minvid__overlay__container');
  if (containerEl) containerEl.remove();
}

function checkForEmbeds() {
  ytEmbedChecks();
  vimeoEmbedChecks();
  twitchEmbedChecks();
}

function ytEmbedChecks() {
  if (!(host.indexOf('youtube.com') > -1)) return;

  // YouTube Home Page
  const ytHomeContainers = Array.from(document.querySelectorAll('#feed .yt-lockup-thumbnail'));
  if (ytHomeContainers.length) {
    sendMetric('available');
    ytHomeContainers.forEach(ytHomePageHandler);
  }

  const ytSearchContainers = Array.from(document.querySelectorAll('#results .yt-lockup-thumbnail'));
  if (ytSearchContainers.length) {
    sendMetric('available');
    ytSearchContainers.forEach(ytHomePageHandler);
  }

  // YouTube Watch Page
  const ytWatchContainer = document.querySelector('.html5-video-player');
  if (ytWatchContainer) {
    sendMetric('available');
    ytWatchElementHandler(ytWatchContainer);
  }

  // YouTube Watch Page related videos
  const ytRelatedContainers = Array.from(document.querySelectorAll('.watch-sidebar-section .thumb-wrapper'));
  if (ytRelatedContainers.length) {
    sendMetric('available');
    ytRelatedContainers.forEach(ytHomePageHandler);
  }

  // YouTube Channel Page videos featured section
  const ytChannelFeaturedContainers = Array.from(document.querySelectorAll('#browse-items-primary .lohp-thumb-wrap'));
  if (ytChannelFeaturedContainers.length) {
    sendMetric('available');
    ytChannelFeaturedContainers.forEach(ytHomePageHandler);
  }

  // YouTube Channel Page videos uploads section
  const ytChannelUploadsContainers = Array.from(document.querySelectorAll('#browse-items-primary .yt-lockup-thumbnail'));
  if (ytChannelUploadsContainers.length) {
    sendMetric('available');
    ytChannelUploadsContainers.forEach(ytHomePageHandler);
  }
}

function ytHomePageHandler(el) {
  if (el.classList.contains('minvid__overlay__wrapper')) return;

  el.classList.add('minvid__overlay__wrapper');
  const tmp = getTemplate();
  tmp.addEventListener('click', function(ev) {
    evNoop(ev);
    const urlEl = el.querySelector('.yt-uix-sessionlink');
    if (urlEl && urlEl.getAttribute('href')) {
      self.port.emit('launch', {
        url: 'https://youtube.com' + urlEl.getAttribute('href'),
        domain: 'youtube.com'
      });
    } else console.error('Error parsing url from YT home page', el); // eslint-disable-line no-console
  });
  el.appendChild(tmp);
}

function ytWatchElementHandler(el) {
  if (el.classList.contains('minvid__overlay__wrapper')) return;

  el.classList.add('minvid__overlay__wrapper');
  const tmp = getTemplate();
  tmp.addEventListener('click', function(ev) {
    evNoop(ev);
    const videoEl = document.querySelector('video');
    videoEl.pause();
    closeFullscreen();
    self.port.emit('launch', {
      url: window.location.href,
      domain: 'youtube.com',
      time: videoEl.currentTime
    });
  });
  el.appendChild(tmp);
}

function vimeoEmbedChecks() {
  if (!(host.indexOf('vimeo.com') > -1)) return;

  // VIMEO LOGGED-OUT HOME PAGE
  const vimeoDefaultHomeContainers = Array.from(document.querySelectorAll('.iris_video-vital__overlay'));
  if (vimeoDefaultHomeContainers.length) {
    vimeoDefaultHomeContainers.forEach(el => {
      if (el.classList.contains('minvid__overlay__wrapper')) return;

      el.classList.add('minvid__overlay__wrapper');
      const tmp = getTemplate();
      tmp.addEventListener('click', function(ev) {
        evNoop(ev);
        self.port.emit('launch', {
          url: 'https://vimeo.com' + el.getAttribute('href'),
          domain: 'vimeo.com'
        });
      });
      el.appendChild(tmp);
    });
    sendMetric('available');
  }

  // VIMEO LOGGED-IN HOME PAGE
  const vimeoHomeContainers = Array.from(document.querySelectorAll('.player_wrapper'));
  if (vimeoHomeContainers.length) {
    vimeoHomeContainers.forEach(el => {
      if (el.classList.contains('minvid__overlay__wrapper')) return;

      el.classList.add('minvid__overlay__wrapper');
      const tmp = getTemplate();
      tmp.addEventListener('click', function(ev) {
        evNoop(ev);
        const fauxEl = el.querySelector('.faux_player');
        if (fauxEl) {
          self.port.emit('launch', {
            url: 'https://vimeo.com/' + fauxEl.getAttribute('data-clip-id'),
            domain: 'vimeo.com'
          });
        } else console.error('Error: failed to locate vimeo url'); // eslint-disable-line no-console
      });
      el.appendChild(tmp);
    });
    sendMetric('available');
  }

  // VIMEO DETAIL PAGE
  const vimeoDetailContainer = document.querySelector('.player_container');
  if (vimeoDetailContainer) {
    if (vimeoDetailContainer.classList.contains('minvid__overlay__wrapper')) return;
    vimeoDetailContainer.classList.add('minvid__overlay__wrapper');
    const tmp = getTemplate();
    tmp.addEventListener('mouseup', evNoop);
    tmp.addEventListener('click', function(ev) {
      evNoop(ev);
      self.port.emit('launch', {
        url: window.location.href,
        domain: 'vimeo.com'
      });
    }, true);
    vimeoDetailContainer.appendChild(tmp);
    sendMetric('available');
  }
}

function twitchEmbedChecks() {
  if (!(host.indexOf('twitch.tv') > -1)) return;

  // YouTube Home Page
  const twitchChannelContainers = Array.from(document.querySelectorAll('.player'));
  if (twitchChannelContainers.length) {
    sendMetric('available');
    twitchChannelContainers.forEach(twitchChannelPageHandler);
  }

  // const ytSearchContainers = Array.from(document.querySelectorAll('#results .yt-lockup-thumbnail'));
  // if (ytSearchContainers.length) {
  //   sendMetric('available');
  //   ytSearchContainers.forEach(ytHomePageHandler);
  // }

  // // YouTube Watch Page
  // const ytWatchContainer = document.querySelector('.html5-video-player');
  // if (ytWatchContainer) {
  //   sendMetric('available');
  //   ytWatchElementHandler(ytWatchContainer);
  // }

  // // YouTube Watch Page related videos
  // const ytRelatedContainers = Array.from(document.querySelectorAll('.watch-sidebar-section .thumb-wrapper'));
  // if (ytRelatedContainers.length) {
  //   sendMetric('available');
  //   ytRelatedContainers.forEach(ytHomePageHandler);
  // }

  // // YouTube Channel Page videos featured section
  // const ytChannelFeaturedContainers = Array.from(document.querySelectorAll('#browse-items-primary .lohp-thumb-wrap'));
  // if (ytChannelFeaturedContainers.length) {
  //   sendMetric('available');
  //   ytChannelFeaturedContainers.forEach(ytHomePageHandler);
  // }

  // // YouTube Channel Page videos uploads section
  // const ytChannelUploadsContainers = Array.from(document.querySelectorAll('#browse-items-primary .yt-lockup-thumbnail'));
  // if (ytChannelUploadsContainers.length) {
  //   sendMetric('available');
  //   ytChannelUploadsContainers.forEach(ytHomePageHandler);
  // }
}

function twitchChannelPageHandler(el) {
  if (el.classList.contains('minvid__overlay__wrapper')) return;

  el.classList.add('minvid__overlay__wrapper');
  const tmp = getTemplate();
  tmp.addEventListener('click', function(ev) {
    evNoop(ev);
    if (el.getAttribute('data-channel')) {
      self.port.emit('launch', {
        url: 'https://player.twitch.tv/' + el.getAttribute('data-channel'),
        domain: 'twitch.tv'
      });
    } else console.error('Error parsing url from Twitch channel page', el); // eslint-disable-line no-console
  });
  el.appendChild(tmp);
}

// General Helpers
function getTemplate() {
  const containerEl = document.createElement('div');
  const iconEl = document.createElement('div');

  containerEl.className = 'minvid__overlay__container';
  iconEl.className = 'minvid__overlay__icon';

  containerEl.appendChild(iconEl);
  return containerEl;
}

function sendMetric(method) {
  self.port.emit('metric', {
    object: 'overlay_icon',
    method: method
  });
}

function evNoop(ev) {
  ev.preventDefault();
  ev.stopImmediatePropagation();
}

function closeFullscreen() {
  if (document.mozFullScreenEnabled) {
    document.mozCancelFullScreen();
  }
}
