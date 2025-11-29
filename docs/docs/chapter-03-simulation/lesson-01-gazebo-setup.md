---
sidebar_position: 1
title: Gazebo Simulation Environment Setup
description: Setting up Gazebo for physics simulation and understanding robot description formats
---

# Gazebo Simulation Environment Setup

## Introduction

Breaking a $100,000 humanoid robot because your balance controller had a bug is expensive. Crashing a virtual robot in Gazebo and restarting in 5 seconds is free. This fundamental asymmetry is why simulation has become the first deployment target for every robotics algorithm—from academic research to commercial products.

Hardware development is inherently slow (fabrication takes weeks), expensive (sensor suites cost thousands), and fragile (one bad command can cause mechanical damage). Simulation flips these constraints: iterate on algorithms in minutes, test dangerous scenarios safely, and reproduce experiments with perfect consistency. When NASA tests Valkyrie's manipulation tasks for the International Space Station, they simulate thousands of scenarios in Gazebo before touching the real robot. When Unitree develops walking controllers for their bipedal humanoids, they spend 90% of development time in simulation.

The evolution from Gazebo Classic (2012-2022) to modern Gazebo (formerly called Ignition, 2019-present) reflects robotics' growing sophistication—better physics engines for contact dynamics, photorealistic rendering for vision algorithms, and seamless ROS 2 integration. For humanoid robotics specifically, Gazebo excels at simulating the complex foot-ground contact forces that make bipedal locomotion so challenging.

This lesson introduces you to Gazebo as the bridge between theoretical algorithms and physical hardware—where you develop, test, and validate before deploying to reality.

## Learning Objectives

By the end of this lesson, you will be able to:

- Set up a Gazebo simulation environment integrated with ROS 2 for robot development
- Understand SDF and URDF formats for defining robot models, including geometry, kinematics, and dynamics
- Configure sensor plugins (camera, LiDAR, IMU) with realistic noise models to simulate perception systems

## Key Concepts

### Physics Engines and Simulation Fidelity

Gazebo doesn't compute physics itself—it delegates to specialized physics engines that solve the differential equations governing rigid body dynamics. You can choose between ODE (Open Dynamics Engine, fast but less accurate), Bullet (balanced performance), and DART (Dynamic Animation and Robotics Toolkit, slow but highly accurate for complex contacts). Each makes different trade-offs between computational speed and physical realism.

What does a physics engine simulate? Rigid body dynamics (how forces cause acceleration), collision detection (when two objects intersect), contact forces (the reaction forces when colliding objects touch), and joint constraints (keeping linked bodies together). The real-time factor measures simulation speed: 1.0 means simulation runs at real-world speed, 2.0 means twice as fast, 0.5 means half-speed (common for complex humanoids).

Tuning simulation parameters is critical for behavior transfer. Consider simulating Unitree's H1 humanoid walking: if foot-floor friction is too low, the robot slips unrealistically; too high, and foot scuffing causes instability. You must tune contact parameters (friction coefficients, contact stiffness) and time step size (smaller = more accurate but slower) to match real-world behavior. Getting this right is the difference between controllers that work in sim but fail on hardware versus those that transfer successfully.

> 💡 **The Sim-to-Real Gap**: Simulation is never perfect. Good simulations achieve 70-90% behavior transfer to real hardware—meaning controllers developed entirely in simulation work reasonably well on real robots after minor tuning. Closing the remaining gap requires techniques like domain randomization (varying physics parameters during training) and system identification (measuring real robot properties to match simulation).

### SDF/URDF Robot Description Formats

Robots in Gazebo are defined using XML files that specify everything from geometry to mass distribution. ROS uses URDF (Unified Robot Description Format), which defines robots as trees of links (rigid bodies) connected by joints. Gazebo natively uses SDF (Simulation Description Format), which is a superset of URDF—it can describe not just robots but entire worlds, including lighting, physics parameters, and sensor configurations.

