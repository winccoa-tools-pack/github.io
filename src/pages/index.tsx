import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/tools">
            Browse Tools
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/success-stories">
            Success Stories
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/about/martin-pokorny">
            About
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <section className="container padding-vert--lg">
          <Heading as="h2">Your WinCC OA development, modernized</Heading>
          <p>
            Professional project management and development tools for Siemens WinCC Open Architecture. Made with ❤️ for and by the WinCC OA community
          </p>
        </section>

        <section className="container padding-vert--lg">
          <div className={styles.grid}>
            <div className={styles.card}>
              <Heading as="h3">Tools</Heading>
              <p>One ecosystem, many repositories — each tool has its own story and valuable use cases.</p>
              <Link to="/docs/tools">Go to Tools</Link>
            </div>
            <div className={styles.card}>
              <Heading as="h3">Cookbooks</Heading>
              <p>Practical, copy-pasteable recipes for CI/CD, Node.js, linting, and more - to make the WinCC OA soup taste just right.</p>
              <Link to="/docs/cookbooks">Go to Cookbooks</Link>
            </div>
            <div className={styles.card}>
              <Heading as="h3">Our Vision</Heading>
              <p>See what we’re building next, driven by real feature requests - we have a lot of exciting plans!</p>
              <Link to="/docs/vision">Go to Vision</Link>
            </div>
          </div>
        </section>

        <section className="container padding-vert--lg">
          <Heading as="h2">Highlights</Heading>
          <ul>
            <li><strong>Modern Development Experience</strong> — bring WinCC OA development into the modern IDE era</li>
            <li><strong>Increased Productivity</strong> — automate repetitive tasks and streamline workflows</li>
            <li><strong>Better Code Quality</strong> — built-in formatting, linting, and analysis</li>
            <li><strong>Comprehensive Testing</strong> — integrated test execution and reporting</li>
            <li><strong>Team Collaboration</strong> — Git integration and standardized project structures</li>
            <li><strong>Multi-Project Support</strong> — manage multiple WinCC OA projects simultaneously</li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}
