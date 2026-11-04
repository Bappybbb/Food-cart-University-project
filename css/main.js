import "./main.css";

const hamberger = document.getElementById('hamberger');
const navMenu = document.getElementById('nav-menu');
const closeIcon = document.getElementById('nav-close');
const navLink = document.querySelectorAll('.nav__link'); // . dot must be add here

navLink.forEach(link => {
   link.addEventListener("click", event => {
      navMenu.classList.add('hidden');
      hamberger.setAttribute("aria-expanded", "false");

      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      history.replaceState(null, '', href);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
   });
});


closeIcon.addEventListener("click", () => {
   navMenu.classList.add('hidden');
   hamberger.setAttribute("aria-expanded", "false");
})


hamberger.addEventListener("click" ,()=>{
   const isOpen = navMenu.classList.contains("hidden");
   navMenu.classList.toggle("hidden", !isOpen);
   hamberger.setAttribute("aria-expanded", String(isOpen));
})



         //  ~~~~~~~TABS~~~~~~~~

const tabs = document.querySelectorAll(".teb__wrap [data-tabs]");

const all = document.querySelectorAll('.item__wrap');

tabs.forEach(tab => {
   tab.addEventListener("click", () => {
      tabs.forEach(item => {
         item.classList.remove("active_wrap");
         item.setAttribute("aria-pressed", "false");
      });

      tab.classList.add('active_wrap');
      tab.setAttribute("aria-pressed", "true");
      const tabval = tab.getAttribute('data-tabs');

      all.forEach(item => {
         item.hidden = tabval !== "all" && !item.classList.contains(tabval);
      });
   });
});

document.querySelectorAll("[data-menu-tab]").forEach(link => {
   link.addEventListener("click", () => {
      document.querySelector(`.teb__wrap [data-tabs="${link.dataset.menuTab}"]`).click();
   });
});

const cart = new Map();
const cartToggle = document.getElementById("cart-toggle");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItemsContainer = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const placeOrderButton = document.getElementById("place-order");
const orderConfirmation = document.getElementById("order-confirmation");
const hasCartUI = [
   cartToggle,
   cartOverlay,
   cartClose,
   cartItemsContainer,
   cartEmpty,
   cartCount,
   cartTotal,
   checkoutForm,
   placeOrderButton,
   orderConfirmation
].every(Boolean);
const formatCurrency = cents => `৳${new Intl.NumberFormat("en-US", {
   minimumFractionDigits: 2,
   maximumFractionDigits: 2
}).format(cents / 100)}`;
const products = new Map([
   ["burger-1.png", { name: "ক্লাসিক বিফ বার্গার", description: "গ্রিলড বিফ, মুচমুচে লেটুস, টমেটো আর বিশেষ হাউজ সস।", price: 14900 }],
   ["burger-2.png", { name: "ডাবল চিজ বার্গার", description: "দুই পিস বিফ প্যাটি, তার সঙ্গে গলানো চিজের স্তর।", price: 17900 }],
   ["burger-3.png", { name: "বিবিকিউ বেকন বার্গার", description: "স্মোকি বারবিকিউ সস, বিফ আর মুচমুচে বেকনের দারুণ মিশ্রণ।", price: 18900 }],
   ["burger-4.png", { name: "স্পাইসি হালাপিনো বার্গার", description: "হালাপিনোর ঝাল ঝাল স্বাদ আর গলানো চিজ।", price: 15900 }],
   ["burger-5.png", { name: "গার্ডেন ভেজি বার্গার", description: "তাজা সবজির টপিংসসহ পেট ভরানো ভেজি প্যাটি।", price: 13900 }],
   ["snack-1.png", { name: "ক্লাসিক ফ্রেঞ্চ ফ্রাইজ", description: "সোনালি, মুচমুচে ফ্রাইজ, সঙ্গে এক চিমটি মসলা।", price: 10000 }],
   ["snack-2.png", { name: "লোডেড চিজ ফ্রাইজ", description: "মুচমুচে ফ্রাইজের ওপর গলানো চিজের আস্তরণ।", price: 12500 }],
   ["snack-3.png", { name: "ক্রিস্পি চিকেন বাইটস", description: "মুচমুচে চিকেন বাইটস, সবাই মিলে শেয়ার করে খাওয়ার জন্য পারফেক্ট।", price: 14900 }],
   ["snack-4.png", { name: "গোল্ডেন অনিয়ন রিংস", description: "মিষ্টি পেঁয়াজ, মুচমুচে সোনালি আবরণে মোড়ানো।", price: 11500 }],
   ["snack-5.png", { name: "সিজনড পটেটো ওয়েজেস", description: "পুরু করে কাটা আলুর ওয়েজেস, মজাদার মসলায় মাখানো।", price: 11000 }],
   ["snack-6.png", { name: "মোজারেলা স্টিকস", description: "বাইরে মুচমুচে, ভেতরে গলে যাওয়া মোজারেলা চিজ।", price: 13500 }],
   ["beverage-1.png", { name: "বেরি স্মুদি", description: "ঠান্ডা, ফলের স্বাদে ভরা বেরি স্মুদি।", price: 14000 }],
   ["beverage-2.png", { name: "ম্যাঙ্গো স্মুদি", description: "মিষ্টি আমের স্বাদে তৈরি সতেজ করা পানীয়।", price: 13500 }],
   ["beverage-3.png", { name: "চকলেট মিল্কশেক", description: "ঘন চকলেটের স্বাদে মসৃণ ও ক্রিমি মিল্কশেক।", price: 15000 }],
   ["beverage-4.png", { name: "স্ট্রবেরি মিল্কশেক", description: "স্ট্রবেরির স্বাদে মসৃণ ও ক্রিমি মিল্কশেক।", price: 15000 }],
   ["beverage-5.png", { name: "ফ্রেশ লেমনেড", description: "লেবুর টক-মিষ্টি স্বাদে সতেজ, ঠান্ডা পানীয়।", price: 10000 }],
]);

