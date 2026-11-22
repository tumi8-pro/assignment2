function searchDestinations() {

    let input = document.getElementById("searchInput").value.toLowerCase();

    let cards = document.getElementsByClassName("destination-card");

    let found = false;

    for (let i = 0; i < cards.length; i++) {

        let name = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

        if (name.includes(input)) {
            cards[i].style.display = "block";
            found = true;
        } 
        else {
            cards[i].style.display = "none";
        }
    }

    document.getElementById("noResults").style.display = found ? "none" : "block";
}
function searchGallery() {

    let input = document.getElementById("search").value.toLowerCase();

    let photos = document.getElementsByClassName("photo");

    for (let i = 0; i < photos.length; i++) {

        let name = photos[i].getElementsByTagName("h3")[0].innerText.toLowerCase();

        if (name.includes(input)) {

            photos[i].style.display = "";

        } else {

            photos[i].style.display = "none";

        }

    }

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Your message has been submitted successfully!");

    this.reset();
});

document.getElementById("contactForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("contactName").value;

    document.getElementById("contactResult").innerHTML =
    "Thank you, " + name + "! Your message has been received.";

    this.reset();

});


<script>
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    const msgBox = document.getElementById('contactMsg');

    msgBox.textContent = ` Thank you ${name}! Your message has been sent successfully.`;
    msgBox.style.display = 'block';

    this.reset();

    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 5000);
});

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const name = document.getElementById('bookName').value;
    const destination = document.getElementById('bookDestination').value;
    const date = document.getElementById('bookDate').value;
    const guests = document.getElementById('bookGuests').value;
    const msgBox = document.getElementById('bookingMsg');

    msgBox.innerHTML = 
        `✅ Thank you ${name}!<br>
        Your booking for <strong>${destination}</strong> on <strong>${date}</strong> 
        for <strong>${guests}</strong> guest(s) has been received.`;
    msgBox.style.display = 'block';

    this.reset();

    setTimeout(() => {
        msgBox.style.display = 'none';
    }, 6000);
});
</script>
// ===== DARK MODE TOGGLE =====
const darkModeBtn = document.getElementById('darkModeBtn');
const body = document.body;

if(localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeBtn.textContent = '☀️ Light Mode';
}

darkModeBtn.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    
    if(body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = '☀️ Light Mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        darkModeBtn.textContent = '🌙 Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
    }
});