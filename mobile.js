let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if(!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }
        
      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });
    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
    // Add this to your mobile.js (at the beginning or end)

  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

document.addEventListener('DOMContentLoaded', function() {
  const song = document.getElementById('birthdaySong');
  if (!song) {
    console.error("Audio element not found");
    return;
  }

  // Lower volume for mobile
  song.volume = 0.4;
  
  // Create more visible mobile music controls
  const musicControls = document.createElement('div');
  musicControls.innerHTML = `
    <div id="musicToggle" style="
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 60px;
      height: 60px;
      background: rgba(255,215,0,0.8);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      user-select: none;
    ">🔇</div>
    <div id="musicHint" style="
      position: fixed;
      bottom: 90px;
      right: 20px;
      background: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      display: none;
    ">Tap to play music!</div>
  `;
  
  document.body.appendChild(musicControls);
  const musicToggle = document.getElementById('musicToggle');
  const musicHint = document.getElementById('musicHint');

  // Show hint for 3 seconds on load
  setTimeout(() => {
    musicHint.style.display = 'block';
    setTimeout(() => {
      musicHint.style.display = 'none';
    }, 3000);
  }, 1000);

  // Handle both touch and click
  const toggleMusic = () => {
    if (song.paused) {
      song.play()
        .then(() => {
          musicToggle.textContent = '🔊';
          musicHint.textContent = 'Music on!';
        })
        .catch(e => {
          musicHint.textContent = 'Failed to play 😢';
          console.error('Playback failed:', e);
        });
    } else {
      song.pause();
      musicToggle.textContent = '🔇';
      musicHint.textContent = 'Music off';
    }
    
    musicHint.style.display = 'block';
    setTimeout(() => {
      musicHint.style.display = 'none';
    }, 2000);
  };

  musicToggle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    toggleMusic();
  });

  musicToggle.addEventListener('click', toggleMusic);

  // Try to autoplay after any touch on screen
  const tryAutoplay = () => {
    song.play()
      .then(() => {
        musicToggle.textContent = '🔊';
      })
      .catch(e => {
        console.log('Autoplay blocked - waiting for user interaction');
      });
    
    // Remove these listeners after first try
    document.body.removeEventListener('touchstart', tryAutoplay);
    document.body.removeEventListener('click', tryAutoplay);
  };

  // Set up autoplay attempt
  document.body.addEventListener('touchstart', tryAutoplay, {once: true});
  document.body.addEventListener('click', tryAutoplay, {once: true});
});