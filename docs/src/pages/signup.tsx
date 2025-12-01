/**
 * User Signup Page with Background Collection
 * Collects user credentials and learning background information
 */

import React, { useState } from 'react';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useAuth } from '@site/src/contexts/AuthContext';
import styles from './signup.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    software_experience: 'Beginner',
    hardware_experience: 'Beginner',
    programming_languages: [] as string[],
    robotics_background: '',
    learning_goals: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const programmingLanguageOptions = [
    'Python',
    'C++',
    'JavaScript',
    'Java',
    'C',
    'ROS',
    'MATLAB',
    'Go',
    'Rust',
    'Other',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        background: {
          software_experience: formData.software_experience,
          hardware_experience: formData.hardware_experience,
          programming_languages: formData.programming_languages,
          robotics_background: formData.robotics_background || undefined,
          learning_goals: formData.learning_goals || undefined,
        },
      });

      // Redirect to home on success
      history.push(baseUrl);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => {
      const languages = prev.programming_languages;
      if (languages.includes(lang)) {
        return {
          ...prev,
          programming_languages: languages.filter((l) => l !== lang),
        };
      } else {
        return {
          ...prev,
          programming_languages: [...languages, lang],
        };
      }
    });
  };

  return (
    <Layout title="Sign Up" description="Create your account">
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <h1>Create Your Account</h1>
          <p className={styles.subtitle}>
            Join to personalize your learning experience in Physical AI & Robotics
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Account Information */}
            <div className={styles.section}>
              <h2>Account Information</h2>

              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password *</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? styles.inputError : ''}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className={errors.confirmPassword ? styles.inputError : ''}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className={styles.error}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Background Information */}
            <div className={styles.section}>
              <h2>Your Background</h2>
              <p className={styles.sectionDescription}>
                Help us personalize content to match your experience level
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="softwareExp">Software Experience *</label>
                <select
                  id="softwareExp"
                  value={formData.software_experience}
                  onChange={(e) =>
                    setFormData({ ...formData, software_experience: e.target.value })
                  }
                >
                  <option value="Beginner">Beginner - New to programming</option>
                  <option value="Intermediate">
                    Intermediate - Some programming experience
                  </option>
                  <option value="Advanced">Advanced - Experienced developer</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hardwareExp">Hardware Experience *</label>
                <select
                  id="hardwareExp"
                  value={formData.hardware_experience}
                  onChange={(e) =>
                    setFormData({ ...formData, hardware_experience: e.target.value })
                  }
                >
                  <option value="Beginner">Beginner - No hardware experience</option>
                  <option value="Intermediate">
                    Intermediate - Some electronics/robotics work
                  </option>
                  <option value="Advanced">Advanced - Extensive hardware projects</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Programming Languages (Select all that apply)</label>
                <div className={styles.checkboxGrid}>
                  {programmingLanguageOptions.map((lang) => (
                    <label key={lang} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.programming_languages.includes(lang)}
                        onChange={() => handleLanguageToggle(lang)}
                      />
                      <span>{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="roboticsBackground">
                  Robotics Background (Optional)
                </label>
                <textarea
                  id="roboticsBackground"
                  placeholder="Tell us about any robotics projects or courses you've worked on..."
                  value={formData.robotics_background}
                  onChange={(e) =>
                    setFormData({ ...formData, robotics_background: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="learningGoals">Learning Goals (Optional)</label>
                <textarea
                  id="learningGoals"
                  placeholder="What do you hope to learn from this course?"
                  value={formData.learning_goals}
                  onChange={(e) =>
                    setFormData({ ...formData, learning_goals: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            {serverError && (
              <div className={styles.serverError}>
                <strong>Error:</strong> {serverError}
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.signinLink}>
            Already have an account? <a href={`${baseUrl}signin`}>Sign in</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
