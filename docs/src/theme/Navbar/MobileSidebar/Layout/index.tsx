/**
 * Swizzled Mobile Sidebar Layout to add auth items
 */
import React, { version } from 'react';
import clsx from 'clsx';
import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useAuth } from '@site/src/contexts/AuthContext';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';

// TODO Docusaurus v4: remove temporary inert workaround
function inertProps(inert: boolean) {
  const isBeforeReact19 = parseInt(version.split('.')[0], 10) < 19;
  if (isBeforeReact19) {
    return { inert: inert ? ('' as any) : undefined };
  }
  return { inert };
}

function NavbarMobileSidebarPanel({
  children,
  inert,
}: {
  children: React.ReactNode;
  inert: boolean;
}) {
  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.panel,
        'navbar-sidebar__item menu',
      )}
      {...inertProps(inert)}>
      {children}
    </div>
  );
}

function MobileAuthItems() {
  const { user, loading, signout } = useAuth();
  const { siteConfig } = useDocusaurusContext();
  const { colorMode, setColorMode } = useColorMode();
  const baseUrl = siteConfig.baseUrl || '/';

  if (loading) {
    return null;
  }

  return (
    <div style={{ padding: '1rem 0', borderTop: '1px solid var(--ifm-color-emphasis-200)' }}>
      {!user ? (
        <>
          {/* Sign Up Button for non-logged-in users */}
          <Link
            to={`${baseUrl}signup`}
            className="mobile-signup-link"
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              textAlign: 'center',
              margin: '0.5rem 1rem',
            }}>
            Sign Up
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
            className="menu__link"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
            }}>
            <span style={{ fontSize: '1.2rem' }}>
              {colorMode === 'dark' ? '☀️' : '🌙'}
            </span>
            <span>{colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* GitHub Link */}
          <a
            href={`https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="menu__link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
            }}>
            <span style={{ fontSize: '1.2rem' }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </span>
            <span>GitHub</span>
          </a>
        </>
      ) : (
        <>
          {/* User Profile Info */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--ifm-color-emphasis-200)',
            }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
              👤 {user.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)' }}>
              {user.email}
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={signout}
            className="menu__link"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              color: 'var(--ifm-color-danger)',
            }}>
            <span style={{ fontSize: '1.2rem' }}>🚪</span>
            <span>Sign Out</span>
          </button>
        </>
      )}
    </div>
  );
}

export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu,
  secondaryMenu,
}: {
  header: React.ReactNode;
  primaryMenu: React.ReactNode;
  secondaryMenu: React.ReactNode;
}) {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu();

  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.container,
        'navbar-sidebar',
      )}>
      {header}
      <div
        className={clsx('navbar-sidebar__items', {
          'navbar-sidebar__items--show-secondary': secondaryMenuShown,
        })}>
        <NavbarMobileSidebarPanel inert={secondaryMenuShown}>
          {primaryMenu}
          {/* Add auth items at the bottom of primary menu */}
          <MobileAuthItems />
        </NavbarMobileSidebarPanel>
        <NavbarMobileSidebarPanel inert={!secondaryMenuShown}>
          {secondaryMenu}
        </NavbarMobileSidebarPanel>
      </div>
    </div>
  );
}

