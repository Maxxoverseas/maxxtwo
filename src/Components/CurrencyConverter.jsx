import React, { useEffect, useState } from "react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [rates, setRates] = useState({});
  const [result, setResult] = useState(0);
  const [loading, setLoading] = useState(true);

  const currencies = ["USD", "INR", "EUR", "GBP", "AED", "JPY", "CAD", "AUD"];

  // 👉 Fetch rate for the BASE currency only once when "from" changes
  const fetchRates = async (base) => {
    setLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const data = await res.json();

      if (data.result === "success") {
        setRates(data.rates);
      } else {
        setRates({});
      }
    } catch (err) {
      console.log("Error:", err);
      setRates({});
    }
    setLoading(false);
  };

  // 👉 Re-fetch rates when base currency changes
  useEffect(() => {
    fetchRates(from);
  }, [from]);

  // 👉 Convert whenever amount, base, or target changes
  useEffect(() => {
    if (rates && rates[to]) {
      const converted = Number(amount) * Number(rates[to]);
      setResult(converted);
    }
  }, [amount, to, rates]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-xl p-6 border">
      <h2 className="text-2xl font-bold text-center mb-6">
        🔄 Real-Time Currency Converter
      </h2>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-600 mb-1">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            {currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 mb-1">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            {currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        {loading ? (
          <span className="text-blue-600 font-semibold">Loading rates...</span>
        ) : (
          <>
            <p className="text-gray-600">Converted Amount</p>
            <h3 className="text-3xl font-bold text-green-600">
              {(Number(result) || 0).toFixed(2)} {to}
            </h3>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