document.querySelectorAll(".item__wrap").forEach(item => {
   const image = item.querySelector("img").getAttribute("src");
   const productId = image.split("/").pop();
   const product = products.get(productId);
   if (!product) throw new Error(`Missing menu details for ${productId}`);

   item.querySelector(".card__title").textContent = product.name;
   item.querySelector(".paragraph").textContent = product.description;
   item.querySelector(".text-secondaryColor").textContent = formatCurrency(product.price);
   item.querySelector("img").alt = product.name;

   const addButton = document.createElement("button");

   addButton.type = "button";
   addButton.className = "add-to-cart";
   addButton.textContent = "Add to order";
   addButton.setAttribute("aria-label", `Add ${product.name} to your order`);
   addButton.addEventListener("click", () => {
      const existing = cart.get(productId);
      cart.set(productId, {
         id: productId,
         name: product.name,
         price: product.price,
         image,
         quantity: (existing?.quantity || 0) + 1
      });
      renderCart();
      const copyrightYear = document.getElementById("copyright-year");
      if (copyrightYear) {
         copyrightYear.textContent = String(new Date().getFullYear());
      }
   });

   item.append(addButton);
});

function renderCart() {
   cartItemsContainer.replaceChildren();
   let total = 0;
   let itemCount = 0;

   cart.forEach(product => {
      total += product.price * product.quantity;
      itemCount += product.quantity;

      const row = document.createElement("div");
      row.className = "cart-item";
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = "";
      const details = document.createElement("div");
      details.className = "cart-item-details";
      const name = document.createElement("strong");
      name.textContent = product.name;
      const price = document.createElement("span");
      price.textContent = formatCurrency(product.price * product.quantity);
      details.append(name, price);

      const quantity = document.createElement("div");
      quantity.className = "cart-quantity";
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Remove one ${product.name}`);
      decrease.addEventListener("click", () => {
         if (product.quantity === 1) {
            cart.delete(product.id);
         } else {
            product.quantity -= 1;
         }
         renderCart();
      });
      const count = document.createElement("span");
      count.textContent = String(product.quantity);
      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Add one ${product.name}`);
      increase.addEventListener("click", () => {
         product.quantity += 1;
         renderCart();
      });
      quantity.append(decrease, count, increase);
      row.append(image, details, quantity);
      cartItemsContainer.append(row);
   });

   cartCount.textContent = String(itemCount);
   cartTotal.textContent = formatCurrency(total);
   cartEmpty.hidden = itemCount > 0;
   checkoutForm.hidden = itemCount === 0;
   placeOrderButton.disabled = itemCount === 0;
   orderConfirmation.hidden = true;
}

