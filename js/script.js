// Confirms that the JavaScript file is connected correctly.
console.log("JavaScript conectado");

// Selects the mobile menu button.
const menuButton = document.querySelector(".menu-button");

// Selects the navigation links container.
const navLinks = document.querySelector(".nav-links");

// Selects the light/dark theme button.
const themeToggle = document.querySelector(".theme-toggle");

// Selects the contact form.
const contactForm = document.querySelector(".contact-form");

// Selects the message area below the contact form.
const formMessage = document.querySelector(".form-message");

// Selects all navigation links.
const navAnchors = document.querySelectorAll(".nav-link");

// Selects all sections that can become active while scrolling.
const focusableSections = document.querySelectorAll(".section-focusable");

// Selects all elements that should animate when they appear on screen.
const reveals = document.querySelectorAll(".reveal, .progress-item");

// Selects the hero background video.
const heroVideo = document.querySelector(".hero-video");

// Gets the saved theme from the browser local storage.
const savedTheme = localStorage.getItem("theme");

// Applies light mode if the user selected it before.
if (savedTheme === "light") {
  document.body.classList.add("light");
}

// Handles the light/dark theme toggle button.
themeToggle?.addEventListener("click", () => {
  // Adds or removes the light mode class.
  document.body.classList.toggle("light");

  // Checks if light mode is currently active.
  const isLight = document.body.classList.contains("light");

  // Saves the selected theme in the browser.
  localStorage.setItem("theme", isLight ? "light" : "dark");

  // Updates the button label for accessibility.
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Toggle dark mode" : "Toggle light mode",
  );
});

// Handles the mobile menu open/close button.
menuButton?.addEventListener("click", () => {
  // Opens or closes the navigation menu.
  const isOpen = navLinks.classList.toggle("is-open");

  // Prevents page scrolling while the mobile menu is open.
  document.body.classList.toggle("menu-open", isOpen);

  // Updates the menu state for accessibility.
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

// Closes the mobile navigation menu.
function closeMenu() {
  navLinks?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

// Observes elements and reveals them when they enter the screen.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Runs when the element becomes visible.
      if (entry.isIntersecting) {
        // Adds the animation visible class.
        entry.target.classList.add("is-visible");

        // Stops observing the element after the animation runs once.
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

// Activates the reveal observer for each animated element.
reveals.forEach((el) => observer.observe(el));

// Updates the active navigation link.
function setActiveLink(targetId) {
  navAnchors.forEach((link) => {
    // Checks if the link points to the current section.
    const active = link.getAttribute("href") === `#${targetId}`;

    // Adds or removes the active class.
    link.classList.toggle("active", active);
  });
}

// Adds a short flash animation to the selected section.
function flashSection(section) {
  // Stops the function if the section does not exist.
  if (!section) return;

  // Removes the animation class before restarting it.
  section.classList.remove("section-focus-flash");

  // Forces browser reflow so the animation restarts every click.
  void section.offsetWidth;

  // Adds the animation class again.
  section.classList.add("section-focus-flash");
}

// Handles clicks on navigation links.
navAnchors.forEach((link) => {
  link.addEventListener("click", (event) => {
    // Gets the href value from the clicked link.
    const href = link.getAttribute("href");

    // Stops if the link is not an internal section link.
    if (!href || !href.startsWith("#")) return;

    // Finds the target section.
    const target = document.querySelector(href);

    // Stops if the section does not exist.
    if (!target) return;

    // Prevents the default instant jump.
    event.preventDefault();

    // Closes the mobile menu after clicking.
    closeMenu();

    // Smoothly scrolls to the selected section.
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Updates the active navigation link.
    setActiveLink(target.id);

    // Plays the section focus animation after scrolling starts.
    setTimeout(() => flashSection(target), 280);
  });
});

// Observes sections to update the active nav link while scrolling.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Runs when a section becomes visible enough.
      if (entry.isIntersecting) {
        // Sets the matching nav link as active.
        setActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.45 },
);

// Activates the section observer for each page section.
focusableSections.forEach((section) => sectionObserver.observe(section));

// Handles the contact form submission.
contactForm?.addEventListener("submit", (event) => {
  // Prevents the form from reloading the page.
  event.preventDefault();

  // Reads the form data.
  const formData = new FormData(contactForm);

  // Gets the user's name from the form.
  const name = formData.get("name")?.toString().trim();

  // Shows a local confirmation message.
  formMessage.textContent = name
    ? `Thank you, ${name}. This form is local only and does not send data yet.`
    : "Thank you. This form is local only and does not send data yet.";

  // Plays the contact section flash animation.
  flashSection(document.querySelector("#contact"));

  // Clears the form fields.
  contactForm.reset();
});

// Closes the mobile menu when the Escape key is pressed.
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Selects all elements with magnetic hover motion.
const magneticItems = document.querySelectorAll(".magnetic");

// Adds magnetic mouse movement to buttons and cards.
magneticItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    // Gets the element position and size.
    const rect = item.getBoundingClientRect();

    // Calculates the mouse distance from the center.
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    // Moves the element slightly toward the mouse.
    item.style.transform = `translate(${offsetX * 0.05}px, ${
      offsetY * 0.05
    }px)`;
  });

  // Resets the element position when the mouse leaves.
  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

// Shows a warning if the local hero video cannot load.
heroVideo?.addEventListener("error", () => {
  console.warn(
    "Local video could not be loaded. Please verify assets/videos/home-video.mp4",
  );
});
