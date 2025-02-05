// Quote data structure with categories
const quotes = {
  motivation: [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs",
    },
  ],
  wisdom: [
    {
      text: "The only true wisdom is in knowing you know nothing.",
      author: "Socrates",
    },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
    {
      text: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
    },
    { text: "What you think, you become.", author: "Buddha" },
    { text: "The unexamined life is not worth living.", author: "Socrates" },
  ],
  love: [
    {
      text: "Love all, trust a few, do wrong to none.",
      author: "William Shakespeare",
    },
    {
      text: "The best thing to hold onto in life is each other.",
      author: "Audrey Hepburn",
    },
    { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
    {
      text: "To love and be loved is to feel the sun from both sides.",
      author: "David Viscott",
    },
    {
      text: "Love is composed of a single soul inhabiting two bodies.",
      author: "Aristotle",
    },
  ],
  success: [
    {
      text: "Success is not final, failure is not fatal.",
      author: "Winston Churchill",
    },
    {
      text: "Success usually comes to those who are too busy to be looking for it.",
      author: "Henry David Thoreau",
    },
    {
      text: "The road to success and the road to failure are almost exactly the same.",
      author: "Colin R. Davis",
    },
    {
      text: "Success is walking from failure to failure with no loss of enthusiasm.",
      author: "Winston Churchill",
    },
    {
      text: "The secret of success is to do the common thing uncommonly well.",
      author: "John D. Rockefeller Jr.",
    },
  ],
};

// DOM Elements
const quoteContent = document.getElementById("quote-content");
const authorElement = document.querySelector(".author");
const generateBtn = document.getElementById("generate");
const saveBtn = document.getElementById("save");
const shareBtn = document.getElementById("share");
const categoryItems = document.querySelectorAll(
  ".side-bar-component li[data-category]"
);
const toast = document.getElementById("toast");
const mobileMenuBtn = document.querySelector(".mobile-menu");
const sidebarNav = document.querySelector("aside");
const navOptions = document.querySelector(".options");
const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll("[data-page]");
const savedQuotesList = document.getElementById("saved-quotes-list");

// Current category
let currentCategory = "motivation";

// Functions
function getRandomQuote(category) {
  const categoryQuotes = quotes[category];
  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
}

function updateQuote(category) {
  const { text, author } = getRandomQuote(category);
  quoteContent.textContent = text;
  authorElement.textContent = `- ${author}`;

  quoteContent.style.opacity = 0;
  authorElement.style.opacity = 0;

  setTimeout(() => {
    quoteContent.style.opacity = 1;
    authorElement.style.opacity = 1;
  }, 50);
}

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 3000);
}

function showPage(pageId) {
  pages.forEach((page) => page.classList.remove("active"));
  navItems.forEach((item) => item.classList.remove("active"));

  document.getElementById(`${pageId}-page`).classList.add("active");
  document
    .querySelectorAll(`[data-page="${pageId}"]`)
    .forEach((item) => item.classList.add("active"));

  if (pageId === "saved") {
    renderSavedQuotes();
  }
}

function renderSavedQuotes() {
  const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes") || "[]");

  if (savedQuotes.length === 0) {
    savedQuotesList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-bookmark"></i>
                <p>No saved quotes yet.</p>
                <button class="btn primary" onclick="showPage('categories')">
                    Get Some Quotes
                </button>
            </div>
        `;
    return;
  }

  savedQuotesList.innerHTML = savedQuotes
    .map(
      (quote, index) => `
            <div class="saved-quote-card">
                <button class="delete-btn" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <div class="quote-text">
                    <i class="fa-solid fa-quote-left"></i>
                    <p>${quote.text}</p>
                    <i class="fa-solid fa-quote-right"></i>
                </div>
                <p class="author">${quote.author}</p>
            </div>
        `
    )
    .join("");

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      deleteQuote(parseInt(btn.dataset.index))
    );
  });
}

function deleteQuote(index) {
  const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes") || "[]");
  savedQuotes.splice(index, 1);
  localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
  renderSavedQuotes();
  showToast("Quote deleted successfully!");
}

// Event Listeners
generateBtn.addEventListener("click", () => updateQuote(currentCategory));

saveBtn.addEventListener("click", () => {
  const quoteText = quoteContent.textContent;
  const author = authorElement.textContent;
  const savedQuotes = JSON.parse(localStorage.getItem("savedQuotes") || "[]");

  if (savedQuotes.some((quote) => quote.text === quoteText)) {
    showToast("This quote is already saved!");
    return;
  }

  savedQuotes.push({ text: quoteText, author });
  localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
  showToast("Quote saved successfully!");
});

shareBtn.addEventListener("click", async () => {
  const quoteText = quoteContent.textContent;
  const author = authorElement.textContent;
  const shareText = `${quoteText} ${author} - via QuoteHub`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Share Quote",
        text: shareText,
        url: window.location.href,
      });
    } catch (err) {
      handleFallbackSharing(shareText);
    }
  } else {
    handleFallbackSharing(shareText);
  }
});

function handleFallbackSharing(text) {
  navigator.clipboard.writeText(text);
  showToast("Quote copied to clipboard!");
}

mobileMenuBtn.addEventListener("click", () => {
  sidebarNav.classList.toggle("show");
});

categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    currentCategory = item.dataset.category;
    updateQuote(currentCategory);
    categoryItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    sidebarNav.classList.remove("show");
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showPage(item.dataset.page);
    if (window.innerWidth <= 480) {
      navOptions.classList.remove("show");
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".mobile-menu") && !e.target.closest("aside")) {
    sidebarNav.classList.remove("show");
  }
});

// Initialize
updateQuote(currentCategory);
showPage("categories");

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    updateQuote(currentCategory);
  } else if (e.code === "KeyS" && e.ctrlKey) {
    e.preventDefault();
    saveBtn.click();
  }
});
