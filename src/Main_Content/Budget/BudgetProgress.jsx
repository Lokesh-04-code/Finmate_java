import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Healthcare",
  "Personal",
  "Education",
  "Clothes",
  "Utilities",
  "Other",
];

function BudgetProgress({ user, transactions }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const month = new Date().getMonth();
  const year = new Date().getFullYear();


  const categories = user?.categories || {};

  // ✅ Filter current month expenses
  const monthlyExpenses = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === month && d.getFullYear() === year && t.type === "expense"
    );
  });

  // ✅ Total spent
  const totalSpent = monthlyExpenses.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  const percentSpent = user?.budget > 0 ? (totalSpent / user.budget) * 100 : 0;

  // ✅ Spending by category (safe + strict)
  const spendingByCategory = {};
  EXPENSE_CATEGORIES.forEach((c) => (spendingByCategory[c] = 0));

  monthlyExpenses.forEach((t) => {
    const cat = EXPENSE_CATEGORIES.includes(t.category) ? t.category : "Other";
    spendingByCategory[cat] += Number(t.amount || 0);
  });

  const getColor = (percent) => {
    if (percent > 90) return "bg-red-500";
    if (percent > 70) return "bg-orange-400";
    return "bg-green-500";
  };

  const getMonthName = (m) =>
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][m];

  return (
    <motion.div
      className="space-y-8 p-6"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* SUMMARY */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          💼 {getMonthName(month)} {year} Budget Summary
        </h2>

        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-lg font-bold">
              {user.currency} {user.budget.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Spent</p>
            <p className="text-lg font-bold">
              {user.currency} {totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-4 ${getColor(percentSpent)}`}
            initial={{ width: 0 }}
            animate={{
              width: animate ? `${Math.min(100, percentSpent)}%` : "0%",
            }}
            transition={{ duration: 1 }}
          />
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span>
            Remaining: {user.currency} {(user.budget - totalSpent).toFixed(2)}
          </span>
          <span className="font-bold">{percentSpent.toFixed(0)}% spent</span>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>

        <div className="space-y-4">
          {EXPENSE_CATEGORIES.map((category, i) => {
            const budgeted = Number(categories[category] || 0);
            const spent = spendingByCategory[category];
            const percent = budgeted > 0 ? (spent / budgeted) * 100 : 0;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category}</span>
                  <span>
                    {user.currency} {spent.toFixed(2)} / {user.currency}{" "}
                    {budgeted.toFixed(2)}
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-2 ${getColor(percent)}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: animate ? `${Math.min(100, percent)}%` : "0%",
                    }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default BudgetProgress;
