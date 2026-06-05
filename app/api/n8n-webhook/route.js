export async function POST(request) {
  const body = await request.json()
  
  try {
    await fetch("https://dragandanevski.app.n8n.cloud/webhook-test/lead-intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
  } catch (err) {
    console.error("n8n failed:", err)
  }

  return Response.json({ ok: true })
}
