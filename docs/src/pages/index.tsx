import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Physical AI & Humanoid Robotics Textbook
        </Heading>
        <p className="hero__subtitle">Master the Future of Intelligent Machines – From Theory to Real-World Application</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview"> {/* Link to your overview page */}
            Start Learning Now!
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageIntroSection(): ReactNode {
  return (
    <section className={styles.sectionPadding}>
      <div className="container text--center">
        <Heading as="h2" className={styles.sectionTitle}>
          Welcome to the World of Embodied Intelligence
        </Heading>
        <p className="hero__subtitle">
          Explore comprehensive lessons on the foundational concepts, advanced architectures, and practical applications
          of physical artificial intelligence and humanoid robotics. Whether you're an aspiring engineer, a seasoned researcher,
          or simply curious about the future of AI, this textbook provides a guided journey into building and understanding
          intelligent systems that interact with the physical world.
        </p>
        <div className={styles.buttons} style={{marginTop: '20px'}}>
          <Link
            className="button button--primary button--outline button--lg"
            to="/docs/chapter-01-foundations/lesson-01-intro-embodied-intelligence">
            Dive into Chapter 1
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home | ${siteConfig.title}`} // Updated title for the home page
      description="Comprehensive textbook for Physical AI and Humanoid Robotics course. Master the future of intelligent machines.">
      <HomepageHeader />
      <main>
        <HomepageIntroSection /> {/* Add the new intro section */}
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

