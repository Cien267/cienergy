let cart = []
let currentTemp = "hot"
let currentQty = 1
let userData = {}
let menuItems = []
const menuListContainer = document.getElementById("menuList")
const cartItemsContainer = document.getElementById("cartItems")
const checkoutModal = document.getElementById("checkoutModal")
const timeSlots = document.getElementById("timeSlot")
const cartSummary = document.getElementById("cartSummary")
const checkoutBtn = document.getElementById("checkoutBtn")
const toggleBtns = document.querySelectorAll(".toggle-btn")
const orderSummary = document.getElementById("orderSummary")
const closeCheckoutBtn = document.getElementById("closeCheckout")
const clearCartBtn = document.getElementById("clearCart")
const phoneInput = document.getElementById("phone")
const phoneError = document.getElementById("phoneError")
const nameInput = document.getElementById("name")
const addressInput = document.getElementById("address")
const pageLoader = document.getElementById("loader")
const orderId = document.getElementById("orderId")
const eta = document.getElementById("eta")
const reorderSuccessBtn = document.getElementById("reorderSuccess")
const bottomMiniCart = document.getElementById("miniCart")
const menuCartDivider = document.getElementById("divider")
const successModal = document.getElementById("successModal")

function updateDeliveryTimeNote() {
  const deliveryTimeNote = document.getElementById("deliveryTimeNote")
  const now = new Date()
  const currentHour = now.getHours()
  if (currentHour > 8) {
    deliveryTimeNote.textContent = "(hôm sau)"
    timeSlots.querySelectorAll("option").forEach((opt) => {
      if (opt.value === "asap") timeSlots.remove(opt)
    })
  } else deliveryTimeNote.textContent = "(hôm nay)"
}

function loadMenu() {
  return fetch("./public/data/menu.json")
    .then((res) => res.json())
    .then((data) => {
      menuItems = data
      renderMenu()
    })
}

function renderMenu() {
  menuListContainer.innerHTML = menuItems
    .map(
      (item) => `
        <div class="bg-white rounded-lg p-3 flex items-center gap-3 border-2 border-solid border-gray-100 shadow-lg" id="menuItem-${
          item.id
        }">
          <div class="text-3xl">${item.icon}</div>
          <div class="flex-1">
            <div class="font-semibold text-base">${item.name}</div>
            ${
              item.description
                ? `<div class="text-xs text-gray-500 mb-1">${item.description}</div>`
                : ""
            }
            <div class="text-sm font-bold text-sky-700">${(
              item.price / 1000
            ).toFixed(0)}k</div>
          </div>
          ${
            item.popular
              ? '<span class="text-xs text-cf-darkest font-medium bg-yellow-200 px-2 py-1 rounded">Bán chạy</span>'
              : ""
          }
          <button class="add-btn w-10 h-10 rounded-full bg-white border-4 border-solid active:scale-105 ${getAddButtonStyleByTemp(
            currentTemp
          )} flex items-center justify-center text-2xl pb-1 font-bold" data-id="${
        item.id
      }" aria-label="Add ${item.name}">
            +
          </button>
        </div>
      `
    )
    .join("")

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id)
      addToCart(id)
      if (navigator.vibrate) navigator.vibrate(10)
    })
  })
}

function addToCart(itemId) {
  displayAddingAnimation(itemId)

  const item = menuItems.find((i) => i.id === itemId)
  const existingIndex = cart.findIndex(
    (c) => c.id === itemId && c.temp === currentTemp
  )

  if (existingIndex >= 0) {
    cart[existingIndex].qty += currentQty
  } else {
    cart.push({
      id: itemId,
      name: item.name,
      price: item.price,
      temp: currentTemp,
      qty: currentQty,
    })
  }
  updateCart()
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  cartSummary.innerHTML = `
  ${totalItems} cốc • <span class="font-bold text-sky-700">
    ${(totalPrice / 1000).toFixed(0)}k
  </span>
`
  checkoutBtn.disabled = cart.length === 0

  if (cart.length > 0) {
    bottomMiniCart.classList.remove("hidden")
    menuCartDivider.classList.remove("hidden")
    renderCartItems()
  } else {
    bottomMiniCart.classList.add("hidden")
    menuCartDivider.classList.add("hidden")
  }
}

