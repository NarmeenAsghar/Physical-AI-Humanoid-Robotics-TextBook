---
sidebar_position: 1
title: ROS 2 آرکیٹیکچر اور بنیادی تصورات
description: Robot Operating System 2 آرکیٹیکچر اور middleware بنیادیں کو سمجھنا
---

# ROS 2 آرکیٹیکچر اور بنیادی تصورات

## تعارف

ہزاروں روبوٹکس کمپنیاں—Stanford تحقیقی لیبز سے لے کر NASA تک اور اربوں ڈالر کے startups تک—ایک ہی سافٹ ویئر ریڑھ کی ہڈی کیوں استعمال کرتی ہیں؟ کیونکہ ہر روبوٹ کے لیے communication protocols، sensor drivers، اور control loops کو دوبارہ ایجاد کرنا ایسا ہے جیسے ہر ویب سائٹ کے لیے انٹرنیٹ انفراسٹرکچر کو دوبارہ تعمیر کرنا۔ یہ فضول، خطا کا شکار، اور ہمیں devs کے کاندھوں پر کھڑے ہونے سے روکتا ہے۔

ROS (Robot Operating System) سے پہلے، ہر روبوٹکس پروجیکٹ شروع سے شروع ہوتا تھا۔ ٹیمیں صرف ایک کیمرے اور موٹر کنٹرولر کو ایک دوسرے سے بات کرانے کے لیے مہینے کسٹم کوڈ لکھنے میں گزارتی تھیں۔ جب ROS 1 نے 2007 میں لانچ کیا، اس نے shared infrastructure فراہم کرکے تحقیقی روبوٹکس میں انقلاب برپا کر دیا۔ لیکن جیسے جیسے روبوٹس لیبز سے فیکٹریوں، گھروں، اور سڑکوں پر منتقل ہوئے، ROS 1 کی حدود واضح ہو گئیں—کوئی حقیقی وقت کی ضمانت نہیں، حفاظتی خطرات، اور ناقص multi-robot support۔

ROS 2 (2017-موجودہ) داخل ہوا: صنعتی معیار DDS (Data Distribution Service) middleware پر تعمیر شدہ مکمل دوبارہ ڈیزائن، حقیقی وقت کی کارکردگی، حفاظت، اور scalability پیش کرتے ہوئے۔ آج، یہ Unitree کے H1 اور G1 سیریز، NASA کے Valkyrie، اور Agility Robotics کے Digit ڈیلیوری روبوٹ جیسے ہیومنائیڈ روبوٹس کو طاقت دیتا ہے۔ جدید ہیومنائیڈ روبوٹکس کے لیے—جہاں آپ 30+ جوڑوں کو ہم آہنگ کر رہے ہیں، درجنوں سینسرز سے ڈیٹا fuse کر رہے ہیں، اور متحرک توازن برقرار رکھ رہے ہیں—ROS 2 اختیاری نہیں ہے۔ یہ اعصابی نظام ہے جو آپ کو infrastructure plumbing کی بجائے روبوٹ کے رویے پر توجہ مرکوز کرنے دیتا ہے۔

## سیکھنے کے مقاصد

اس سبق کے اختتام تک، آپ قابل ہوں گے:

- ROS 2 آرکیٹیکچر کو middleware کے طور پر وضاحت کرنا اور یہ کہ یہ operating system سے کیسے مختلف ہے
- topics، services، اور actions کے درمیان فرق کرنا—اور جاننا کہ ہر communication pattern کب استعمال کرنا ہے
- سمجھنا کہ ROS 2 (ROS 1 نہیں) پیداوار کے معیار کے ہیومنائیڈ روبوٹس کے لیے ضروری کیوں ہے

## کلیدی تصورات

### Middleware کے طور پر ROS 2

ROS 2 اپنے نام کے باوجود operating system نہیں ہے—یہ ایک middleware framework ہے جو Linux، Windows، یا macOS کے اوپر چلتا ہے۔ اسے ایک خصوصی communication layer کے طور پر سوچیں جو آپ کے روبوٹ ہارڈویئر اور آپ کی application logic کے درمیان بیٹھتا ہے، اسی طرح جیسے HTTP ویب ایپلی کیشنز کے لیے communication معیار ہے۔

