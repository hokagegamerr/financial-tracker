import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all"); // 'all', 'income', 'expenses'

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add a new transaction
  function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setDescription("");
    setAmount("");
  }

  // Delete a transaction
  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  // --- Financial calculations ---
  const amounts = transactions.map((tx) => tx.amount);

  const income = amounts
    .filter((amt) => amt > 0)
    .reduce((acc, amt) => acc + amt, 0);

  const expenses = amounts
    .filter((amt) => amt < 0)
    .reduce((acc, amt) => acc + amt, 0);

  const balance = income + expenses;

  // --- Filtered transactions ---
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "income") return tx.amount > 0;
    if (filter === "expenses") return tx.amount < 0;
    return true;
  });

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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "320px",
          }}
        >
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
          <button type="submit">Add</button>
        </form>
      </section>

      {/* Transactions Section */}
      <section>
        <h2>Transactions</h2>
        <div style={{ marginBottom: "1rem" }}>
          <button
            onClick={() => setFilter("all")}
            style={{ fontWeight: filter === "all" ? "700" : "normal" }}
          >
            All
          </button>
          <button
            onClick={() => setFilter("income")}
            style={{
              color: "limegreen",
              fontWeight: filter === "income" ? "700" : "normal",
              marginLeft: "1rem",
            }}
          >
            Income
          </button>
          <button
            onClick={() => setFilter("expenses")}
            style={{
              color: "tomato",
              fontWeight: filter === "expenses" ? "700" : "normal",
              marginLeft: "1rem",
            }}
          >
            Expenses
          </button>
        </div>

        <ul>
          {filteredTransactions.map((tx) => (
            <li key={tx.id}>
              {tx.description} — ₱{tx.amount}{" "}
              <button onClick={() => deleteTransaction(tx.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
