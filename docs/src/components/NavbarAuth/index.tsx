/**
 * Navbar Authentication Component
 * Displays Sign In/Sign Up when logged out, Profile Dropdown when logged in
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAuth } from '@site/src/contexts/AuthContext';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function NavbarAuth() {
  const { user, loading, signout } = useAuth();
  const { siteConfig, i18n } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();
  const location = useLocation();
  const baseUrl = siteConfig.baseUrl || '/';
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale and alternate locale
  const currentLocale = i18n.currentLocale;
  const alternateLocale = currentLocale === 'en' ? 'ur' : 'en';
  const localeLabel = currentLocale === 'en' ? 'اردو' : 'English';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return null; // Don't show anything while checking auth
  }

  if (user) {
    // User is logged in - show dropdown menu
    return (
      <div className={styles.userDropdownContainer} ref={dropdownRef}>
        <button 
          className={styles.userButton}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-label="User menu"
        >
          <span className={styles.userIcon}>👤</span>
          <span className={styles.userName}>{user.name}</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            className={styles.dropdownArrow}
          >
            <path 
              d="M2 4l4 4 4-4" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className={styles.dropdownMenu}>
            {/* Translation */}
            <Link
              to={`${baseUrl}${alternateLocale}${location.pathname.replace(baseUrl, '').replace(/^\/(en|ur)\//, '/')}`}
              className={styles.dropdownItem}
              onClick={() => setDropdownOpen(false)}
            >
              <span className={styles.dropdownIcon}>🌐</span>
              <span>{localeLabel}</span>
            </Link>

            {/* GitHub */}
            <a 
              href={`https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.dropdownItem}
            >
              <span className={styles.dropdownIcon}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </span>
              <span>GitHub</span>
            </a>

            {/* Theme Toggle */}
            <button 
              className={styles.dropdownItem}
              onClick={() => {
                setColorMode(colorMode === 'dark' ? 'light' : 'dark');
              }}
            >
              <span className={styles.dropdownIcon}>
                {colorMode === 'dark' ? '☀️' : '🌙'}
              </span>
              <span>{colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className={styles.dropdownDivider} />

            {/* Sign Out */}
            <button 
              className={`${styles.dropdownItem} ${styles.signoutItem}`}
              onClick={() => {
                setDropdownOpen(false);
                signout();
              }}
            >
              <span className={styles.dropdownIcon}>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // User is not logged in
  return (
    <div className={styles.authContainer}>
      <Link to={`${baseUrl}signin`} className={styles.signinLink}>
        <span className={styles.signinIcon}>👤</span>
        <span className={styles.signinText}>Sign In</span>
      </Link>
      <Link to={`${baseUrl}signup`} className={styles.signupButton}>
        Sign Up
      </Link>
    </div>
  );
}
