import { useState } from 'react';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: name === 'email' ? validateEmail(value) : validatePassword(value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: name === 'email' ? validateEmail(value) : validatePassword(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    setTouched({
      email: true,
      password: true,
    });

    // Check if form is valid
    if (!emailError && !passwordError) {
      // Form is valid - no implementation as per requirements
      console.log('Form submitted:', formData);
    }
  };

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={touched.email && errors.email ? 'input-error' : ''}
              aria-invalid={touched.email && errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email && (
              <span id="email-error" className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className={touched.password && errors.password ? 'input-error' : ''}
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {touched.password && errors.password && (
              <span id="password-error" className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>
          <button type="submit" className="login-button" disabled={!isFormValid}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
