---
sidebar_position: 1
title: ROS 2 Architecture & Core Concepts
description: Understanding the Robot Operating System 2 architecture and middleware fundamentals
---

# ROS 2 Architecture & Core Concepts

## Introduction

Why do thousands of robotics companies—from Stanford research labs to NASA to billion-dollar startups—use the same software backbone? Because reinventing communication protocols, sensor drivers, and control loops for every robot is like rebuilding the internet infrastructure for every website you create. It's wasteful, error-prone, and prevents us from standing on the shoulders of giants.

Before ROS (Robot Operating System), every robotics project started from scratch. Teams spent months writing custom code just to get a camera and motor controller to talk to each other. When ROS 1 launched in 2007, it revolutionized research robotics by providing shared infrastructure. But as robots moved from labs to factories, homes, and streets, ROS 1's limitations became clear—no real-time guarantees, security vulnerabilities, and poor multi-robot support.

Enter ROS 2 (2017-present): a complete redesign built on industry-standard DDS (Data Distribution Service) middleware, offering real-time performance, security, and scalability. Today, it powers humanoid robots like Unitree's H1 and G1 series, NASA's Valkyrie, and Agility Robotics' Digit delivery robot. For modern humanoid robotics—where you're coordinating 30+ joints, fusing data from dozens of sensors, and maintaining dynamic balance—ROS 2 isn't optional. It's the nervous system that lets you focus on robot behavior instead of infrastructure plumbing.

## Learning Objectives

By the end of this lesson, you will be able to:

- Explain ROS 2 architecture as middleware and how it differs from an operating system
- Differentiate between topics, services, and actions—and know when to use each communication pattern
- Understand why ROS 2 (not ROS 1) is essential for production-grade humanoid robots

## Key Concepts

### ROS 2 as Middleware

ROS 2 is not an operating system despite its name—it's a middleware framework that runs on top of Linux, Windows, or macOS. Think of it as a specialized communication layer that sits between your robot hardware and your application logic, similar to how HTTP is the communication standard for web applications.

At its core, ROS 2 uses DDS (Data Distribution Service), an industry-standard publish-subscribe protocol designed for real-time distributed systems in aerospace, defense, and automotive industries. DDS provides the backbone for node-to-node communication with configurable quality-of-service guarantees.

What does ROS 2 provide? Communication infrastructure for inter-process messaging, device drivers for common sensors (cameras, LiDAR, IMUs) and actuators, common libraries for tasks like visualization (RViz), simulation (Gazebo integration), and logging, plus build tools (colcon) that handle dependencies across hundreds of packages. Consider Unitree's H1 humanoid: it uses ROS 2 to coordinate separate controllers for each leg, integrate IMU balance data, and fuse stereo camera feeds—all without custom communication protocols.

> 💡 **Why Middleware?**: Middleware separates application logic from hardware details. Want to upgrade from a Realsense D435 camera to a D455? With ROS 2, your perception code doesn't change—just swap the driver node. This modularity accelerates development and enables code reuse across robot platforms.

### Publish-Subscribe Communication with Topics

The publish-subscribe pattern is ROS 2's primary communication mechanism. Publishers send messages to named topics; subscribers receive messages from topics they're interested in. Critically, publishers and subscribers don't know about each other—they're decoupled, communicating only through the topic name and message type.

This decoupling enables powerful architectures. A camera node publishes images to the `/camera/image_raw` topic. Multiple nodes can simultaneously subscribe: an object detector analyzing for obstacles, a mapping node building a 3D environment model, and a logging node recording data for later analysis. If one subscriber crashes, the others continue unaffected.

ROS 2 enhances this pattern with Quality of Service (QoS) policies. You can configure reliability (best-effort for high-frequency sensor data where dropped messages are acceptable, or reliable for critical commands), history depth (keep only the latest message, or buffer the last N messages), and durability. For real-time systems like humanoid balance control, topic communication achieves sub-millisecond latency on modern hardware.

Consider Agility Robotics' Digit: its LiDAR node publishes 3D point clouds to `/scan` at 10 Hz. The Nav2 navigation stack subscribes to this topic for obstacle detection. Simultaneously, a safety monitor subscribes to detect collisions, and a data logger archives scans. Each subscriber operates independently, and adding new subscribers doesn't modify existing nodes.

> ⚠️ **Design Choice**: Use topics for continuous data streams—sensor readings, joint states, odometry. Topics are fire-and-forget communication. If you need request-reply semantics or acknowledgment of completion, use services or actions instead.

### Services and Actions for Request-Reply Control

While topics handle streaming data, services and actions provide request-reply communication for configuration and control tasks.

**Services** offer synchronous request-reply: a client node sends a request and blocks waiting for the server's response. Services are ideal for quick operations like querying robot state, configuring sensor parameters, or triggering one-time events. Example: a `/set_joint_position` service might accept a target joint angle and return success/failure. The request completes in milliseconds, and the client knows immediately if it succeeded.

**Actions** extend services for long-running tasks. An action client sends a goal, then asynchronously receives periodic feedback and a final result. Critically, actions support cancellation—the client can abort mid-execution. This pattern perfectly fits navigation tasks, manipulation sequences, and trajectory execution where the robot needs minutes to complete a task and you want progress updates.

