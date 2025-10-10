async function callApiCreateOrder({ userData, cart }) {
  console.log({ userData, cart })
  // Simulate API call delay
  return new Promise((resolve) => setTimeout(resolve, 1000))
  // Uncomment below to call a real API endpoint
  /*
  return fetch("https://your-api-endpoint.com/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userData, cart }),
  }).then((res) => {
    if (!res.ok) throw new Error("Network response was not ok")
    return res.json()
  })
  */
}
