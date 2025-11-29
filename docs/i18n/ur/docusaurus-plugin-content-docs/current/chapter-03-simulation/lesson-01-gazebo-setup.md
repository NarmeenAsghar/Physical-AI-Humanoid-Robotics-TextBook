---
sidebar_position: 1
title: Gazebo Simulation Environment Setup
description: طبیعیات کی simulation کے لیے Gazebo کو سیٹ اپ کرنا اور روبوٹ کی تفصیل کے فارمیٹس کو سمجھنا
---

# Gazebo Simulation Environment Setup

## تعارف

ایک $100,000 ہیومنائیڈ روبوٹ کو توڑنا کیونکہ آپ کے balance controller میں ایک bug تھا مہنگا ہے۔ Gazebo میں ایک virtual روبوٹ کو crash کرنا اور 5 سیکنڈ میں دوبارہ شروع کرنا مفت ہے۔ یہ بنیادی عدم توازن اس وجہ سے ہے کہ simulation ہر روبوٹکس الگورتھم کے لیے پہلا تعیناتی ہدف بن گیا ہے—تعلیمی تحقیق سے لے کر تجارتی مصنوعات تک۔

ہارڈویئر کی ترقی فطری طور پر سست ہے (fabrication ہفتے لیتا ہے)، مہنگی ہے (sensor suites ہزاروں کی لاگت آتی ہیں)، اور نازک ہے (ایک غلط کمانڈ مکینیکل نقصان کا سبب بن سکتی ہے)۔ Simulation ان محدودیتوں کو پلٹ دیتا ہے: منٹوں میں الگورتھم پر تکرار کریں، خطرناک منظرناموں کو محفوظ طریقے سے جانچیں، اور کامل مستقل مزاجی کے ساتھ تجربات کو دوبارہ پیدا کریں۔ جب NASA بین الاقوامی خلائی سٹیشن کے لیے Valkyrie کے manipulation کاموں کا تجربہ کرتا ہے، تو وہ حقیقی روبوٹ کو چھونے سے پہلے Gazebo میں ہزاروں منظرناموں کی simulation کرتے ہیں۔ جب Unitree اپنے دو پاؤں والے ہیومنائیڈز کے لیے چلنے کے کنٹرولرز تیار کرتا ہے، تو وہ ترقی کے وقت کا 90% simulation میں گزارتے ہیں۔

Gazebo Classic (2012-2022) سے جدید Gazebo (سابقہ Ignition، 2019-موجودہ) میں ارتقاء روبوٹکس کی بڑھتی ہوئی نفاست کی عکاسی کرتا ہے—contact dynamics کے لیے بہتر physics engines، vision algorithms کے لیے photorealistic rendering، اور بغیر کسی رکاوٹ کے ROS 2 انضمام۔ خاص طور پر ہیومنائیڈ روبوٹکس کے لیے، Gazebo پیچیدہ پاؤں-زمین contact forces کی simulation میں بہترین کارکردگی دکھاتا ہے جو دو پاؤں کی locomotion کو اتنا چیلنجنگ بناتے ہیں۔

یہ سبق آپ کو Gazebo سے نظریاتی الگورتھم اور جسمانی ہارڈویئر کے درمیان پل کے طور پر متعارف کراتا ہے—جہاں آپ حقیقت میں تعینات کرنے سے پہلے تیار کرتے، جانچتے، اور توثیق کرتے ہیں۔

## سیکھنے کے مقاصد

اس سبق کے اختتام تک، آپ قابل ہوں گے:

- روبوٹ کی ترقی کے لیے ROS 2 کے ساتھ مربوط Gazebo simulation ماحول کو سیٹ اپ کرنا
- روبوٹ ماڈلز کی تعریف کے لیے SDF اور URDF فارمیٹس کو سمجھنا، بشمول geometry، kinematics، اور dynamics
- perception سسٹمز کی simulation کے لیے حقیقت پسند noise models کے ساتھ sensor plugins configure کرنا

## کلیدی تصورات

### Physics Engines اور Simulation Fidelity

Gazebo خود طبیعیات کا حساب نہیں لگاتا—یہ خصوصی physics engines کو delegate کرتا ہے جو rigid body dynamics کو کنٹرول کرنے والی differential equations کو حل کرتے ہیں۔ آپ ODE (Open Dynamics Engine، تیز لیکن کم درست)، Bullet (متوازن کارکردگی)، اور DART (Dynamic Animation and Robotics Toolkit، سست لیکن پیچیدہ contacts کے لیے انتہائی درست) کے درمیان انتخاب کر سکتے ہیں۔ ہر ایک computational رفتار اور جسمانی حقیقت پسندی کے درمیان مختلف trade-offs کرتا ہے۔

