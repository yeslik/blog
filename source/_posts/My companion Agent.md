---
title: My companion Agent
date: 2026-07-23 16:33:01
tags:
  - Agent
categories:
  - 尝试
password: "@95Agent0!!"
---
## 开发路线
> **电脑上的 Agent → 手机 → 手环收到提醒**
```
Agent
 |
 |
FastAPI
 |
 |
Android App
 |
 |
小米手环9
```
# 关键：不要让传感器直接控制回复
建立一个状态模型。
例如：
你的 Agent 内部：

```
{
"user_state":{

"physical":

{
"sleep":0.6,
"activity":0.3,
"heart_rate":0.7
},


"conversation":

{
"negative_words":0.8,
"emotion":0.7
},


"context":

{
"work_pressure":true
}

}

}
```

然后 Agent 决策。
# 需要增加一个“情绪状态引擎”

结构：

```
Sensor Data

↓

Feature Extraction

↓

Emotion State Model

↓

Agent Decision

↓

Response
```

例如：

## 输入：

```
睡眠下降20%

运动下降50%

最近聊天出现：

"累"
"压力"
"不想"
```

输出：

```
{
state:
"possible_low_energy",

confidence:
0.82,

action:
"gentle_checkin"
}
```

然后：

Agent：

> “感觉你最近消耗有点大，要不要告诉我今天发生了什么？”

## 数据采集
流程：
```
手环

↓

BLE通信

↓

抓包

↓

解析协议

↓

自己读取数据
```

工具：

- Android Bluetooth HCI log
- Wireshark
- nRF Connect

## 后端模块
agent/
├── brain.py
    Agent核心
├── memory.py
    长期记忆
├── persona.py
    人格
├── emotion_engine.py
    情绪状态
├── sensor.py
    传感器数据
├── proactive.py
    主动关心逻辑
## 主动提醒系统
增加一个 Scheduler。
例如：
每天：
```
检查():

    sleep = get_sleep()

    emotion = analyze_chat()

    if sleep下降 and emotion低:

          send_message()
```
类似：
```
Cron任务

↓

读取用户状态

↓

Agent判断

↓

发送提醒
```

# 试验阶段
## 第一阶段
 Demo：
运行：
```
Agent
```
输入：
```
今天感觉压力很大
```
Agent判断：
```
emotion = stress
```
然后：
发送：
```
小米手环9震动
```
显示：
```
🌱
最近是不是有点累？
```
> 一个能主动影响现实设备的 Agent。