اپنی بنیاد میں، ROS 2 DDS (Data Distribution Service) استعمال کرتا ہے، ایک صنعتی معیار publish-subscribe protocol جو aerospace، دفاع، اور automotive صنعتوں میں حقیقی وقت distributed سسٹمز کے لیے ڈیزائن کیا گیا ہے۔ DDS configurable quality-of-service ضمانتوں کے ساتھ node-to-node communication کے لیے ریڑھ کی ہڈی فراہم کرتا ہے۔

ROS 2 کیا فراہم کرتا ہے؟ inter-process messaging کے لیے communication infrastructure، عام سینسرز (کیمرے، LiDAR، IMUs) اور actuators کے لیے device drivers، visualization (RViz)، simulation (Gazebo integration)، اور logging جیسے کاموں کے لیے عام libraries، نیز build tools (colcon) جو سینکڑوں packages میں انحصار کو handle کرتے ہیں۔ Unitree کے H1 ہیومنائیڈ پر غور کریں: یہ ہر ٹانگ کے لیے الگ کنٹرولرز کو ہم آہنگ کرنے، IMU توازن ڈیٹا کو ضم کرنے، اور stereo کیمرہ feeds کو fuse کرنے کے لیے ROS 2 استعمال کرتا ہے—سب بغیر کسی کسٹم communication protocols کے۔

> 💡 **Middleware کیوں؟**: Middleware application logic کو hardware تفصیلات سے الگ کرتا ہے۔ Realsense D435 کیمرے سے D455 میں upgrade کرنا چاہتے ہیں؟ ROS 2 کے ساتھ، آپ کا perception کوڈ تبدیل نہیں ہوتا—صرف driver node کو swap کریں۔ یہ modularity ترقی کو تیز کرتی ہے اور روبوٹ platforms میں کوڈ کے دوبارہ استعمال کو قابل بناتی ہے۔

### Topics کے ساتھ Publish-Subscribe Communication

publish-subscribe pattern ROS 2 کا بنیادی communication طریقہ ہے۔ Publishers نامزد topics پر پیغامات بھیجتے ہیں؛ subscribers ان topics سے پیغامات وصول کرتے ہیں جن میں انہیں دلچسپی ہے۔ اہم بات یہ ہے کہ publishers اور subscribers ایک دوسرے کے بارے میں نہیں جانتے—وہ decoupled ہیں، صرف topic کے نام اور message type کے ذریعے بات چیت کرتے ہیں۔

یہ decoupling طاقتور فن تعمیرات کو قابل بناتا ہے۔ ایک camera node تصاویر کو `/camera/image_raw` topic پر publish کرتا ہے۔ کئی nodes بیک وقت subscribe کر سکتے ہیں: ایک object detector رکاوٹوں کے لیے تجزیہ کرتا ہے، ایک mapping node 3D ماحول ماڈل بناتا ہے، اور ایک logging node بعد میں تجزیہ کے لیے ڈیٹا ریکارڈ کرتا ہے۔ اگر ایک subscriber crash ہو جاتا ہے، دوسرے غیر متاثر جاری رہتے ہیں۔

ROS 2 Quality of Service (QoS) policies کے ساتھ اس pattern کو بہتر بناتا ہے۔ آپ reliability configure کر سکتے ہیں (اعلی تعدد sensor ڈیٹا کے لیے best-effort جہاں dropped messages قابل قبول ہیں، یا اہم کمانڈز کے لیے reliable)، history depth (صرف تازہ ترین پیغام رکھیں، یا آخری N پیغامات buffer کریں)، اور durability۔ ہیومنائیڈ توازن کنٹرول جیسے حقیقی وقت سسٹمز کے لیے، topic communication جدید hardware پر sub-millisecond latency حاصل کرتا ہے۔