ایک physics engine کیا simulate کرتا ہے؟ Rigid body dynamics (قوتیں کس طرح رفتار کا سبب بنتی ہیں)، collision detection (جب دو اشیاء intersect ہوتی ہیں)، contact forces (رد عمل کی قوتیں جب ٹکرانے والی اشیاء چھوتی ہیں)، اور joint constraints (جڑے ہوئے bodies کو ایک ساتھ رکھنا)۔ حقیقی وقت کا عنصر simulation کی رفتار کی پیمائش کرتا ہے: 1.0 کا مطلب ہے simulation حقیقی دنیا کی رفتار سے چلتا ہے، 2.0 کا مطلب دو گنا تیز ہے، 0.5 کا مطلب آدھی رفتار ہے (پیچیدہ ہیومنائیڈز کے لیے عام)۔

Simulation parameters کو tune کرنا رویے کی منتقلی کے لیے اہم ہے۔ Unitree کے H1 ہیومنائیڈ کے چلنے کی simulation پر غور کریں: اگر پاؤں-فرش کی رگڑ بہت کم ہے، تو روبوٹ غیر حقیقی طور پر پھسلتا ہے؛ بہت زیادہ ہے، تو پاؤں کا scuffing عدم استحکام کا سبب بنتا ہے۔ آپ کو حقیقی دنیا کے رویے سے ملانے کے لیے contact parameters (friction coefficients، contact stiffness) اور time step size (چھوٹا = زیادہ درست لیکن سست) کو tune کرنا ضروری ہے۔ اسے صحیح کرنا sim میں کام کرنے والے لیکن ہارڈویئر پر ناکام ہونے والے کنٹرولرز اور کامیابی سے منتقل ہونے والوں کے درمیان فرق ہے۔

> 💡 **The Sim-to-Real Gap**: Simulation کبھی کامل نہیں ہے۔ اچھے simulations حقیقی ہارڈویئر میں 70-90% رویے کی منتقلی حاصل کرتے ہیں—یعنی مکمل طور پر simulation میں تیار کیے گئے کنٹرولرز معمولی tuning کے بعد حقیقی روبوٹس پر معقول طریقے سے کام کرتے ہیں۔ باقی gap کو بند کرنے کے لیے domain randomization (تربیت کے دوران physics parameters کو مختلف کرنا) اور system identification (simulation سے ملانے کے لیے حقیقی روبوٹ کی خصوصیات کی پیمائش) جیسی تکنیکوں کی ضرورت ہوتی ہے۔

### SDF/URDF Robot Description Formats

Gazebo میں روبوٹس XML فائلوں کا استعمال کرتے ہوئے تعریف کیے جاتے ہیں جو geometry سے لے کر mass distribution تک سب کچھ بیان کرتے ہیں۔ ROS URDF (Unified Robot Description Format) استعمال کرتا ہے، جو روبوٹس کو joints کے ذریعے جڑے links (rigid bodies) کے درختوں کے طور پر بیان کرتا ہے۔ Gazebo بنیادی طور پر SDF (Simulation Description Format) استعمال کرتا ہے، جو URDF کا superset ہے—یہ نہ صرف روبوٹس بلکہ پوری دنیاؤں کو بیان کر سکتا ہے، بشمول lighting، physics parameters، اور sensor configurations۔

روبوٹ کی ساخت links اور joints پر مشتمل ہوتی ہے۔ Links rigid bodies ہیں جن میں mass، center-of-mass offset، اور inertia tensors (mass کی تقسیم) جیسی خصوصیات ہیں۔ ہر link کی دو نمائندگی ہیں: visual geometry (rendering کے لیے تفصیلی meshes، high-polygon ہو سکتی ہیں) اور collision geometry (physics computation کے لیے آسان shapes، low-complexity ہونی چاہیے)۔ Joints links کو جوڑتے ہیں اور degrees of freedom کی تعریف کرتے ہیں—revolute joints (1D rotation، جیسے کہنیاں)، prismatic joints (1D linear motion، جیسے telescoping)، یا fixed joints (سختی سے جڑے)۔

