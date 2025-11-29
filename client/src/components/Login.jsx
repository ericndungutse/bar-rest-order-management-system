import { useState } from 'react';
import { useLogin, useUser } from '../hooks/useAuth';

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

  const { data: userData } = useUser();
  const loginMutation = useLogin();

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
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  // Get error message from mutation error
  const getApiError = () => {
    if (!loginMutation.error) return '';
    const error = loginMutation.error;
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message === 'Network Error') {
      return 'Unable to connect to server. Please try again later.';
    }
    return 'Login failed. Please try again.';
  };

  const isFormValid = !errors.email && !errors.password && formData.email && formData.password;
  const isLoading = loginMutation.isPending;
  const apiError = getApiError();
  const loginSuccess = loginMutation.isSuccess && userData?.user;

  return (
    <div className="flex justify-center items-center min-h-screen w-full p-4 bg-gray-900">
      <div className="bg-gray-800 rounded-xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm" role="alert">
              {apiError}
            </div>
          )}
          {loginSuccess && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm" role="alert">
              Login successful! Welcome, {userData.user.name}!
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              disabled={isLoading}
              className={`px-4 py-3 border rounded-lg text-base bg-gray-900 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                touched.email && errors.email
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-invalid={touched.email && errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {touched.email && errors.email && (
              <span id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              disabled={isLoading}
              className={`px-4 py-3 border rounded-lg text-base bg-gray-900 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                touched.password && errors.password
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-invalid={touched.password && errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {touched.password && errors.password && (
              <span id="password-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.password}
              </span>
            )}
          </div>
          <button
            type="submit"
            className={`mt-2 py-3 rounded-lg text-base font-semibold text-white transition-all duration-200 ${
              isFormValid && !isLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] cursor-pointer'
                : 'bg-gray-600 cursor-not-allowed opacity-70'
            }`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
