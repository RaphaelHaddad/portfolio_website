// triangles.js

document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.querySelector('.wrap');
    const total = 200;
    const time = 10; // Animation duration in seconds
  
    for (let i = 0; i < total; i++) {
      const tri = document.createElement('div');
      tri.classList.add('tri');
      
      // Random properties
      const size = Math.random() * 50 + 'px';
      const rotateStart = Math.random() * 360 + 'deg';
      const rotateEnd = (parseFloat(rotateStart) * 1.5) % 360 + 'deg';
      const translateX = (Math.random() * 1000 - 500) + 'px';
      const translateY = (Math.random() * 1000 - 500) + 'px';
      const color = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
      const delay = (Math.random() * time) * -1 + 's';
  
      // Assign CSS variables
      tri.style.setProperty('--rotate-start', rotateStart);
      tri.style.setProperty('--rotate-end', rotateEnd);
      tri.style.setProperty('--translateX', translateX);
      tri.style.setProperty('--translateY', translateY);
      tri.style.setProperty('--i', i);
      tri.style.setProperty('--delay', delay);
      
      // Set border size and color
      tri.style.borderTopWidth = size;
      tri.style.borderRightWidth = size;
      tri.style.borderLeftWidth = size;
      tri.style.borderTopColor = color;
  
      wrap.appendChild(tri);
    }
  });