function renderCartItems() {
  cartItemsContainer.innerHTML = cart
    .map(
      (item, idx) => `
        <div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex-1">
              <span class="font-medium">${item.name}</span>
              <span class="${renderTempLabelColor(
                item.temp
              )} ml-1">(${renderTempLabel(item.temp)})</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="qty-minus w-6 h-6 rounded bg-gray-100 text-xs flex items-center justify-center" data-idx="${idx}">−</button>
              <span class="w-4 text-center">${item.qty}</span>
              <button class="qty-plus w-6 h-6 rounded bg-gray-100 text-xs flex items-center justify-center" data-idx="${idx}">+</button>
              <button class="remove-item text-gray-500 ml-2" data-idx="${idx}">✕</button>
            </div>
          </div>
          <div>
            <span class="font-medium text-sky-700">${(
              (item.price * item.qty) /
              1000
            ).toFixed(0)}k</span>
          </div>
        </div>
      `
    )
    .join("")

  document.querySelectorAll(".qty-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx)
      if (cart[idx].qty > 1) cart[idx].qty--
      else cart.splice(idx, 1)
      updateCart()
    })
  })

  document.querySelectorAll(".qty-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx)
      cart[idx].qty++
      updateCart()
    })
  })

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx)
      cart.splice(idx, 1)
      updateCart()
    })
  })
}

toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleBtns.forEach((b) => {
      b.classList.remove(
        "bg-cf-medium",
        "text-white",
        "hover:bg-gray-100",
        "hover:bg-cf-medium"
      )
      b.classList.add("text-cf-darkest", "hover:bg-gray-100")
    })
    btn.classList.add("bg-cf-medium", "text-white", "hover:bg-cf-medium")
    btn.classList.remove("text-cf-darkest")
    currentTemp = btn.dataset.temp
    renderMenu()
  })
})

checkoutBtn.addEventListener("click", () => {
  const describeOrdersText = describeOrders(cart)
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  orderSummary.innerHTML = `${describeOrdersText}. <br/><span class="font-bold">Tổng: ${totalItems} cốc • ${(
    totalPrice / 1000
  ).toFixed(0)}k</span> <span class="absolute -left-3 -top-3 text-xl">📌</span>`
  checkoutModal.classList.add("active")
})

closeCheckoutBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("active")
})

checkoutModal.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove("active")
  }
})

clearCartBtn.addEventListener("click", () => {
  cart = []
  updateCart()
})

phoneInput.addEventListener("input", (e) => {
  phoneError.classList.add("hidden")
  phoneInput.classList.remove("border-red-500")
  let value = e.target.value.replace(/\D/g, "")
  if (value.length > 11) {
    value = value.slice(0, 11)
  }
  e.target.value = value
})

document
  .getElementById("checkoutForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault()
    phoneError.classList.add("hidden")
    phoneInput.classList.remove("border-red-500")

    userData = {
      phone: phoneInput.value,
      name: nameInput.value,
      address: addressInput.value,
    }

    if (!isValidPhone(userData.phone)) {
      phoneInput.classList.add("border-red-500")
      phoneError.classList.remove("hidden")
      return
    }

    try {
      pageLoader.classList.remove("hidden")
      saveUserData()
      const response = await callApiCreateOrder({ userData, cart })

      const timeSlotVal = timeSlot.value
      const etaVal = timeSlotVal === "asap" ? "15-30 phút" : timeSlotVal

      orderId.textContent = response?.data?.id ?? 0
      eta.textContent = etaVal

      checkoutModal.classList.remove("active")
      pageLoader.classList.add("hidden")
      successModal.classList.add("active")

      cart = []
      orderSummary.innerHTML = ""
      updateCart()
    } catch (error) {
      pageLoader.classList.add("hidden")
      alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.")
      console.error("Error creating order:", error)
    }
  })

reorderSuccessBtn.addEventListener("click", () => {
  successModal.classList.remove("active")
})

loadUserData()
loadMenu()
updateCart()
updateDeliveryTimeNote()
