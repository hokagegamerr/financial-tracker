import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // --- YOUR LOGIC STARTS HERE (Unchanged) ---
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

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

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  const amounts = transactions.map((tx) => tx.amount);
  const income = amounts.filter((amt) => amt > 0).reduce((acc, amt) => acc + amt, 0);
  const expenses = amounts.filter((amt) => amt < 0).reduce((acc, amt) => acc + amt, 0);
  const balance = income + expenses;
  const remainingBudget = budget + expenses; // Logic assuming expenses are negative numbers

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "income") return tx.amount > 0;
    if (filter === "expenses") return tx.amount < 0;
    return true;
  });

  const categoryTotals = transactions.reduce((acc, tx) => {
    if (!tx.category) return acc;
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

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
  // --- YOUR LOGIC ENDS HERE ---

  return (
    <div className="app">
      <header className="header">
        <h1>Bad Financial Habits</h1>
      </header>

      {/* 1. FINANCIAL OVERVIEW & BUDGET */}
      <section className="overview">
        <h2 style={{ textAlign: "center" }}>Net Position</h2>
        <div className="balance">₱{balance.toLocaleString()}</div>

        <div className="summary">
          <div className="income">IN: +₱{income.toLocaleString()}</div>
          <div className="expenses">OUT: -₱{Math.abs(expenses).toLocaleString()}</div>
        </div>

        {/* Budget Feature Restored */}
        <div className="budget-section">
          <label style={{ fontSize: "0.8rem", color: "#94a3b8", display: "block", marginBottom: "5px" }}>
            MONTHLY BUDGET LIMIT
          </label>
          <input
            type="text"
            placeholder="Set Budget..."
            value={budget}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setBudget(Number(val));
            }}
            style={{ textAlign: "center", width: "150px", marginBottom: "10px" }}
          />
          <div style={{ fontSize: "0.9rem" }}>
            Remaining:{" "}
            <span className={remainingBudget < 0 ? "remaining-negative" : "remaining-positive"}>
              ₱{remainingBudget.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* 2. ADD TRANSACTION */}
      <section>
        <h2>New Entry</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Description (e.g. Coffee)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (-500)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ flex: 0.5 }}
          />
          <button type="submit">ADD</button>
        </form>
      </section>

      {/* 3. MONTHLY SUMMARIES (Restored) */}
      <section>
        <h2>Monthly Logs</h2>
        <div className="cards">
          {Object.entries(monthlySummaries).map(([month, data]) => {
            const monthlyBalance = data.income + data.expenses;
            return (
              <div className="card" key={month}>
                <h3>{month}</h3>
                <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span className="income">In: ₱{data.income.toLocaleString()}</span>
                  <span className="expenses">Out: ₱{Math.abs(data.expenses).toLocaleString()}</span>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "5px", paddingTop: "5px" }}>
                    Net: ₱{monthlyBalance.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
          {Object.keys(monthlySummaries).length === 0 && (
             <p style={{color: '#666', fontStyle:'italic'}}>No monthly data available.</p>
          )}
        </div>
      </section>

      {/* 4. TRANSACTION HISTORY */}
      <section className="transactions-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>History</h2>
          <div className="filters">
            <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>ALL</button>
            <button onClick={() => setFilter("income")} className={filter === "income" ? "active" : ""}>IN</button>
            <button onClick={() => setFilter("expenses")} className={filter === "expenses" ? "active" : ""}>OUT</button>
          </div>
        </div>

        <ul>
          {filteredTransactions.map((tx) => (
            <li key={tx.id}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "1rem" }}>{tx.description}</span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{tx.category}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span className={tx.amount < 0 ? "expenses" : "income"} style={{ fontFamily: "monospace", fontSize: "1.1rem" }}>
                  {tx.amount < 0 ? "" : "+"}₱{Math.abs(tx.amount).toLocaleString()}
                </span>
                <button className="delete-btn" onClick={() => deleteTransaction(tx.id)}>DEL</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. CATEGORY BREAKDOWN (Restored) */}
      <section>
        <h2>Category Analysis</h2>
        <div className="cards">
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <div className="card" key={cat}>
              <h3>{cat}</h3>
              <span className={total < 0 ? "expenses" : "income"} style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                ₱{Math.abs(total).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;