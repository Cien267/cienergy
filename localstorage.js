const USER_KEY = "cienergyUser"
const CART_KEY = "cienergyCart"

function loadUserData() {
  const saved = localStorage.getItem(USER_KEY)
  if (saved) {
    userData = JSON.parse(saved)
    document.getElementById("phone").value = userData.phone || ""
    document.getElementById("name").value = userData.name || ""
    document.getElementById("address").value = userData.address || ""
  }
}

function saveUserData() {
  let orderTimesVal = userData?.orderTimes ?? 0
  userData.orderTimes = orderTimesVal + 1
  localStorage.setItem(USER_KEY, JSON.stringify(userData))
}

function loadCartData() {
  const saved = localStorage.getItem(CART_KEY)
  if (saved) {
    const dataLocal = JSON.parse(saved)
    if (!isToday(dataLocal.time)) localStorage.removeItem(CART_KEY)
    else cart = dataLocal.cart
  }
}

function saveCartData() {
  const data = {
    cart: JSON.parse(JSON.stringify(cart)),
    time: new Date(),
  }

  localStorage.setItem(CART_KEY, JSON.stringify(data))
}
