import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './Login.css';

const API_URL2 = 'http://localhost/quantguru/api/phpapi.php';

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      }
    };
    handleOAuthRedirect();
  }, [navigate]);

  const handleSignInClick = () => {
    document.getElementById("container").classList.remove("right-panel-active");
    setIsResetPassword(false);
  };

  const handleSignUpClick = () => {
    document.getElementById("container").classList.add("right-panel-active");
    setIsResetPassword(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(API_URL2, { action: 'login', email, password });
      if (response.data.success) {
        alert('Login successful!');
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('token', response.data.id);
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!email) {
      alert('Please enter your email');
      return;
    }
    try {
      const response = await axios.post(API_URL2, { action: 'send-otp', email, name, password });
      if (response.data.success) {
        setIsOtpSent(true);
        alert('OTP sent to your email. Please check and enter the OTP to complete signup.');
      } else {
        alert(`Sending OTP failed1: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);
      alert(`Sending OTP failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(API_URL2, { action: 'verify-otp', email, otp });
      if (response.data.success) {
        setIsOtpVerified(true);
        alert('OTP verified successfully. You can now complete your signup.');
      } else {
        alert(`OTP verification failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error('OTP verification failed:', error.response?.data || error.message);
      alert(`OTP verification failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCompleteSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(API_URL2, { action: 'finalize-signup', email });
      if (response.data.success) {
        alert('Signup successful. Please sign in.');
        navigate('/signin');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Signup failed:', error.response?.data || error.message);
      alert(`Signup failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleRequestResetPassword = async (event) => {
    event.preventDefault();
    if (!email) {
      alert('Please enter your email');
      return;
    }
    try {
      await axios.post(API_URL2, { action: 'request-reset-password', email });
      setIsOtpSent(true);
      alert('OTP sent to your email. Please check and enter the OTP to reset your password.');
    } catch (error) {
      console.error('Request reset password failed:', error.response?.data || error.message);
      alert(`Request reset password failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleVerifyOTPForReset = async (event) => {
    event.preventDefault();
    try {
      await axios.post(API_URL2, { action: 'verify-otp', email, otp });
      alert('Password reset successfully. You can now log in with your new credentials.');
      setIsResetPassword(false);
      handleSignInClick();
    } catch (error) {
      console.error('OTP verification failed:', error.response?.data || error.message);
      alert(`OTP verification failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsResetPassword(true);
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(API_URL2, { action: 'send-otp', email });
      alert('OTP resent. Please check your email.');
    } catch (error) {
      console.error('Resending OTP failed:', error.response?.data || error.message);
      alert(`Resending OTP failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login-page">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={isOtpVerified ? handleCompleteSignup : handleSendOtp}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                onClick={handleTogglePasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            {isOtpSent && (
              <div className="otp-section">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button type="button" onClick={handleVerifyOTP}>
                  Verify OTP
                </button>
                <button type="button" onClick={handleResendOTP}>
                  Resend OTP
                </button>
              </div>
            )}
            <button type="submit">
              {isOtpVerified ? "Complete Signup" : "Sign Up"}
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                onClick={handleTogglePasswordVisibility}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <a href="#forgot-password" onClick={handleForgotPasswordClick}>
              Forgot your password?
            </a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="form-container forgot-password-container">
          <form onSubmit={isOtpSent ? handleVerifyOTPForReset : handleRequestResetPassword}>
            <h1>Reset Password</h1>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {isOtpSent && (
              <div className="otp-section">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button type="button" onClick={handleVerifyOTPForReset}>
                  Verify OTP
                </button>
                <button type="button" onClick={handleResendOTP}>
                  Resend OTP
                </button>
              </div>
            )}
            <button type="submit">
              {isOtpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