if (hasCartUI) {
   cartToggle.addEventListener("click", () => {
      cartOverlay.hidden = false;
      cartClose.focus();
   });

   const closeCart = () => {
      cartOverlay.hidden = true;
      cartToggle.focus();
   };

   cartClose.addEventListener("click", closeCart);
   cartOverlay.addEventListener("click", event => {
      if (event.target === cartOverlay) closeCart();
   });

   document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !cartOverlay.hidden) closeCart();
   });

   checkoutForm.addEventListener("submit", event => {
      event.preventDefault();
      if (cart.size === 0 || !checkoutForm.reportValidity()) return;

      const orderTotal = [...cart.values()].reduce((sum, product) => sum + product.price * product.quantity, 0);
      const orderId = `BH-${Date.now().toString().slice(-6)}`;
      cart.clear();
      checkoutForm.reset();
      renderCart();
      orderConfirmation.textContent = `Demo order ${orderId} for ${formatCurrency(orderTotal)} created. No payment was taken and the restaurant did not receive it.`;
      orderConfirmation.hidden = false;
   });

   renderCart();
}



   //  ~~~~~~~~~~~~Scroll up~~~~~~~~~~~

const scrollUp = () => {
   const scrollUpBtn = document.getElementById("scroll-up");

   // Check the scroll position
   if (window.scrollY >= 250) {
      scrollUpBtn.classList.remove("-bottom-1/2"); // Bring button into view
      scrollUpBtn.classList.add("bottom-4");
   } else {
      scrollUpBtn.classList.add("-bottom-1/2"); // Hide button off-screen
      scrollUpBtn.classList.remove("bottom-4");
   }
};

// Add scroll event listener
window.addEventListener('scroll', scrollUp);








// `````````````Change Backgroundheader````````````````

const scrollHeader = () => {
   const header = document.getElementById("header");

   // Use window.scrollY to get the scroll position
   if (window.scrollY >= 50) {
      header.classList.add("border-b", "border-secondaryColor");  // Add border when scroll is >= 50px
   } else {
      header.classList.remove("border-b", "border-secondaryColor");  // Remove border when scroll is < 50px
   }
};

window.addEventListener('scroll', scrollHeader);





// ``````````````````````Dark mode``````````````````

const html = document.querySelector("html");
const themeBtn = document.getElementById("theme-toggle");

const setThemeControl = isDark => {
   const nextMode = isDark ? "light" : "dark";
   const icon = themeBtn.querySelector("i");
   icon.classList.toggle("ri-moon-line", !isDark);
   icon.classList.toggle("ri-sun-line", isDark);
   themeBtn.setAttribute("aria-label", `Switch to ${nextMode} mode`);
   themeBtn.setAttribute("title", `Switch to ${nextMode} mode`);
   themeBtn.setAttribute("aria-pressed", String(isDark));
};

const savedMode = localStorage.getItem("mode");
const isDarkMode = savedMode === "dark";
html.classList.toggle("dark", isDarkMode);
setThemeControl(isDarkMode);

// Toggle theme on button click
themeBtn.addEventListener('click', () => {
   if (html.classList.contains("dark")) {
      lightMode();
   } else {
      darkMode();
   }
});

// Function to enable dark mode
function darkMode() {
   html.classList.add("dark");
   setThemeControl(true);
   localStorage.setItem("mode", "dark");
}

// Function to enable light mode
function lightMode() {
   html.classList.remove("dark");
   setThemeControl(false);
   localStorage.setItem("mode", "light");
}








      