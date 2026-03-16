import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'WinCC OA Tools Pack',
  tagline: 'Modern tooling for WinCC OA',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://winccoa-tools-pack.github.io',
  baseUrl: '/',

  organizationName: 'winccoa-tools-pack',
  projectName: 'winccoa-tools-pack.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/winccoa-tools-pack/winccoa-tools-pack.github.io/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WinCC OA Tools Pack',
      logo: {
        alt: 'WinCC OA Tools Pack Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/cookbooks',
          position: 'left',
          label: 'Cookbooks',
        },
        {
          to: '/docs/vision',
          position: 'left',
          label: 'Vision',
        },
        {
          to: '/docs/tools',
          label: 'Tools',
          position: 'left',
        },
        {
          label: 'Contribute',
          position: 'left',
          items: [
            {
              label: 'Support (Discussions)',
              href: 'https://github.com/orgs/winccoa-tools-pack/discussions',
            },
            {
              label: 'Projects',
              href: 'https://github.com/orgs/winccoa-tools-pack/projects',
            },
          ],
        },
        {to: '/docs/success-stories', label: 'Success Stories', position: 'left'},
        {to: '/docs/team', label: 'Team', position: 'left'},
        {
          href: 'https://marketplace.visualstudio.com/items?itemName=mPokornyETM.wincc-oa-projects',
          label: 'VS Code Marketplace',
          position: 'right',
        },
        {
          href: 'https://github.com/winccoa-tools-pack',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Cookbooks', to: '/docs/cookbooks'},
            {label: 'Vision', to: '/docs/vision'},
            {label: 'Tools', to: '/docs/tools'},
            {label: 'Success Stories', to: '/docs/success-stories'},
            {label: 'Team', to: '/docs/team'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Founder', to: '/docs/about/martin-pokorny'},
            {label: 'License', to: '/docs/community/license'},
            {label: 'Disclaimer', to: '/docs/community/disclaimer'},
            {
              label: 'Support (Discussions)',
              href: 'https://github.com/orgs/winccoa-tools-pack/discussions',
            },
            {
              label: 'Projects',
              href: 'https://github.com/orgs/winccoa-tools-pack/projects',
            },
            {label: 'GitHub Org', href: 'https://github.com/winccoa-tools-pack'},
            {
              label: 'VS Code Marketplace',
              href: 'https://marketplace.visualstudio.com/items?itemName=mPokornyETM.wincc-oa-projects',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website Repo',
              href: 'https://github.com/winccoa-tools-pack/winccoa-tools-pack.github.io',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} winccoa-tools-pack. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
