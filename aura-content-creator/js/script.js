// Respaldo de imágenes rotas (igual que en los otros demos)
function handleImgError(img) {
  var div = document.createElement('div');
  div.className = img.className;
  div.style.cssText = img.style.cssText;
  div.style.background = 'linear-gradient(135deg, #ffe8e3, #a89bff)';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.style.color = '#1c1a17';
  div.style.fontSize = '2.2rem';
  div.textContent = '✦';
  if (img.parentNode) img.parentNode.replaceChild(div, img);
}

document.addEventListener('DOMContentLoaded', function () {

  /* --- Menú móvil --- */
  var toggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  var navCta = document.querySelector('.nav-cta');
  toggle.addEventListener('click', function () {
    var isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '64px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#faf8f4';
    navLinks.style.padding = '20px 24px';
    navLinks.style.gap = '18px';
    navLinks.style.borderBottom = '1px solid rgba(28,26,23,0.08)';
    navCta.style.display = isOpen ? 'none' : 'inline-flex';
  });

  /* --- Header: línea sutil al hacer scroll --- */
  var header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  /* --- Scroll reveal suave --- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* --- Efecto de "seguimiento" sutil en los blobs decorativos del hero --- */
  var blobs = document.querySelectorAll('.blob');
  document.addEventListener('mousemove', function (e) {
    var x = (e.clientX / window.innerWidth - 0.5) * 30;
    var y = (e.clientY / window.innerHeight - 0.5) * 30;
    blobs.forEach(function (blob, i) {
      var factor = i === 0 ? 1 : -1;
      blob.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
    });
  });

});
