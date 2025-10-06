document.querySelectorAll('.project-square').forEach(square => {
    square.addEventListener('click', function() {
        const link = this.getAttribute('data-link');
        window.location.href = link;  // Redirect to project page
    });
});

<script>
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
</script>
