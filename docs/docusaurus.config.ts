import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  // --- PROJECT METADATA CHANGES ---
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Comprehensive textbook for Physical AI and Humanoid Robotics course',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // --- GITHUB DEPLOYMENT / HOSTING CHANGES ---
  // Set the production url of your site here
  // *** CHANGE 1: Update the URL to your GitHub Pages URL ***
  url: 'https://YourNewUsername.github.io', 
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // *** CHANGE 2: Update the base URL to your repository name (with leading/trailing slashes) ***
  baseUrl: '/docusaurus-site/', 

  // GitHub pages deployment config.
  // *** CHANGE 3: Update organizationName to your GitHub Username ***
  organizationName: 'YourNewUsername', 
  // *** CHANGE 4: Update projectName to your Repository Name ***
  projectName: 'my-cloned-docusaurus-site', 

  // Deployment branch configuration
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
  },

  // Custom fields for ChatWidget API configuration (KEEPING ORIGINAL)
  customFields: {
    chatbotApiUrl: process.env.CHATBOT_API_URL || 'https://naimalcreativityai-physical-ai-chatbot-api.hf.space/api',
  },


  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Edit this page links
          // *** CHANGE 5: Update the editUrl to your new repo path ***
          editUrl:
            'https://github.com/YourNewUsername/docusaurus-site/tree/master/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Edit this page links
          // *** CHANGE 6: Update the editUrl for the blog to your new repo path ***
          editUrl:
            'https://github.com/YourNewUsername/docusaurus-site/tree/master/docs/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Robotics',
      // logo: {
      //   alt: 'Physical AI & Robotics Logo',
      //   src: 'img/docusaurus.png', 
      // },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        // Language selector shown for logged-out users, hidden for logged-in via CSS
        {
          type: 'localeDropdown',
          position: 'right',
          className: 'navbar-locale-dropdown',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              // *** CHANGE 7: Update the GitHub link in the footer ***
              href: 'https://github.com/YourNewUsername/docusaurus-site',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Textbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;