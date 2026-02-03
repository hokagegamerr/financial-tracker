import React, { useState, useEffect } from "react";

export default function SavingsGoals() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("savingsGoals");
    return saved ? JSON.parse(saved) : [];
  });
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (e) => {
    e.preventDefault();
    if (!goalName || !targetAmount) return;
    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: Number(targetAmount),
      current: 0,
    };
    setGoals([...goals, newGoal]);
    setGoalName("");
    setTargetAmount("");
  };

  const updateProgress = (id, amount) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, current: Math.max(0, g.current + amount) } : g
    ));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <section>
      <h2>Savings Goals</h2>
      
      <form onSubmit={addGoal} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Goal Name" 
          value={goalName} 
          onChange={(e) => setGoalName(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Target ₱" 
          value={targetAmount} 
          onChange={(e) => setTargetAmount(e.target.value)} 
        />
        <button type="submit">Set Goal</button>
      </form>

      <div className="goals-list">
        {goals.map(goal => {
          const percentage = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="goal-card" style={{ marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>{goal.name}</span>
                <span style={{ color: 'var(--neon-cyan)' }}>₱{goal.current.toLocaleString()} / ₱{goal.target.toLocaleString()}</span>
              </div>
              
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-pink))',
                  transition: 'width 0.4s ease'
                }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[20, 50, 100, 500, 1000].map(amt => (
                    <button key={amt} onClick={() => updateProgress(goal.id, amt)} className="small-btn">
                      +{amt}
                    </button>
                  ))}
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="delete-btn">Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}