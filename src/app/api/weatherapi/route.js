export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const apiKey = process.env.WEATHER_API_KEY; 

  if (!city) {
    return new Response(JSON.stringify({ error: "La ville est requise" }), { status: 400 });
  }

  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&lang=fr&days=10`);
    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo', error);
    return new Response(JSON.stringify({ error: "Erreur lors de la récupération des données météo" }), { status: 500 });
  }
}