A robot's structure consists of links and joints. Links are rigid bodies with properties like mass, center-of-mass offset, and inertia tensors (how mass is distributed). Each link has two representations: visual geometry (detailed meshes for rendering, can be high-polygon) and collision geometry (simplified shapes for physics computation, should be low-complexity). Joints connect links and define degrees of freedom—revolute joints (1D rotation, like elbows), prismatic joints (1D linear motion, like telescoping), or fixed joints (rigidly connected).

Example: defining a humanoid robot's torso. The link element specifies mass (10 kg), inertia matrix (resistance to rotation), a detailed mesh for visualization (`torso.dae`), and a simplified cylinder for collision detection. Attaching leg joints to this torso link creates the kinematic tree. The key insight: separating visual and collision geometry dramatically improves simulation performance while maintaining realistic appearance.

> ⚠️ **Common Mistake**: Using high-polygon visual meshes (100K+ triangles) for collision geometry causes simulation to crawl at less than 0.1x real-time. Always use simplified collision shapes—boxes, cylinders, convex hulls with fewer than 1000 triangles. The simulation only "sees" collision geometry for physics; visual geometry is just for rendering.

### Sensor Simulation and Noise Models

Gazebo simulates the sensors that robots use to perceive their environment. Camera sensors produce RGB images, depth maps (distance to every pixel), and semantic segmentation (if using specialized plugins). LiDAR sensors generate 2D laser scans (think Hokuyo sweeping in a plane) or 3D point clouds (Velodyne-style spinning lasers). IMU sensors provide linear acceleration and angular velocity—absolutely essential for humanoid balance control, which relies on detecting tilting in real-time.

Critically, simulated sensors include noise models. Real sensors don't provide perfect data—camera images have noise, LiDAR has range uncertainty, IMUs drift over time. Gazebo lets you configure Gaussian noise parameters (mean, standard deviation) for each sensor to match real-world characteristics. This prevents the common pitfall of developing perception algorithms on perfect simulated data that fail when deployed to noisy real sensors.

ROS 2 integration happens through the `ros_gz_bridge`—a translator that publishes simulated sensor data to standard ROS 2 topics. To your perception algorithms, simulated camera data on `/camera/image_raw` looks identical to data from a real RealSense camera. This enables seamless sim-to-real transfer: develop your object detector on simulated images, then deploy to real hardware by simply changing the launch file (no code modifications).

> 📊 **Sensor Data Flow**: Gazebo sensor plugin generates data → `ros_gz_bridge` translates to ROS 2 message → Published to topic (e.g., `/scan`, `/camera/image_raw`) → Your perception node subscribes and processes. The perception node doesn't know if data comes from simulation or real hardware—this abstraction is powerful.

## Hands-on Exercise

**Prerequisites:**
- Ubuntu 22.04 (or Ubuntu 20.04 with modifications)
- ROS 2 Humble installed (or Foxy for Ubuntu 20.04)
- Gazebo installed: `sudo apt install ros-humble-ros-gz`
- Completion of Lesson 2.1 (ROS 2 fundamentals)

**Activity: Launch Gazebo and Inspect Sensor Data**

1. **Launch example simulation world**:

```bash
# Source ROS 2 environment
source /opt/ros/humble/setup.bash

# Launch a Gazebo world with a robot (using demo package)
ros2 launch ros_gz_sim empty_world.launch.py
```

The Gazebo GUI should launch, showing an empty world. You can insert models from the left panel.

2. **Insert a robot with sensors**:
- In Gazebo GUI, go to the Insert tab
- Find "Simple Robot with Camera" or similar model
- Click to place in the world

3. **Inspect ROS 2 topics from simulation**:

```bash
# Open new terminal, list active topics
ros2 topic list

# You should see simulated sensor topics like:
# /camera/image_raw
# /camera/depth/image_raw
# /scan (if robot has LiDAR)
```

4. **Visualize camera data**:

```bash
# Install image viewer if needed
sudo apt install ros-humble-rqt-image-view

# Launch image viewer
ros2 run rqt_image_view rqt_image_view

# Select /camera/image_raw from dropdown
```

5. **Echo LiDAR data (if available)**:

```bash
ros2 topic echo /scan --once
```

You'll see a `LaserScan` message with arrays of range measurements—same format as real LiDAR!

