import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TypedTextComponent from "../components/TypedTextComponent"
// import Typed from 'typed.js';
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaCog,
  FaRocket,
  FaComments,
  FaPlug,
} from "react-icons/fa";
import { motion } from "framer-motion";



const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [showSignup, setShowSignup] = useState(false);  // New state for signup
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for forgot password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // For phone number input in signup
  const [error, setError] = useState("");
  const { login, loginWithGoogle, signup, resetPassword } = useAuth();
  const navigate = useNavigate();
  const features = [
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "Contact Management",
      description:
        "Efficiently organize and manage your customer relationships with our intuitive contact management system.",
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: "Sales Pipeline Tracking",
      description:
        "Track and optimize your sales process with our comprehensive pipeline management tools.",
    },
    {
      icon: <FaCog className="text-4xl text-blue-600" />,
      title: "Task Automation",
      description:
        "Automate repetitive tasks and workflows to boost your team's productivity.",
    },
    {
      icon: <FaRocket className="text-4xl text-blue-600" />,
      title: "Analytics & Reporting",
      description:
        "Make data-driven decisions with powerful analytics and customizable reports.",
    },
    {
      icon: <FaComments className="text-4xl text-blue-600" />,
      title: "Customer Communication",
      description:
        "Stay connected with your customers through integrated communication channels.",
    },
    {
      icon: <FaPlug className="text-4xl text-blue-600" />,
      title: "Integration Capabilities",
      description:
        "Seamlessly integrate with your favorite tools and applications.",
    },
  ];
  const pricingPlans = [
    {
      name: "Starter",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Basic CRM features",
        "Up to 1,000 contacts",
        "Email support",
        "Basic reporting",
      ],
    },
    {
      name: "Professional",
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        "Advanced CRM features",
        "Unlimited contacts",
        "Priority support",
        "Advanced analytics",
        "API access",
      ],
    },
    {
      name: "Enterprise",
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        "Custom solutions",
        "Dedicated support",
        "Custom integrations",
        "Advanced security",
        "Training",
      ],
    },
  ];

  async function handleLoginSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to log in");
      console.error(err);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (phone) {
        // Sign up with phone number
        await signup({ phone });
      } else {
        // Sign up with email and password
        await signup({ email, password });
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign up");
      console.error(err);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setError("Password reset link sent to your email.");
    } catch (err) {
      setError("Failed to reset password");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <nav className="flex space-x-8  justify-center items-center">
              <a href="#features" className="text-gray-600 hover:text-blue-600">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">
                Pricing
              </a>
              <a
                href="#solutions"
                className="text-gray-600 hover:text-blue-600"
              >
                Solutions
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </a>
              <button class="relative group overflow-hidden px-6 h-12 rounded-full flex space-x-2 items-center bg-gradient-to-r from-pink-500 to-purple-500 hover:to-purple-600" onClick={() => setShowLogin(true)}>
                <span class="relative text-sm text-white">Get Started</span>
                <div class="flex items-center -space-x-3 translate-x-3">
                  <div class="w-2.5 h-[1.6px] rounded bg-white origin-left scale-x-0 transition duration-300 group-hover:scale-x-100"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 stroke-white -translate-x-2 transition duration-300 group-hover:translate-x-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </nav>
            {/* Mobile menu login button */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pb-4 md:grid-flow-row  md:gap-4">
                <nav className="flex flex-col space-y-4">
                  <a
                    href="#features"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Pricing
                  </a>
                  <a
                    href="#solutions"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Solutions
                  </a>
                  <a
                    href="#contact"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Contact
                  </a>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLogin(true);
                    }}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Login
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </form>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Sign in with Google
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
              <br />
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
                className="text-blue-600 hover:underline"
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
              <button
                onClick={() => setShowSignup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email (or Phone Number)
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* Phone Number Input */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {error && (
              <div className="text-red-500 mb-4 text-center">{error}</div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter your email
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rest of the landing page content (keep all existing sections) */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Business with AdvertCRM.
              </h1>
              <p className="mb-8 bg-gradient-to-r from-fuchsia-500 via-violet-600 to-pink-500 bg-clip-text text-transparent text-2xl">
               <TypedTextComponent/>
              </p>
              <button className="relative group overflow-hidden px-6 h-12 rounded-full flex space-x-2 items-center bg-gradient-to-r from-pink-500 to-purple-500 hover:to-purple-600 text-white">
                Start Free Trial
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1552581234-26160f608093"
                alt="CRM Dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features for Your Business
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>

          <div className="flex justify-center mb-8">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 rounded-md ${
                  !isAnnual ? "bg-white shadow-md" : ""
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  isAnnual ? "bg-white shadow-md" : ""
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  <span className="text-base font-normal text-gray-600">
                    /{isAnnual ? "year" : "month"}
                  </span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of successful businesses using our CRM solution
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#press" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#blog" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#help" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#docs" className="hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#privacy" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#gdpr" className="hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>© 2024 CRM System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
