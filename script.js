document.querySelectorAll('.project-square').forEach(square => {
    square.addEventListener('click', function() {
        const link = this.getAttribute('data-link');
        window.location.href = link;  // Redirect to project page
    });
});
