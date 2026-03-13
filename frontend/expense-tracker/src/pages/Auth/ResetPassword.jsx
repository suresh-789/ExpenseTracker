import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle Reset Password Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp || !password) {
      setError("Please fill in all fields.");
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
        API_PATHS.AUTH.RESET_PASSWORD,
        { email, otp, newPassword: password }
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
        <h3 className="text-xl font-semibold text-black">Reset Password</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter the OTP sent to your email and create a new password
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          
          <Input
            value={otp}
            onChange={({ target }) => setOtp(target.value)}
            label="OTP (6 digits)"
            placeholder="Enter OTP"
            type="text"
          />
          
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
