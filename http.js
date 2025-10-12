const SUPABASE_PROJECT_KEY = "xisqkjrqpbjnuiiulxwo"
const SUPABASE_URL = `https://${SUPABASE_PROJECT_KEY}.supabase.co`
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc3FranJxcGJqbnVpaXVseHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTM0MTgsImV4cCI6MjA3NTc4OTQxOH0.RMHjDhW8IPvy1youFaAho15gIb8FGWqfd_C3WOtM46M"
const supabaseInstance = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

async function callApiCreateOrder({ userData, cart, note }) {
  const { data: user, error } = await supabaseInstance
    .from("users")
    .select("*")
    .eq("name", userData.name)
    .eq("phone", userData.phone)
    .eq("address", userData.address)
    .maybeSingle()

  if (error) {
    console.error("Error getUser: ", error)
    alert("Lỗi khi lấy thông tin user: " + error.message)
    throw new Error(error)
  } else {
    let userId = null
    if (!user) {
      const { data, error } = await supabaseInstance
        .from("users")
        .insert([
          {
            name: userData.name,
            phone: userData.phone,
            address: userData.address,
          },
        ])
        .select()
        .single()
      if (error) {
        console.error(error)
        throw new Error(error)
      }
      userId = data.id
    } else {
      await supabaseInstance
        .from("users")
        .update({ orderTimes: userData.orderTimes + 1 })
        .eq("id", user.id)
      userId = user.id
    }
    const { data: order, error } = await supabaseInstance
      .from("orders")
      .insert([
        {
          user_id: userId,
          cart: JSON.stringify(cart),
          note,
          delivery_time: getDeliveryTimeDB(),
        },
      ])
      .select()
      .single()
    if (error) {
      console.error(error)
      throw new Error(error)
    }

    try {
      fetch(
        `https://${SUPABASE_PROJECT_KEY}.functions.supabase.co/cienergy-send-telegram`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: order.id }),
        }
      )
    } catch (e) {
      console.error("Error send telegram message: ", e)
    }
    return order
  }
}
