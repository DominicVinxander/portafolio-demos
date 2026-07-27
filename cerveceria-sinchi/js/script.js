// Respaldo de imágenes: si una foto no carga (link roto, sin internet, etc.),
// se reemplaza por un fondo de color con un ícono, en vez de mostrar el ícono
// de "imagen rota" del navegador. Se define aquí arriba (bloqueante en <head>)
// para que ya exista cuando las imágenes empiecen a cargar.
function handleImgError(img) {
  var div = document.createElement('div');
  div.className = img.className;
  div.style.cssText = img.style.cssText;
  div.style.background = 'linear-gradient(135deg, #2a2118, #c17817)';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.style.color = '#f0e6d6';
  div.style.fontSize = '2.4rem';
  div.textContent = '🍺';
  if (img.parentNode) img.parentNode.replaceChild(div, img);
}

// Menú móvil: se ejecuta recién cuando el DOM ya está listo,
// así no importa que este script se cargue temprano en el <head>.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  var navCta = document.querySelector('.nav-cta');

  toggle.addEventListener('click', function () {
    var isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '68px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#1e1b17';
    navLinks.style.padding = '20px 24px';
    navLinks.style.gap = '20px';
    navCta.style.display = isOpen ? 'none' : 'inline-flex';
  });
});