Example: NASA Valkyrie uses the `/navigate_to_pose` action for humanoid locomotion. The client sends a target pose (position + orientation). As Valkyrie walks, it sends feedback every second: current pose, distance remaining, estimated time. If a human steps into the path, the client cancels the action, and Valkyrie stops immediately. When the destination is reached, the final result message confirms success.

> 📊 **Communication Pattern Selection**:
> - **Topics**: Continuous sensor streams (camera, LiDAR, IMU) → Use when you don't need acknowledgment
> - **Services**: Quick configuration requests (set parameter, trigger calibration) → Use for less than 1 second operations that return a result
> - **Actions**: Long-running tasks with progress (navigation, pick-and-place) → Use when you need feedback and cancellation

## Hands-on Exercise

**Prerequisites:**
- ROS 2 Humble installed (or access to ROS 2 Docker container)
- Basic command-line familiarity
- Terminal application

**Activity: Explore ROS 2 Communication Patterns**

1. **Start ROS 2 demo nodes** (in separate terminals):

```bash
# Terminal 1: Start a talker node (publishes to /chatter topic)
ros2 run demo_nodes_cpp talker

# Terminal 2: Start a listener node (subscribes to /chatter topic)
ros2 run demo_nodes_cpp listener
```

2. **Inspect active topics**:

```bash
# Terminal 3: List all active topics
ros2 topic list

# View details of /chatter topic (message type, publishers, subscribers)
ros2 topic info /chatter

# Echo messages being published to /chatter
ros2 topic echo /chatter
```

3. **Explore nodes and their relationships**:

```bash
# List running nodes
ros2 node list

# Show what the talker node is doing (publications, subscriptions, services)
ros2 node info /talker
```

4. **Experiment with services**:

```bash
# List available services
ros2 service list

# Call a service to spawn a new turtle in turtlesim (if running)
ros2 service call /spawn turtlesim/srv/Spawn "{x: 5.0, y: 5.0, theta: 0.0, name: 'turtle2'}"
```

**Expected Outcome:**

You should observe the decoupled nature of ROS 2 communication—talker and listener nodes communicate through the `/chatter` topic without direct connection. Try stopping the listener; the talker continues publishing. This demonstrates how ROS 2's publish-subscribe pattern enables modular, fault-tolerant robot systems. Understanding these inspection commands is essential for debugging real robot systems.

## Quiz

Test your understanding of this lesson:

1. What is ROS 2's relationship to the underlying operating system?
   - A) ROS 2 is a real-time operating system that replaces Linux
   - B) ROS 2 is middleware that runs on top of Linux/Windows/macOS
   - C) ROS 2 is a programming language for robots
   - D) ROS 2 is a hardware specification for robot computers

2. When should you use a ROS 2 topic versus a service?
   - A) Topics for infrequent configuration requests; services for continuous sensor data
   - B) Topics for continuous data streams; services for request-reply operations
   - C) Topics and services are interchangeable
   - D) Topics for local communication; services for network communication

3. What makes ROS 2 actions different from services?
   - A) Actions are faster than services
   - B) Actions support feedback during execution and can be canceled
   - C) Actions use a different programming language
   - D) Actions only work on humanoid robots

<details>
<summary>Show Answers</summary>

1. **B** - ROS 2 is middleware that runs on top of Linux/Windows/macOS. It's not an operating system itself, but rather a framework providing communication infrastructure and libraries that sit between the OS and your robot application code. The "Operating System" in the name is historical—it refers to providing common services that most robot projects need.

2. **B** - Topics for continuous data streams; services for request-reply operations. Topics use publish-subscribe for streaming sensor data, joint states, and odometry where you don't need acknowledgment. Services use request-reply for operations like configuring parameters or querying state where you need a response confirming the operation completed.

3. **B** - Actions support feedback during execution and can be canceled. Unlike services (which block until completion), actions are asynchronous and send periodic feedback messages as the task progresses. This is essential for long-running operations like navigation or manipulation where you want progress updates and the ability to abort mid-execution if circumstances change.

</details>

## Key Takeaways

- **ROS 2 is middleware, not an OS**: It provides communication infrastructure, drivers, and libraries on top of Linux/Windows, letting you focus on robot behavior instead of low-level plumbing.
- **Master the three communication patterns**: Topics for continuous streams (sensors, state), Services for quick request-reply (configuration), Actions for long-running tasks with feedback (navigation, manipulation). Choosing the right pattern is fundamental to robust robot architecture.
- **DDS enables production-grade robotics**: ROS 2's switch from custom protocols to industry-standard DDS gives you real-time performance, security, and multi-robot scalability—requirements for deploying humanoids outside research labs.
- **Decoupling enables modularity**: Publish-subscribe architecture means nodes don't directly depend on each other. Swap sensors, add new algorithms, or scale to multiple robots without rewriting existing code.

## Further Reading

- [ROS 2 Official Documentation (Humble)](https://docs.ros.org/en/humble/) - Comprehensive reference for concepts, tutorials, and API documentation
- [The Construct: ROS 2 Fundamentals Course](https://www.theconstructsim.com/robotigniteacademy_learnros/ros-courses-library/) - Interactive tutorials with simulated robots
- [Robotics Backend: Understanding DDS in ROS 2](https://roboticsbackend.com/what-is-dds-ros2/) - Deep-dive into the DDS middleware layer
- [Nav2 Documentation](https://navigation.ros.org/) - Real-world example of ROS 2 actions for robot navigation

---

**Next Lesson**: [Nodes, Topics, and Services](./lesson-02-nodes-topics-services.md)

