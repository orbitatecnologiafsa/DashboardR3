document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
      // Remover classe 'active' de todas as abas
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

      // Adicionar classe 'active' para a aba clicada
      this.classList.add('active');

      // Esconder todo o conteúdo das abas
      document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');

      // Mostrar o conteúdo da aba clicada
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`tab-${tabId}`).style.display = 'block';
  });
});
