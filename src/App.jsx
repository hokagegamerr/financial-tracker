import { useState, useEffect } from "react";
import "./App.css";
import TrendsChart from "./TrendsChart";
import SavingsGoals from "./SavingsGoals";

function App() {
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
  const remainingBudget = budget + expenses;

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

  return (
    <div className="app">
      <header className="header">
        <h1>Bad Financial Habits</h1>
      </header>

      <div className="top-grid">
        <section className="overview">
          <h2 style={{ textAlign: "center" }}>Net Position</h2>
          <div className="balance">₱{balance.toLocaleString()}</div>
          <div className="summary">
            <div className="income">IN: +₱{income.toLocaleString()}</div>
            <div className="expenses">OUT: -₱{Math.abs(expenses).toLocaleString()}</div>
          </div>
          <div className="budget-section">
            <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>MONTHLY BUDGET</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => /^\d*$/.test(e.target.value) && setBudget(Number(e.target.value))}
              style={{ textAlign: "center", width: "120px" }}
            />
            <div style={{ marginTop: "10px", fontSize: "0.9rem" }}>
              Remaining: <span className={remainingBudget < 0 ? "remaining-negative" : "remaining-positive"}>
                ₱{remainingBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </section>

        <section className="chart-container">
          <h2>Spending Trends</h2>
          <TrendsChart monthlySummaries={monthlySummaries} />
        </section>
      </div>

      <SavingsGoals />

      <section>
        <h2>New Entry</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Amount (-500)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <button type="submit">ADD</button>
        </form>
      </section>

      <section>
        <h2>Monthly Logs</h2>
        <div className="cards">
          {Object.entries(monthlySummaries).map(([month, data]) => (
            <div className="card" key={month}>
              <h3>{month}</h3>
              <div style={{ fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "5px" }}>
                <span className="income">In: ₱{data.income.toLocaleString()}</span>
                <span className="expenses">Out: ₱{Math.abs(data.expenses).toLocaleString()}</span>
                <div style={{ borderTop: "1px solid var(--glass-border)", marginTop: "5px", paddingTop: "5px" }}>
                  Net: ₱{(data.income + data.expenses).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
                <span>{tx.description}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{tx.category}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span className={tx.amount < 0 ? "expenses" : "income"}>
                  {tx.amount < 0 ? "-" : "+"}₱{Math.abs(tx.amount).toLocaleString()}
                </span>
                <button className="delete-btn" onClick={() => deleteTransaction(tx.id)}>DEL</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Category Analysis</h2>
        <div className="cards">
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <div className="card" key={cat}>
              <h3>{cat}</h3>
              <span className={total < 0 ? "expenses" : "income"} style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
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