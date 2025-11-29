import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Chapter 1: Foundations',
      items: [
        'chapter-01-foundations/lesson-01-intro-embodied-intelligence',
        'chapter-01-foundations/lesson-02-robotics-landscape',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: ROS 2 Fundamentals',
      items: [
        'chapter-02-ros2/lesson-01-ros2-architecture',
        'chapter-02-ros2/lesson-02-nodes-topics-services',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Simulation',
      items: [
        'chapter-03-simulation/lesson-01-gazebo-setup',
        'chapter-03-simulation/lesson-02-urdf-sdf-formats',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
