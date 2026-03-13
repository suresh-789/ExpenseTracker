import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense, initialData }) => {

  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      setExpense({
        category: initialData.category || "",
        amount: initialData.amount || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setExpense({
      ...expense,
      [key]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense(expense);
  };

  const handleButtonClick = () => {
    onAddExpense(expense);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="Rent, Groceries, etc"
        type="text"
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder=""
        type="number"
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleButtonClick}
        >
          {initialData ? "Update Expense" : "Add Expense"}
        </button>
      </div>

    </form>
  );
};

export default AddExpenseForm;
