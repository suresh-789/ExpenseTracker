import React, { useState, useEffect } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome, initialData }) => {

  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      setIncome({
        source: initialData.source || "",
        amount: initialData.amount || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        icon: initialData.icon || "",
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setIncome({
      ...income,
      [key]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!income.source || !income.amount || !income.date) {
      alert("Please fill all fields");
      return;
    }

    onAddIncome(income);

    // Only reset if not editing (i.e., if no initialData)
    if (!initialData) {
      setIncome({
        source: "",
        amount: "",
        date: "",
        icon: "",
      });
    }
  };

  const handleButtonClick = () => {
    if (!income.source || !income.amount || !income.date) {
      alert("Please fill all fields");
      return;
    }
    onAddIncome(income);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Emoji Picker */}
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) =>
          handleChange("icon", selectedIcon)
        }
      />

      {/* Income Source */}
      <Input
        value={income.source}
        onChange={({ target }) =>
          handleChange("source", target.value)
        }
        label="Income Source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />

      {/* Amount */}
      <Input
        value={income.amount}
        onChange={({ target }) =>
          handleChange("amount", target.value)
        }
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />

      {/* Date */}
      <Input
        value={income.date}
        onChange={({ target }) =>
          handleChange("date", target.value)
        }
        label="Date"
        placeholder=""
        type="date"
      />

      {/* Button */}
      <div className="flex justify-end mt-6">
       <button
            type="button"
            className="add-btn add-btn-fill"
            onClick={handleButtonClick}
            >
          {initialData ? "Update Income" : "Add Income"}
        </button>
      </div>

    </form>
  );
};

export default AddIncomeForm;