Agility Robotics کے Digit پر غور کریں: اس کا LiDAR node 10 Hz پر 3D point clouds کو `/scan` پر publish کرتا ہے۔ Nav2 navigation stack رکاوٹ کی پتہ لگانے کے لیے اس topic کو subscribe کرتا ہے۔ بیک وقت، ایک safety monitor تصادم کا پتہ لگانے کے لیے subscribe کرتا ہے، اور ایک data logger scans کو archive کرتا ہے۔ ہر subscriber آزادانہ طور پر کام کرتا ہے، اور نئے subscribers شامل کرنا موجودہ nodes کو modify نہیں کرتا۔

> ⚠️ **ڈیزائن کا انتخاب**: مسلسل ڈیٹا streams کے لیے topics استعمال کریں—sensor streams، joint states، odometry۔ Topics fire-and-forget communication ہیں۔ اگر آپ کو request-reply semantics یا تکمیل کی تصدیق کی ضرورت ہے، تو بجائے services یا actions استعمال کریں۔

### کنٹرول کے لیے Services اور Actions

جبکہ topics streaming ڈیٹا handle کرتے ہیں، services اور actions configuration اور control کاموں کے لیے request-reply communication فراہم کرتے ہیں۔

**Services** synchronous request-reply پیش کرتے ہیں: ایک client node request بھیجتا ہے اور server کے response کا انتظار کرتا ہے۔ Services فوری operations کے لیے مثالی ہیں جیسے روبوٹ کی حالت کی پوچھ گچھ، sensor parameters configure کرنا، یا ایک بار کے واقعات کو trigger کرنا۔ مثال: ایک `/set_joint_position` service ایک ہدف joint زاویہ قبول کر سکتا ہے اور کامیابی/ناکامی واپس کرتا ہے۔ request milliseconds میں مکمل ہوتی ہے، اور client فوری طور پر جانتا ہے کہ آیا یہ کامیاب ہوا۔

**Actions** طویل چلنے والے کاموں کے لیے services کو بڑھاتے ہیں۔ ایک action client ہدف بھیجتا ہے، پھر غیر مطابقت پذیر طور پر متواتر feedback اور ایک حتمی نتیجہ وصول کرتا ہے۔ اہم بات، actions منسوخی کی حمایت کرتے ہیں—client mid-execution کو منسوخ کر سکتا ہے۔ یہ pattern navigation کاموں، multi-step manipulation، اور trajectory execution کے لیے بالکل فٹ ہوتا ہے جہاں روبوٹ کو کام مکمل کرنے میں منٹ درکار ہوتے ہیں اور آپ progress updates چاہتے ہیں۔

مثال: NASA Valkyrie ہیومنائیڈ locomotion کے لیے `/navigate_to_pose` action استعمال کرتا ہے۔ client ایک ہدف pose (position + orientation) بھیجتا ہے۔ جیسے Valkyrie چلتا ہے، یہ ہر سیکنڈ feedback بھیجتا ہے: موجودہ pose، باقی فاصلہ، تخمینی وقت۔ اگر کوئی انسان راستے میں قدم رکھتا ہے، client action کو منسوخ کر دیتا ہے، اور Valkyrie فوری طور پر رک جاتا ہے۔ جب منزل پر پہنچ جاتا ہے، حتمی نتیجہ پیغام کامیابی کی تصدیق کرتا ہے۔

> 📊 **Communication Pattern کا انتخاب**:
> - **Topics**: مسلسل sensor streams (کیمرہ، LiDAR، IMU) → استعمال کریں جب آپ کو تصدیق کی ضرورت نہیں
> - **Services**: فوری configuration requests (پیرامیٹر سیٹ کریں، calibration trigger کریں) → 1 سیکنڈ سے کم operations کے لیے استعمال کریں جو نتیجہ واپس کرتے ہیں
> - **Actions**: progress کے ساتھ طویل چلنے والے کام (navigation، pick-and-place) → استعمال کریں جب آپ کو feedback اور منسوخی کی ضرورت ہو

## عملی مشق

