function isToday(date) {
  const now = new Date()
  const target = new Date(date)
  return (
    target.getDate() === now.getDate() &&
    target.getMonth() === now.getMonth() &&
    target.getFullYear() === now.getFullYear()
  )
}

function renderTempLabel(temp) {
  switch (temp) {
    case "hot":
      return "Nóng"
    case "iced":
      return "Đá"
    default:
      return "Nóng"
  }
}

function renderTempLabelColor(temp) {
  switch (temp) {
    case "hot":
      return "text-gray-500"
    case "iced":
      return "text-sky-500"
    default:
      return "text-gray-500"
  }
}

function isValidPhone(phone) {
  if (!phone) return false

  // Remove spaces, dots, dashes, and parentheses
  const normalized = phone.replace(/[\s.\-()]/g, "")

  // Regex for Vietnamese phone numbers:
  // - Optional +84 or 84 or leading 0
  // - Followed by valid carrier prefixes (3,5,7,8,9)
  // - Followed by 8 digits
  const regex = /^0(3|5|7|8|9)\d{8}$/

  return regex.test(normalized)
}

function getAddButtonStyleByTemp(temp) {
  switch (temp) {
    case "hot":
      return "border-coffee-dark text-coffee-dark"
    case "iced":
      return "border-sky-400 text-sky-400"
    default:
      return "border-coffee-dark text-coffee-dark"
  }
}

function describeOrders(orders) {
  const grouped = {}

  orders.forEach((o) => {
    const key = `${o.name}-${o.temp}`
    if (!grouped[key]) grouped[key] = { ...o }
    else grouped[key].qty += o.qty
  })

  const merged = {}
  for (const key in grouped) {
    const { name, temp, qty } = grouped[key]
    if (!merged[name]) merged[name] = {}
    merged[name][temp] = qty
  }

  const parts = Object.entries(merged).map(([name, temps]) => {
    const hot = temps.hot || 0
    const iced = temps.iced || 0

    if (hot && iced) return `${hot + iced} ${name} (${hot} nóng, ${iced} đá)`
    if (hot) return `${hot} ${name} nóng`
    if (iced) return `${iced} ${name} đá`
  })

  return parts.join(", ")
}

function displayAddingAnimation(itemId) {
  // floating text animation
  const itemElem = document.getElementById(`menuItem-${itemId}`)
  if (!itemElem) return
  const btn = itemElem.querySelector(".add-btn")
  if (!btn) return
  const rect = btn.getBoundingClientRect()
  const x = rect.left + rect.width / 2 + window.scrollX
  const y = rect.top + window.scrollY

  const floatingText = document.createElement("div")
  floatingText.className =
    currentTemp === "hot" ? "floating-text" : "floating-text-iced"
  floatingText.textContent = "+1"
  floatingText.style.left = x + "px"
  floatingText.style.top = y + "px"

  document.body.appendChild(floatingText)

  setTimeout(() => {
    floatingText.remove()
  }, 1000)

  // bouncing cart animation
  iconCart.classList.add("animate-bounce")
  setTimeout(() => {
    iconCart.classList.remove("animate-bounce")
  }, 1000)
}

function getDeliveryTimeNote(timeSlots) {
  const now = new Date()
  const currentHour = now.getHours()
  if (currentHour > 8) {
    timeSlots.querySelectorAll("option").forEach((opt) => {
      if (opt.value === "asap") timeSlots.remove(opt)
    })
    return "(ngày mai)"
  }
  return "(hôm nay)"
}