مثال: ایک ہیومنائیڈ روبوٹ کے torso کی تعریف۔ link element mass (10 kg)، inertia matrix (rotation کے خلاف مزاحمت)، visualization کے لیے ایک تفصیلی mesh (`torso.dae`)، اور collision detection کے لیے ایک آسان cylinder بیان کرتا ہے۔ اس torso link سے leg joints منسلک کرنا kinematic tree بناتا ہے۔ کلیدی بصیرت: visual اور collision geometry کو الگ کرنا حقیقت پسند ظاہری شکل برقرار رکھتے ہوئے simulation کی کارکردگی کو نمایاں طور پر بہتر بناتا ہے۔

> ⚠️ **عام غلطی**: collision geometry کے لیے high-polygon visual meshes (100K+ triangles) استعمال کرنا simulation کو 0.1x حقیقی وقت سے کم پر رینگنے کا سبب بنتا ہے۔ ہمیشہ آسان collision shapes استعمال کریں—boxes، cylinders، 1000 triangles سے کم کے ساتھ convex hulls۔ Simulation physics کے لیے صرف collision geometry "دیکھتا" ہے؛ visual geometry صرف rendering کے لیے ہے۔

### Sensor Simulation اور Noise Models

Gazebo ان sensors کی simulation کرتا ہے جو روبوٹس اپنے ماحول کو سمجھنے کے لیے استعمال کرتے ہیں۔ Camera sensors RGB تصاویر، depth maps (ہر pixel تک فاصلہ)، اور semantic segmentation (اگر خصوصی plugins استعمال کرتے ہیں) پیدا کرتے ہیں۔ LiDAR sensors 2D laser scans (Hokuyo کو ایک plane میں sweeping کرتے ہوئے سوچیں) یا 3D point clouds (Velodyne طرز کے گھومنے والے lasers) پیدا کرتے ہیں۔ IMU sensors linear acceleration اور angular velocity فراہم کرتے ہیں—ہیومنائیڈ balance control کے لیے بالکل ضروری، جو حقیقی وقت میں جھکاؤ کا پتہ لگانے پر انحصار کرتا ہے۔

اہم بات، simulated sensors میں noise models شامل ہیں۔ حقیقی sensors کامل ڈیٹا فراہم نہیں کرتے—camera تصاویر میں noise ہوتا ہے، LiDAR میں range غیر یقینی ہوتی ہے، IMUs وقت کے ساتھ drift کرتے ہیں۔ Gazebo آپ کو حقیقی دنیا کی خصوصیات سے ملانے کے لیے ہر sensor کے لیے Gaussian noise parameters (mean، standard deviation) configure کرنے دیتا ہے۔ یہ کامل simulated ڈیٹا پر perception algorithms تیار کرنے کے عام نقصان کو روکتا ہے جو noisy حقیقی sensors پر تعینات ہونے پر ناکام ہو جاتے ہیں۔

ROS 2 انضمام `ros_gz_bridge` کے ذریعے ہوتا ہے—ایک مترجم جو simulated sensor ڈیٹا کو معیاری ROS 2 topics پر publish کرتا ہے۔ آپ کے perception algorithms کے لیے، `/camera/image_raw` پر simulated camera ڈیٹا حقیقی RealSense کیمرے کے ڈیٹا جیسا نظر آتا ہے۔ یہ بغیر کسی رکاوٹ کے sim-to-real منتقلی کو قابل بناتا ہے: simulated تصاویر پر اپنا object detector تیار کریں، پھر صرف launch فائل تبدیل کرکے حقیقی ہارڈویئر پر تعینات کریں (کوئی کوڈ modifications نہیں)۔

> 📊 **Sensor Data Flow**: Gazebo sensor plugin ڈیٹا تخلیق کرتا ہے → `ros_gz_bridge` ROS 2 message میں ترجمہ کرتا ہے → Topic پر publish کیا جاتا ہے (مثلاً، `/scan`، `/camera/image_raw`) → آپ کا perception node subscribe کرتا ہے اور process کرتا ہے۔ Perception node نہیں جانتا کہ ڈیٹا simulation سے آتا ہے یا حقیقی ہارڈویئر سے—یہ abstraction طاقتور ہے۔

## عملی مشق

**ضروریات:**
- Ubuntu 22.04 (یا modifications کے ساتھ Ubuntu 20.04)
- ROS 2 Humble نصب (یا Ubuntu 20.04 کے لیے Foxy)
- Gazebo نصب: `sudo apt install ros-humble-ros-gz`
- Lesson 2.1 (ROS 2 fundamentals) کی تکمیل

**سرگرمی: Gazebo Launch کریں اور Sensor Data کا معائنہ کریں**

