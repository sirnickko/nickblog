const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const portrait = document.querySelector(".portrait-photo");
const portraitPlaceholder = document.querySelector(".portrait-placeholder");
const projectTrack = document.querySelector("#project-track");
const projectStatus = document.querySelector("#project-status");
const projectDots = document.querySelector("#project-dots");
const carouselButtons = document.querySelectorAll(".carousel-button");

if (portrait && portraitPlaceholder) {
  const showPortrait = () => {
    portrait.hidden = false;
    portraitPlaceholder.hidden = true;
  };

  portrait.addEventListener("load", showPortrait);

  if (portrait.complete && portrait.naturalWidth > 0) {
    showPortrait();
  }
}

if (projectTrack && projectStatus && projectDots && carouselButtons.length > 0) {
  const projectCards = Array.from(projectTrack.querySelectorAll(".project-card"));
  let activeProject = 0;
  let pointerStart = null;

  const moveProject = (direction) => {
    activeProject = (activeProject + direction + projectCards.length) % projectCards.length;
    updateCarousel();
  };

  const updateCarousel = () => {
    if (projectCards.length === 0) {
      return;
    }

    projectCards.forEach((card, index) => {
      const position = (index - activeProject + projectCards.length) % projectCards.length;
      const stackPosition =
        position === 0 ? "active" : position === 1 ? "second" : position === 2 ? "third" : "hidden";
      card.dataset.stackPosition = stackPosition;
      card.inert = position !== 0;
    });

    const activeTitle = projectCards[activeProject].querySelector("h3")?.textContent?.trim();
    projectStatus.textContent =
      `Project ${activeProject + 1} of ${projectCards.length} — ${activeTitle ?? "Selected project"}`;
    Array.from(projectDots.children).forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === activeProject));
    });
  };

  projectCards.forEach((card, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project ${index + 1}: ${card.querySelector("h3")?.textContent?.trim() ?? "Project"}`);
    dot.addEventListener("click", () => {
      activeProject = index;
      updateCarousel();
    });
    projectDots.append(dot);
  });

  carouselButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.direction === "next" ? 1 : -1;
      moveProject(direction);
    });
  });

  projectTrack.addEventListener("keydown", (event) => {
    if (event.target !== projectTrack) {
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveProject(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveProject(-1);
    }
  });

  projectTrack.addEventListener("pointerdown", (event) => {
    if (event.isPrimary) {
      pointerStart = { x: event.clientX, y: event.clientY };
    }
  });

  projectTrack.addEventListener("pointerup", (event) => {
    if (!pointerStart || !event.isPrimary) {
      return;
    }

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      moveProject(deltaX < 0 ? 1 : -1);
    }
  });

  projectTrack.addEventListener("pointercancel", () => {
    pointerStart = null;
  });

  updateCarousel();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navLinks.classList.toggle("is-open", !isExpanded);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });
}

if (year) {
  year.textContent = String(new Date().getFullYear());
}
