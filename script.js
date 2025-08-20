let chart;

async function getCryptoData() {
  const search = document.getElementById("search").value.toLowerCase() || "bitcoin";

  try {
    // Fetch current data
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${search}`);
    const data = await response.json();

    // Display info
    document.getElementById("crypto-info").innerHTML = `
      <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
      <p>💵 Current Price: $${data.market_data.current_price.usd.toLocaleString()}</p>
      <p>📊 Market Cap: $${data.market_data.market_cap.usd.toLocaleString()}</p>
      <p>📈 24h Change: ${data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
    `;

    // Fetch last 7 days price
    const historyRes = await fetch(
      `https://api.coingecko.com/api/v3/coins/${search}/market_chart?vs_currency=usd&days=7`
    );
    const historyData = await historyRes.json();

    const prices = historyData.prices.map(p => p[1]);
    const labels = historyData.prices.map(p => new Date(p[0]).toLocaleDateString());

    // Destroy old chart if exists
    if (chart) chart.destroy();

    // Create new chart
    const ctx = document.getElementById("priceChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${data.name} Price (USD)`,
          data: prices,
          borderColor: "#00ffcc",
          backgroundColor: "rgba(0,255,204,0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { grid: { color: "#333" } },
          y: { grid: { color: "#333" } }
        }
      }
    });

  } catch (error) {
    document.getElementById("crypto-info").innerHTML = `<p style="color:red;">❌ Invalid cryptocurrency name</p>`;
  }
}

// Load default Bitcoin on page load
window.onload = getCryptoData;
