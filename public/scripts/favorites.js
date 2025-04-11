function toggleFavorite(button) {
   const id = button.dataset.id;

   const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

   const index = favorites.indexOf(id);

   if (index !== -1) {
      favorites.splice(index, 1);
      button.classList.remove("active");
   } else {
      favorites.push(id);
      button.classList.add("active");
   }

   localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Ao carregar a página, marcar os favoritos e adicionar os listeners
document.addEventListener("DOMContentLoaded", () => {
   const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

   document.querySelectorAll(".heart-button").forEach((button) => {
      const id = button.dataset.id;

      // Marca como ativo se for favorito
      if (favorites.includes(id)) {
         button.classList.add("active");
      }

      // Adiciona o event listener
      button.addEventListener("click", () => toggleFavorite(button));
   });
});