1. **مثال کی simulation world launch کریں**:

```bash
# ROS 2 environment source کریں
source /opt/ros/humble/setup.bash

# ایک روبوٹ کے ساتھ Gazebo world launch کریں (demo package استعمال کرتے ہوئے)
ros2 launch ros_gz_sim empty_world.launch.py
```

Gazebo GUI launch ہونا چاہیے، ایک خالی دنیا دکھاتے ہوئے۔ آپ بائیں panel سے models داخل کر سکتے ہیں۔

2. **Sensors کے ساتھ ایک روبوٹ داخل کریں**:
- Gazebo GUI میں، Insert tab پر جائیں
- "Simple Robot with Camera" یا اسی طرح کا ماڈل تلاش کریں
- دنیا میں رکھنے کے لیے کلک کریں

3. **Simulation سے ROS 2 topics کا معائنہ کریں**:

```bash
# نیا terminal کھولیں، فعال topics کی فہرست بنائیں
ros2 topic list

# آپ کو simulated sensor topics نظر آنے چاہئیں جیسے:
# /camera/image_raw
# /camera/depth/image_raw
# /scan (اگر روبوٹ میں LiDAR ہے)
```

4. **Camera ڈیٹا کو visualize کریں**:

```bash
# ضرورت ہو تو image viewer نصب کریں
sudo apt install ros-humble-rqt-image-view

# Image viewer launch کریں
ros2 run rqt_image_view rqt_image_view

# Dropdown سے /camera/image_raw منتخب کریں
```

5. **LiDAR ڈیٹا echo کریں (اگر دستیاب ہو)**:

```bash
ros2 topic echo /scan --once
```

آپ کو range measurements کے arrays کے ساتھ ایک `LaserScan` پیغام نظر آئے گا—حقیقی LiDAR جیسا ہی فارمیٹ!

6. **روبوٹ کی تفصیل کا معائنہ کریں**:

```bash
# روبوٹ کی URDF/SDF تعریف دیکھیں
ros2 topic echo /robot_description --once
```

یہ روبوٹ کی ساخت کی تعریف کرنے والا XML print کرتا ہے۔

**متوقع نتیجہ:**

آپ کو Gazebo sensors کے ساتھ ایک روبوٹ کی simulation کرتے ہوئے نظر آنا چاہیے، حقیقی ہارڈویئر جیسے message types استعمال کرتے ہوئے ROS 2 topics پر ڈیٹا publish کرتے ہوئے۔ یہ کلیدی اصول کو ظاہر کرتا ہے: perception اور control algorithms simulated ڈیٹا پر تیار کیے جا سکتے ہیں، پھر صرف launch فائل تبدیل کرکے حقیقی روبوٹس پر تعینات کیے جا سکتے ہیں—کوڈ میں کوئی تبدیلی درکار نہیں۔ Interface (ROS 2 topics) یکساں رہتا ہے۔

## کوئز

اس سبق کی اپنی سمجھ کو جانچیں:

1. ہیومنائیڈ روبوٹ کی ترقی کے لیے Gazebo استعمال کرنے کا بنیادی فائدہ کیا ہے؟
   - A) Gazebo simulations حقیقی وقت سے 10 گنا تیز چلتے ہیں
   - B) خطرناک رویوں کو محفوظ طریقے سے جانچیں اور مہنگے ہارڈویئر پر تعینات کرنے سے پہلے تیزی سے تکرار کریں
   - C) Gazebo میں حقیقت سے بہتر graphics ہیں
   - D) ROS 2 کو Gazebo استعمال کرنے کی ضرورت ہے

2. Gazebo میں روبوٹ کی جسمانی ساخت کی تعریف کے لیے کون سا file format استعمال ہوتا ہے؟
   - A) JSON configuration فائل
   - B) Classes کی تعریف کرنے والی Python script
   - C) SDF یا URDF XML فائل جو links، joints، اور sensors بیان کرتی ہے
   - D) Binary روبوٹ ماڈل فائل

3. روبوٹ ماڈلز کے لیے visual اور collision geometries مختلف کیوں ہونی چاہئیں؟
   - A) Visual geometry انسانوں کے دیکھنے کے لیے ہے؛ collision geometry physics calculation کے لیے ہے اور کارکردگی کے لیے آسان ہونی چاہیے
   - B) Visual geometry ROS کے لیے ضروری ہے؛ collision geometry Gazebo کے لیے ضروری ہے
   - C) وہ درحقیقت یکساں ہونی چاہئیں
   - D) Collision geometry صرف روبوٹ کے crashes کے دوران استعمال ہوتی ہے

