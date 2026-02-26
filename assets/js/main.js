
// Auto year
document.querySelectorAll('[data-year]').forEach(el=>{
  el.textContent = new Date().getFullYear();
});

// AUTO CLOSE NAV DROPDOWN (stable version)
document.addEventListener("DOMContentLoaded", function(){

  const dropdowns = document.querySelectorAll(".navDrop");

  dropdowns.forEach(drop => {

    drop.addEventListener("click", function(e){
      e.stopPropagation();

      dropdowns.forEach(other => {
        if(other !== drop){
          other.removeAttribute("open");
        }
      });

    });

  });

  document.addEventListener("click", function(){
    dropdowns.forEach(drop => drop.removeAttribute("open"));
  });

  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      dropdowns.forEach(drop => drop.removeAttribute("open"));
    }
  });

});
