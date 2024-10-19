
function toggleVideo(button) {
    const videoContainer = button.closest('.tracking-video-container');
    const video = videoContainer.querySelector('video');
    const currentSrc = video.src;
    const isTracked = currentSrc.includes('_tracked');

    if (isTracked) {
        video.src = currentSrc.replace('_tracked', '');
        button.textContent = 'Show Tracking';
    } else {
        // Assuming the tracked version has '_tracked' before the file extension
        video.src = currentSrc.replace('.mp4', '_tracked.mp4');
        button.textContent = 'Hide Tracking';
    }

    // Restart the video from the beginning
    video.currentTime = 0;
    video.play();
}


let trackingVisible = false;

function toggleAllVideos() {
    const videos = document.querySelectorAll('.tracking-video-container video');
    const globalToggleBtn = document.getElementById('globalToggleBtn');
    trackingVisible = !trackingVisible;
    videos.forEach(video => {
        const currentSrc = video.src;
        if (trackingVisible) {
            video.src = currentSrc.replace('.mp4', '_tracked.mp4');
        } else {
            video.src = currentSrc.replace('_tracked.mp4', '.mp4');
        }
        video.currentTime = 0;
        video.play();
    });

    globalToggleBtn.textContent = trackingVisible ? 'Hide All Tracking' : 'Show All Tracking';
}

marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(lang, code).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    },
    langPrefix: 'hljs language-'
});

function toggleText(btn, textFile) {
    const videoRow = btn.closest('.video-row');
    const textContent = videoRow.querySelector('.text-content');
    const allButtons = videoRow.querySelectorAll('.toggle-btn');

    if (btn.classList.contains('active')) {
        // Clicking the active button, so hide the text
        textContent.style.display = 'none';
        btn.classList.remove('active');
        btn.textContent = 'Show Response';
    } else {
        // New button clicked, load and show the text
        fetch(textFile)
            .then(response => response.text())
            .then(text => {
                // textContent.textContent = text;
                textContent.innerHTML = marked.parse(text);
                textContent.style.display = 'block';

                allButtons.forEach(button => {
                    button.classList.remove('active');
                    button.textContent = 'Show Response';
                });

                btn.classList.add('active');
                btn.textContent = 'Hide Response';
                textContent.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            })
            .catch(error => {
                console.error("Error fetching text file:", error);
                textContent.textContent = "Error loading text content.";
                textContent.style.display = 'block';
            });
    }
}

// Select all video elements
const videos = document.querySelectorAll('video');

// Options for the Intersection Observer
const options = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 0.8 // Trigger when 10% of the video is visible
};

// Callback function to handle intersection changes
const handleIntersection = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const video = entry.target;
      video.play();
    } else {
      const video = entry.target;
      video.pause();
    }
  });
};

// Create an Intersection Observer
const observer = new IntersectionObserver(handleIntersection, options);

// Observe each video
videos.forEach(video => {
  observer.observe(video);

  video.preload = 'metadata';

});