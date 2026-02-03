import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State values for inputs and data
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add a new transaction
  function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      category,
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setDescription("");
    setAmount("");
    setCategory("");
  }

  // Delete a transaction
  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  // Calculate income, expenses, and balance
  const amounts = transactions.map((tx) => tx.amount);
  const income = amounts.filter((amt) => amt > 0).reduce((acc, amt) => acc + amt, 0);
  const expenses = amounts.filter((amt) => amt < 0).reduce((acc, amt) => acc + amt, 0);
  const balance = income + expenses;

  // Filter transactions by type
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "income") return tx.amount > 0;
    if (filter === "expenses") return tx.amount < 0;
    return true;
  });

  // Calculate totals per category
  const categoryTotals = transactions.reduce((acc, tx) => {
    if (!tx.category) return acc;
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  // Calculate monthly summaries
  const monthlySummaries = transactions.reduce((acc, tx) => {
    const month = new Date(tx.id).toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (tx.amount > 0) {
      acc[month].income += tx.amount;
    } else {
      acc[month].expenses += tx.amount;
    }
    return acc;
  }, {});

  // Calculate remaining budget
  const remainingBudget = budget + expenses;

  // Render the UI
  return (
    <main>
      <header>
        <h1>Bad Financial Habits Tracker</h1>
      </header>

      {/* Balance Section */}
      <section>
        <h2>Balance</h2>
        <p style={{ fontSize: "1.8rem", fontWeight: "700" }}>
          ₱{balance.toFixed(2)}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "320px" }}>
          <div>
            <h3>Income</h3>
            <p style={{ color: "limegreen", fontWeight: "700" }}>
              ₱{income.toFixed(2)}
            </p>
          </div>
          <div>
            <h3>Expenses</h3>
            <p style={{ color: "tomato", fontWeight: "700" }}>
              ₱{Math.abs(expenses).toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      {/* Budget Section */}
        <section>
          <h2>Set Budget</h2>
          <input
            type="text" 
            placeholder="Enter your budget"
            value={budget}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setBudget(Number(val));
              }
            }}
          />
        </section>


      <section>
        <h2>Remaining Budget</h2>
        <p style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: remainingBudget < 0 ? "tomato" : "limegreen"
        }}>
          ₱{remainingBudget.toFixed(2)}
        </p>
      </section>

      {/* Monthly Summaries Section */}
      <section>
        <h2>Monthly Summaries</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {Object.entries(monthlySummaries).map(([month, data]) => {
            const monthlyBalance = data.income + data.expenses;
            return (
              <div
                key={month}
                style={{
                  border: "2px solid #ff00ff",
                  padding: "1rem",
                  borderRadius: "8px",
                  minWidth: "180px",
                  textAlign: "center",
                  boxShadow: "0 0 12px #ff00ff",
                }}
              >
                <h3>{month}</h3>
                <p style={{ color: "limegreen" }}>Income: ₱{data.income.toFixed(2)}</p>
                <p style={{ color: "tomato" }}>Expenses: ₱{Math.abs(data.expenses).toFixed(2)}</p>
                <p style={{ fontWeight: "700" }}>Balance: ₱{monthlyBalance.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Transaction Section */}
      <section>
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (use negative for expenses)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category (e.g. Food, Transport)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      {/* Transactions Section */}
      <section>
        <h2>Transactions</h2>
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setFilter("all")} style={{ fontWeight: filter === "all" ? "700" : "normal" }}>All</button>
          <button onClick={() => setFilter("income")} style={{ color: "limegreen", fontWeight: filter === "income" ? "700" : "normal", marginLeft: "1rem" }}>Income</button>
          <button onClick={() => setFilter("expenses")} style={{ color: "tomato", fontWeight: filter === "expenses" ? "700" : "normal", marginLeft: "1rem" }}>Expenses</button>
        </div>
        <ul>
          {filteredTransactions.map((tx) => (
            <li key={tx.id}>
              {tx.description} — ₱{tx.amount} ({tx.category})
              <button onClick={() => deleteTransaction(tx.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Category Breakdown Section */}
      <section>
        <h2>Category Breakdown</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <div
              key={cat}
              style={{
                border: "2px solid #00ffcc",
                padding: "1rem",
                borderRadius: "8px",
                minWidth: "120px",
                textAlign: "center",
                boxShadow: "0 0 10px #00ffcc",
              }}
            >
              <h3>{cat}</h3>
              <p>₱{total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;