<details>
<summary>جوابات دکھائیں</summary>

1. **B** - خطرناک رویوں کو محفوظ طریقے سے جانچیں اور مہنگے ہارڈویئر پر تعینات کرنے سے پہلے تیزی سے تکرار کریں۔ Simulation آپ کو روبوٹس کو crash کرنے، edge cases جانچنے، اور جسمانی نقصان یا ہارڈویئر fabrication کے انتظار کے خطرے کے بغیر ہزاروں منظرناموں کی کوشش کرنے دیتا ہے۔ جبکہ رفتار اور graphics عوامل ہیں، بنیادی قدر محفوظ، تیز تکرار ہے۔

2. **C** - SDF یا URDF XML فائل جو links، joints، اور sensors بیان کرتی ہے۔ URDF (Unified Robot Description Format) ROS معیار ہے؛ SDF (Simulation Description Format) Gazebo کا مقامی format ہے اور URDF کا superset ہے۔ دونوں XML فائلیں ہیں جو declaratively روبوٹ کی ساخت کی تعریف کرتی ہیں—geometry، kinematics (حصے کیسے حرکت کرتے ہیں)، dynamics (mass، inertia)، اور منسلک sensors۔

3. **A** - Visual geometry انسانوں کے دیکھنے کے لیے ہے؛ collision geometry physics calculation کے لیے ہے اور کارکردگی کے لیے آسان ہونی چاہیے۔ Visual meshes حقیقت پسند rendering کے لیے انتہائی تفصیلی (100K+ triangles) ہو سکتی ہیں۔ Collision meshes آسان ہونی چاہئیں (ترجیحاً primitives جیسے boxes/cylinders، یا 1000 triangle سے کم convex hulls) کیونکہ physics engine انہیں ہر simulation step پر evaluate کرتا ہے۔ Collision کے لیے پیچیدہ visual meshes استعمال کرنا simulation کو ناقابل برداشت حد تک سست بنا دیتا ہے۔

</details>

## کلیدی نکات

- **Simulation محفوظ، تیز تکرار کو قابل بناتا ہے**: مہنگے ہیومنائیڈ ہارڈویئر پر تعینات کرنے سے پہلے Gazebo میں algorithms تیار اور جانچیں، خطرہ اور ترقی کا وقت ایک order of magnitude تک کم کرتے ہوئے۔
- **Physics engines درستگی کے لیے رفتار کا سودا کرتے ہیں**: تیز prototyping کے لیے ODE، متوازن کارکردگی کے لیے Bullet، یا اعلی-fidelity contact dynamics کے لیے DART منتخب کریں۔ حقیقی دنیا کے رویے سے ملانے اور sim-to-real gap کو کم کرنے کے لیے parameters کو tune کریں۔
- **روبوٹ کی تفصیلات visual اور collision geometry کو الگ کرتی ہیں**: rendering کے لیے تفصیلی meshes، physics کے لیے آسان shapes۔ یہ علیحدگی کارکردگی کے لیے اہم ہے—غلط collision geometry کے ساتھ simulations 100 گنا سست چل سکتے ہیں۔
- **Simulated sensors حقیقی ہارڈویئر جیسا ROS 2 interface استعمال کرتے ہیں**: `ros_gz_bridge` معیاری topics پر sensor ڈیٹا publish کرتا ہے، perception اور control کوڈ کو simulation اور حقیقت کے درمیان unchanged کام کرنے کی اجازت دیتے ہوئے۔ یہ abstraction ترقی کو تیز کرتا ہے اور دوبارہ پیدا ہونے والی تحقیق کو قابل بناتا ہے۔

## مزید مطالعہ

- [Gazebo Official Documentation](https://gazebosim.org/docs) - جدید Gazebo کے لیے مکمل installation guides، tutorials، اور API reference
- [ROS 2 + Gazebo Integration Tutorial](https://docs.ros.org/en/humble/Tutorials/Advanced/Simulators/Gazebo/Gazebo.html) - ros_gz_bridge اور simulation workflows پر سرکاری ROS دستاویزات
- [SDF Format Specification](http://sdformat.org/) - روبوٹ اور دنیا کی تفصیلات کے لیے مکمل XML schema
- [Gazebo Building a Robot Tutorial](https://gazebosim.org/docs/latest/building_robot/) - sensors کے ساتھ کسٹم روبوٹ ماڈلز بنانے کے لیے قدم بہ قدم رہنما

