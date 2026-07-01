document.addEventListener('click', function (e) {
  const ripple = document.createElement('span');

  ripple.className = 'ripple-effect';
  document.body.appendChild(ripple);

  const size = 80;
  ripple.style.width = ripple.style.height = size + 'px';

  ripple.style.left = e.clientX - size / 2 + 'px';
  ripple.style.top = e.clientY - size / 2 + 'px';

  setTimeout(() => {
    ripple.remove();
  }, 600);
});