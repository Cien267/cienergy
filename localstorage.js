function loadUserData() {
  const saved = localStorage.getItem("morningCupUser")
  if (saved) {
    userData = JSON.parse(saved)
    document.getElementById("phone").value = userData.phone || ""
    document.getElementById("name").value = userData.name || ""
    document.getElementById("address").value = userData.address || ""
  }
}

function saveUserData() {
  localStorage.setItem("morningCupUser", JSON.stringify(userData))
}