6. **Inspect robot description**:

```bash
# View the robot's URDF/SDF definition
ros2 topic echo /robot_description --once
```

This prints the XML defining the robot's structure.

**Expected Outcome:**

You should see Gazebo simulating a robot with sensors, publishing data to ROS 2 topics using the exact same message types as real hardware. This demonstrates the key principle: perception and control algorithms can be developed on simulated data, then deployed to real robots by changing only the launch file—no code changes required. The interface (ROS 2 topics) remains identical.

## Quiz

Test your understanding of this lesson:

1. What is the primary benefit of using Gazebo for humanoid robot development?
   - A) Gazebo simulations run 10x faster than real-time
   - B) Test dangerous behaviors safely and iterate quickly before deploying to expensive hardware
   - C) Gazebo has better graphics than reality
   - D) ROS 2 requires using Gazebo

2. Which file format is used to define a robot's physical structure in Gazebo?
   - A) JSON configuration file
   - B) Python script defining classes
   - C) SDF or URDF XML file specifying links, joints, and sensors
   - D) Binary robot model file

3. Why must visual and collision geometries be different for robot models?
   - A) Visual geometry is for humans to see; collision geometry is for physics calculation and must be simplified for performance
   - B) Visual geometry is required by ROS; collision geometry is required by Gazebo
   - C) They must actually be identical
   - D) Collision geometry is only used during robot crashes

<details>
<summary>Show Answers</summary>

1. **B** - Test dangerous behaviors safely and iterate quickly before deploying to expensive hardware. Simulation lets you crash robots, test edge cases, and try thousands of scenarios without risking physical damage or waiting for hardware fabrication. While speed and graphics are factors, the primary value is safe, rapid iteration.

2. **C** - SDF or URDF XML file specifying links, joints, and sensors. URDF (Unified Robot Description Format) is the ROS standard; SDF (Simulation Description Format) is Gazebo's native format and a superset of URDF. Both are XML files that declaratively define robot structure—the geometry, kinematics (how parts move), dynamics (mass, inertia), and attached sensors.

3. **A** - Visual geometry is for humans to see; collision geometry is for physics calculation and must be simplified for performance. Visual meshes can be highly detailed (100K+ triangles) for realistic rendering. Collision meshes must be simple (preferably primitives like boxes/cylinders, or fewer than 1000 triangle convex hulls) because the physics engine evaluates them every simulation step. Using complex visual meshes for collision causes simulation to become unbearably slow.

</details>

## Key Takeaways

- **Simulation enables safe, rapid iteration**: Develop and test algorithms in Gazebo before deploying to expensive humanoid hardware, reducing risk and development time by an order of magnitude.
- **Physics engines trade accuracy for speed**: Choose ODE for fast prototyping, Bullet for balanced performance, or DART for high-fidelity contact dynamics. Tune parameters to match real-world behavior and minimize the sim-to-real gap.
- **Robot descriptions separate visual and collision geometry**: Detailed meshes for rendering, simplified shapes for physics. This separation is critical for performance—simulations with improper collision geometry can run 100x slower.
- **Simulated sensors use the same ROS 2 interface as real hardware**: The `ros_gz_bridge` publishes sensor data to standard topics, allowing perception and control code to work unchanged between simulation and reality. This abstraction accelerates development and enables reproducible research.

## Further Reading

- [Gazebo Official Documentation](https://gazebosim.org/docs) - Complete installation guides, tutorials, and API reference for modern Gazebo
- [ROS 2 + Gazebo Integration Tutorial](https://docs.ros.org/en/humble/Tutorials/Advanced/Simulators/Gazebo/Gazebo.html) - Official ROS documentation on ros_gz_bridge and simulation workflows
- [SDF Format Specification](http://sdformat.org/) - Complete XML schema for robot and world descriptions
- [Gazebo Building a Robot Tutorial](https://gazebosim.org/docs/latest/building_robot/) - Step-by-step guide to creating custom robot models with sensors

---

**Next Lesson**: [URDF and SDF Formats](./lesson-02-urdf-sdf-formats.md)

