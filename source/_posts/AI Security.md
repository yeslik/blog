---
title: AI Security
date: 2026-07-17 16:16:52
tags:
  - AI
categories:
  - AI
---
# 常见的攻击
1. Prompt Injection
2. Agent越权
3. Tool调用绕过
4. Memory污染
5. 数据泄露
6. Agent行为漂移
7. 多Agent攻击链
## Prompt Injection
输入内容欺骗AI的行为，改变它的逻辑
1. 直接注入
2. 间接注入，比如读一个有害的邮件，读一个网页（网页中有危险的隐藏文字）
**防**：
 - prompt分离
	System prompt、用户的输入、外部的数据、工具返回数据都严格的隔离
- 权限限制
	限制agent的权限
## Tool Abuse
诱导滥用Agent能使用的工具，shell、数据库、文件系统、API等
**防**：

- Agent权限精细分级
- 工具权限分级限定
- Agent对工具里的参数进行验证
## Memory Poisoning
污染Agent的长期记忆，覆盖初始记忆，影响未来的决策
**防**：
- 对输入进行验证，输入信息来自哪个角色，是否敏感、可信
- 对记忆进行隔离，System Memory、User Memory和暂时Memory进行隔离
## Agent Authorization
Agent权限控制
**防**：
- 最小权限
	对Agent的基础权限进行控制，比如哪些角色对应的Agent该对应什么权限；对时间、地点、风险和任务对Agent进行限制；
	权限分层，设置不同的Level等级越高、权限越高、限制越严格