**ضروریات:**
- ROS 2 Humble نصب (یا ROS 2 Docker container تک رسائی)
- بنیادی command-line واقفیت
- Terminal application

**سرگرمی: ROS 2 Communication Patterns تلاش کریں**

1. **ROS 2 ڈیمو nodes شروع کریں** (الگ terminals میں):

```bash
# Terminal 1: talker node شروع کریں (/chatter topic پر publish کرتا ہے)
ros2 run demo_nodes_cpp talker

# Terminal 2: listener node شروع کریں (/chatter topic کو subscribe کرتا ہے)
ros2 run demo_nodes_cpp listener
```

2. **فعال topics کا معائنہ کریں**:

```bash
# Terminal 3: تمام فعال topics کی فہرست بنائیں
ros2 topic list

# /chatter topic کی تفصیلات دیکھیں (message type، publishers، subscribers)
ros2 topic info /chatter

# /chatter پر publish ہونے والے پیغامات echo کریں
ros2 topic echo /chatter
```

3. **Nodes اور ان کے تعلقات تلاش کریں**:

```bash
# چلنے والے nodes کی فہرست بنائیں
ros2 node list

# دیکھیں کہ talker node کیا کر رہا ہے (publications، subscriptions، services)
ros2 node info /talker
```

4. **Services کے ساتھ تجربہ کریں**:

```bash
# دستیاب services کی فہرست بنائیں
ros2 service list

# turtlesim میں نیا turtle spawn کرنے کے لیے service کو call کریں (اگر چل رہا ہو)
ros2 service call /spawn turtlesim/srv/Spawn "{x: 5.0, y: 5.0, theta: 0.0, name: 'turtle2'}"
```

**متوقع نتیجہ:**

آپ کو ROS 2 communication کی decoupled نوعیت کا مشاہدہ کرنا چاہیے—talker اور listener nodes `/chatter` topic کے ذریعے براہ راست connection کے بغیر بات چیت کرتے ہیں۔ listener کو روکنے کی کوشش کریں؛ talker publish کرتا رہتا ہے۔ یہ ظاہر کرتا ہے کہ ROS 2 کا publish-subscribe pattern modular، fault-tolerant روبوٹ سسٹمز کیسے قابل بناتا ہے۔ ان معائنہ کمانڈز کو سمجھنا حقیقی روبوٹ سسٹمز کی debugging کے لیے ضروری ہے۔

## کوئز

اس سبق کی اپنی سمجھ کو جانچیں:

1. بنیادی operating system کے ساتھ ROS 2 کا کیا تعلق ہے؟
   - A) ROS 2 ایک حقیقی وقت operating system ہے جو Linux کی جگہ لیتا ہے
   - B) ROS 2 middleware ہے جو Linux/Windows/macOS کے اوپر چلتا ہے
   - C) ROS 2 روبوٹس کے لیے ایک programming language ہے
   - D) ROS 2 روبوٹ کمپیوٹرز کے لیے ایک hardware specification ہے

2. آپ کو ROS 2 topic بمقابلہ service کب استعمال کرنا چاہیے؟
   - A) غیر معمولی configuration requests کے لیے topics؛ مسلسل sensor ڈیٹا کے لیے services
   - B) مسلسل ڈیٹا streams کے لیے topics؛ request-reply operations کے لیے services
   - C) Topics اور services ایک دوسرے کے بدلے استعمال ہو سکتے ہیں
   - D) مقامی communication کے لیے topics؛ network communication کے لیے services

3. ROS 2 actions کو services سے کیا مختلف بناتا ہے؟
   - A) Actions services سے تیز ہیں
   - B) Actions execution کے دوران feedback کی حمایت کرتے ہیں اور منسوخ ہو سکتے ہیں
   - C) Actions ایک مختلف programming language استعمال کرتے ہیں
   - D) Actions صرف ہیومنائیڈ روبوٹس پر کام کرتے ہیں

<details>
<summary>جوابات دکھائیں</summary>

