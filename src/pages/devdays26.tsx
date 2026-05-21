import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './devdays26.module.css';

type ShowcaseCard = {
  title: string;
  downloads: string;
  description: string;
  author: string;
};

const cards: ShowcaseCard[] = [
  {
    title: 'WinCC OA MCP Server',
    downloads: '261 downloads',
    description: 'AI assistant integration via Model Context Protocol',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA Script Actions',
    downloads: '725 downloads',
    description: 'Run CTRL scripts directly from VS Code',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA Project Admin',
    downloads: '3.9K downloads',
    description: 'Project management, status monitoring, manager control',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA Test Explorer',
    downloads: '271 downloads',
    description: 'Unit test integration for VS Code',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA LogViewer',
    downloads: '327 downloads',
    description: 'Real-time log analysis',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA Debugger',
    downloads: '20 downloads',
    description: 'Debug adapter for CTRL scripts',
    author: 'winccoa-tools-pack',
  },
  {
    title: 'WinCC OA DP Inspector',
    downloads: '77 downloads',
    description: 'Live datapoint monitoring & charts',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA Tools Package',
    downloads: '70 downloads',
    description: 'Extension bundle for developers',
    author: 'winccoa-tools-pack',
  },
  {
    title: 'WinCC OA Database Explorer',
    downloads: '28 downloads',
    description: 'Browse and edit datapoints',
    author: 'winccoa-tools-pack',
  },
  {
    title: 'WinCC OA CTRL Language Support',
    downloads: '591 downloads',
    description: 'Syntax highlighting & code navigation',
    author: 'RichardJanisch',
  },
  {
    title: 'WinCC OA UI Panel Viewer',
    downloads: '117 downloads',
    description: 'Read-only UI panel viewer',
    author: 'winccoa-tools-pack',
  },
];

export default function DevDays26(): ReactNode {
  return (
    <Layout title="DevDays 2026" description="WinCC OA Open Source Showcase">
      <main className={styles.page}>
        <header className={styles.header}>
          <Heading as="h1" className={styles.h1}>
            WinCC OA Open Source Showcase
          </Heading>
          <div className={styles.subtitle}>
            3 engineers · 11 extensions · 3.9K+ downloads · AI-driven tools
          </div>
        </header>

        <section className={styles.centerSection}>
          <Heading as="h2" className={styles.h2}>
            Why Open Source?
          </Heading>
          <p>"If no one can use it, it might as well not exist."</p>
          <p className={styles.highlight}>
            Now imagine your tools integrated into editors, CI pipelines, and AI workflows.
          </p>
        </section>

        <section className={styles.grid}>
          {cards.map((card) => (
            <div key={card.title} className={styles.card}>
              <Heading as="h3" className={styles.h3}>
                {card.title}
              </Heading>
              <div className={styles.downloads}>{card.downloads}</div>
              <p>{card.description}</p>
              <div className={styles.author}>{card.author}</div>
            </div>
          ))}
        </section>

        <footer className={styles.footer}>
          <p className={styles.highlight}>3 people. 3 months. Thousands of downloads.</p>
          <p>Now imagine what we can build together.</p>
          <p>Visit our microfair · Try it · Join the community</p>
        </footer>
      </main>
    </Layout>
  );
}
