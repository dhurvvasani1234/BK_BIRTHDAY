let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
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
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    })

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      if(e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
    // Music player functionality
document.addEventListener('DOMContentLoaded', function() {
  const song = document.getElementById('birthdaySong');
  song.volume = 0.8; // Lower volume to 80%
  
  // Create a music toggle button
  const musicToggle = document.createElement('div');
  musicToggle.innerHTML = '🎵';
  musicToggle.style.position = 'fixed';
  musicToggle.style.bottom = '20px';
  musicToggle.style.right = '20px';
  musicToggle.style.fontSize = '30px';
  musicToggle.style.cursor = 'pointer';
  musicToggle.style.zIndex = '1000';
  
  document.body.appendChild(musicToggle);
  
  // Toggle music on click
  musicToggle.addEventListener('click', function() {
    if (song.paused) {
      song.play();
      musicToggle.innerHTML = '🔊';
    } else {
      song.pause();
      musicToggle.innerHTML = '🎵';
    }
  });
  
  // Try to autoplay (with user gesture fallback)
  document.body.addEventListener('click', function firstInteraction() {
    const playPromise = song.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay prevented - show instruction
        musicToggle.style.backgroundColor = 'gold';
        musicToggle.style.borderRadius = '50%';
        musicToggle.style.width = '40px';
        musicToggle.style.height = '40px';
        musicToggle.style.display = 'flex';
        musicToggle.style.justifyContent = 'center';
        musicToggle.style.alignItems = 'center';
      });
    }
    
    // Remove this listener after first interaction
    document.body.removeEventListener('click', firstInteraction);
  });
});
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});