1. **B** - ROS 2 middleware ہے جو Linux/Windows/macOS کے اوپر چلتا ہے۔ یہ خود operating system نہیں ہے، بلکہ ایک framework ہے جو communication infrastructure اور libraries فراہم کرتا ہے جو OS اور آپ کے روبوٹ application کوڈ کے درمیان بیٹھتا ہے۔ نام میں "Operating System" تاریخی ہے—یہ عام خدمات فراہم کرنے کا حوالہ دیتا ہے جن کی زیادہ تر روبوٹ منصوبوں کو ضرورت ہوتی ہے۔

2. **B** - مسلسل ڈیٹا streams کے لیے topics؛ request-reply operations کے لیے services۔ Topics streaming sensor ڈیٹا، joint states، اور odometry کے لیے publish-subscribe استعمال کرتے ہیں جہاں آپ کو تصدیق کی ضرورت نہیں۔ Services parameters کی تشکیل یا حالت کی پوچھ گچھ جیسی operations کے لیے request-reply استعمال کرتے ہیں جہاں آپ کو operation مکمل ہونے کی تصدیق کرنے والے response کی ضرورت ہوتی ہے۔

3. **B** - Actions execution کے دوران feedback کی حمایت کرتے ہیں اور منسوخ ہو سکتے ہیں۔ services کے برعکس (جو مکمل ہونے تک block کرتے ہیں)، actions غیر مطابقت پذیر ہیں اور کام آگے بڑھنے کے ساتھ ساتھ متواتر feedback پیغامات بھیجتے ہیں۔ یہ navigation یا manipulation جیسے طویل چلنے والے operations کے لیے ضروری ہے جہاں آپ progress updates اور circumstances بدلنے پر mid-execution میں منسوخ کرنے کی صلاحیت چاہتے ہیں۔

</details>

## کلیدی نکات

- **ROS 2 middleware ہے، OS نہیں**: یہ Linux/Windows کے اوپر communication infrastructure، drivers، اور libraries فراہم کرتا ہے، آپ کو low-level plumbing کی بجائے روبوٹ کے رویے پر توجہ مرکوز کرنے دیتا ہے۔
- **تین communication patterns میں مہارت حاصل کریں**: مسلسل streams (sensors، state) کے لیے Topics، فوری request-reply (configuration) کے لیے Services، feedback (navigation، manipulation) کے ساتھ طویل چلنے والے کاموں کے لیے Actions۔ صحیح pattern کا انتخاب مضبوط روبوٹ فن تعمیر کے لیے بنیادی ہے۔
- **DDS پیداوار کے معیار کی روبوٹکس کو قابل بناتا ہے**: ROS 2 کی کسٹم protocols سے صنعتی معیار DDS میں تبدیلی آپ کو حقیقی وقت کی کارکردگی، حفاظت، اور multi-robot scalability دیتی ہے—تحقیقی لیبز سے باہر ہیومنائیڈز کو تعینات کرنے کی ضروریات۔
- **Decoupling modularity کو قابل بناتا ہے**: Publish-subscribe فن تعمیر کا مطلب ہے کہ nodes براہ راست ایک دوسرے پر منحصر نہیں ہیں۔ موجودہ کوڈ کو دوبارہ لکھے بغیر sensors swap کریں، نئے algorithms شامل کریں، یا متعدد روبوٹس کو scale کریں۔

## مزید مطالعہ

- [ROS 2 Official Documentation (Humble)](https://docs.ros.org/en/humble/) - تصورات، ٹیوٹوریلز، اور API دستاویزات کے لیے جامع حوالہ
- [The Construct: ROS 2 Fundamentals Course](https://www.theconstructsim.com/robotigniteacademy_learnros/ros-courses-library/) - simulated روبوٹس کے ساتھ interactive ٹیوٹوریلز
- [Robotics Backend: Understanding DDS in ROS 2](https://roboticsbackend.com/what-is-dds-ros2/) - DDS middleware layer میں گہرائی سے غور
- [Nav2 Documentation](https://navigation.ros.org/) - روبوٹ navigation کے لیے ROS 2 actions کی حقیقی دنیا کی مثال
