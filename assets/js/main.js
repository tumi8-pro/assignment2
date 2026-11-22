// Wait until the page is ready before adding the interactive features.
document.addEventListener("DOMContentLoaded", function () {
  // Put the current year in the footer.
  const yearSpans = document.querySelectorAll("[data-year]");
  yearSpans.forEach(function (span) {
    span.textContent = new Date().getFullYear();
  });

  // Turn dark mode on or off and remember the choice.
  const themeButtons = document.querySelectorAll(".theme-toggle");

  function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeButtons.forEach(function (button) {
      if (isDark) {
        button.setAttribute("aria-label", "Switch to light mode");
        button.textContent = "Light mode";
      } else {
        button.setAttribute("aria-label", "Switch to dark mode");
        button.textContent = "Dark mode";
      }
    });
  }

  setTheme(localStorage.getItem("lesotho-theme") === "dark");

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const isDark = document.body.classList.contains("dark-mode");
      setTheme(!isDark);
      localStorage.setItem("lesotho-theme", isDark ? "light" : "dark");
    });
  });

  // Search and filter the destination cards.
  const destinationCards = document.querySelectorAll(".destination-item");
  const searchBox = document.querySelector("#place-search");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const emptyMessage = document.querySelector(".empty-state");
  let selectedCategory = "all";

  function showDestinations() {
    let visibleCount = 0;
    const searchText = searchBox ? searchBox.value.toLowerCase().trim() : "";

    destinationCards.forEach(function (card) {
      const categoryMatches = selectedCategory === "all" ||
        card.dataset.category === selectedCategory;
      const textMatches = card.textContent.toLowerCase().includes(searchText);
      const shouldShow = categoryMatches && textMatches;

      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleCount++;
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedCategory = button.dataset.filter;

      filterButtons.forEach(function (otherButton) {
        otherButton.classList.remove("active");
      });
      button.classList.add("active");
      showDestinations();
    });
  });

  if (searchBox) {
    searchBox.addEventListener("input", showDestinations);
  }

  // Open a larger gallery photo and let the visitor move between photos.
  const galleryTiles = document.querySelectorAll(".gallery-tile");
  const lightbox = document.querySelector("#lightbox");

  if (galleryTiles.length > 0 && lightbox && window.bootstrap) {
    const lightboxWindow = new bootstrap.Modal(lightbox);
    const largeImage = document.querySelector("#lightboxImage");
    const imageCaption = document.querySelector("#lightboxCaption");
    let currentPhoto = 0;

    function showPhoto(number) {
      // The percent sign keeps the number inside the list of photos.
      currentPhoto = (number + galleryTiles.length) % galleryTiles.length;
      largeImage.src = galleryTiles[currentPhoto].dataset.full;
      largeImage.alt = galleryTiles[currentPhoto].querySelector("img").alt;
      imageCaption.textContent = galleryTiles[currentPhoto].dataset.caption;
    }

    galleryTiles.forEach(function (tile, index) {
      tile.addEventListener("click", function () {
        showPhoto(index);
        lightboxWindow.show();
      });
    });

    document.querySelector(".lightbox-arrow.prev").addEventListener("click", function () {
      showPhoto(currentPhoto - 1);
    });

    document.querySelector(".lightbox-arrow.next").addEventListener("click", function () {
      showPhoto(currentPhoto + 1);
    });
  }

  // Keep names to letters and spaces, and phone numbers to digits.
  const nameFields = document.querySelectorAll("#book-name, #contact-name");
  nameFields.forEach(function (field) {
    field.addEventListener("input", function () {
      field.value = field.value.replace(/[^A-Za-z ]/g, "");
      field.setCustomValidity("");
    });
  });

  const phoneField = document.querySelector("#book-phone");
  if (phoneField) {
    phoneField.addEventListener("input", function () {
      phoneField.value = phoneField.value.replace(/[^0-9]/g, "");
    });
  }

  // Switch between the trip enquiry form and the contact form.
  const formTabs = document.querySelectorAll("[data-form-target]");
  const enquiryForms = document.querySelectorAll(".inquiry-form");

  formTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      formTabs.forEach(function (otherTab) {
        otherTab.classList.remove("active");
        otherTab.setAttribute("aria-selected", "false");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      enquiryForms.forEach(function (form) {
        form.hidden = form.id !== tab.dataset.formTarget;
      });
    });
  });

  // Check each form and save a successful enquiry in this browser.
  enquiryForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let formIsValid = true;
      const fields = form.querySelectorAll("input, textarea, select");

      fields.forEach(function (field) {
        field.classList.remove("is-invalid");
        if (!field.checkValidity()) {
          field.classList.add("is-invalid");
          formIsValid = false;
        }
      });

      const statusMessage = form.querySelector(".form-status");
      if (!formIsValid) {
        statusMessage.textContent = "Please check the highlighted fields.";
        statusMessage.classList.add("error");
        form.querySelector(":invalid").focus();
        return;
      }

      const formData = {};
      fields.forEach(function (field) {
        if (field.name) {
          formData[field.name] = field.value;
        }
      });

      let savedForms = JSON.parse(localStorage.getItem("lesotho-submissions") || "[]");
      savedForms.push(formData);
      localStorage.setItem("lesotho-submissions", JSON.stringify(savedForms));

      statusMessage.textContent = "Thank you. Your details have been saved in this browser.";
      statusMessage.classList.remove("error");
      form.reset();
    });
  });

  // Check the newsletter email and save it on this device.
  const newsletterForm = document.querySelector("[data-newsletter]");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailField = newsletterForm.querySelector("input[type=email]");
      const message = newsletterForm.querySelector(".form-feedback");

      if (!emailField.checkValidity()) {
        message.textContent = "Please enter a valid email address.";
        emailField.focus();
        return;
      }

      localStorage.setItem("lesotho-newsletter", emailField.value);
      message.textContent = "Thank you for signing up.";
      newsletterForm.reset();
    });
  }
});

