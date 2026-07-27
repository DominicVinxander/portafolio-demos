document.addEventListener('DOMContentLoaded', function () {

  /* --- Glow que sigue el cursor --- */
  var glow = document.querySelector('.cursor-glow');
  if (glow) {
    document.addEventListener('mousemove', function (e) {
      glow.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%,-50%)';
    });
  }

  /* --- Header cambia de fondo al hacer scroll --- */
  var header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  /* --- Palabras del titular aparecen una por una al cargar --- */
  var titleWords = document.querySelectorAll('.hero h1 .word');
  titleWords.forEach(function (word, i) {
    word.style.animationDelay = (i * 0.09) + 's';
  });

  /* --- Scroll reveal --- */
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

  /* --- Contadores animados --- */
  var counters = document.querySelectorAll('.stat-num');
  var animated = false;
  function animateCounters() {
    if (animated) return;
    animated = true;
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = el.getAttribute('data-decimals') === '1' ? 1 : 0;
      var duration = 1300;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var current = target * progress;
        el.textContent = current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    });
  }
  var statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(statsBar);
  }

  /* --- Efecto de inclinación 3D en las tarjetas de proyectos --- */
  document.querySelectorAll('.tilt-card').forEach(function (wrapper) {
    var card = wrapper.querySelector('.card');
    wrapper.addEventListener('mousemove', function (e) {
      var rect = wrapper.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
    });
    wrapper.addEventListener('mouseleave', function () {
      card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });

});
