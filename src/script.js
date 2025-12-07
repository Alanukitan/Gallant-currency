// STEP 1: Get all the HTML elements we need
const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const convertButton = document.getElementById("convertButton");
const resultArea = document.getElementById("resultArea");

convertButton.addEventListener("click", convertCurrency);

amountInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    convertCurrency();
  }
});

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (!amount || amount <= 0 || isNaN(amount)) {
    resultArea.textContent = "⚠️ Please enter a valid amount";
    resultArea.style.color = "#ef4444";
    resultArea.style.display = "block";
    return;
  }

  if (fromCurrency === toCurrency) {
    resultArea.textContent = `${amount.toFixed(
      2
    )} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency}`;
    resultArea.style.color = "#10b981";
    resultArea.style.display = "block";
    return;
  }

  resultArea.textContent = "⏳ Converting...";
  resultArea.style.color = "#6b7280";
  resultArea.style.display = "block";

  try {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const exchangeRate = data.rates[toCurrency];

    if (!exchangeRate) {
      throw new Error(`Currency ${toCurrency} not supported`);
    }

    const convertedAmount = amount * exchangeRate;

    resultArea.textContent = ` ${amount} ${fromCurrency} = ${convertedAmount.toFixed(
      2
    )} ${toCurrency}`;
    resultArea.style.color = "#10b981";
    resultArea.style.display = "block";
    
  } catch (error) {
    console.error("Conversion Error:", error);
    resultArea.textContent =
      "❌ Error converting currency. Please check your connection and try again.";
    resultArea.style.color = "#ef4444";
    resultArea.style.display = "block";
  }
}

resultArea.style.display = "none";
