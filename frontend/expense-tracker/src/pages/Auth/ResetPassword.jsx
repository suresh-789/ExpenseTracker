import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Reset Password Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.RESET_PASSWORD(token),
        { newPassword: password }
      );
      
      if (response.data.message) {
        setSuccess(response.data.message);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">New Password</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your new password below
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="New Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          
          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          {success && <p className="text-green-500 text-xs pb-2.5">{success}</p>}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Resetting..." : "RESET PASSWORD"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
