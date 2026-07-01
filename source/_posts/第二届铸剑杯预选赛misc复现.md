---
title: 第二届铸剑杯预选赛misc复现
date: 2026-07-01 17:36:49
tags: []
categories: []
---
## Misc1-降维打击

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898629665.webp)

binwalk 分析有隐藏文件，进行分离

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898636525.webp)

得到了一个光栅图片

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898645540.webp)

- 利用一个光栅图的相关隐写工具进行提取爆破——[**Raster-Terminator**](https://github.com/AabyssZG/Raster-Terminator#)
    
    ```bash
    sudo apt update
    sudo apt install python3-pip
    pip3 install Pillow
    git clone <https://github.com/AabyssZG/Raster-Terminator.git>
    cd Raster-Terminator
    python3 Raster-Terminator.py -i 光栅图.png
    ```
    

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898701164.webp)
得到：
![](/img/posts/第二届铸剑杯预选赛misc复现-1782898660069.webp)

snowflakes are all 1.26 dimensions. 雪花都是1.26维度的Why are you a surface dwawddss

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898666054.webp)

How can we break through the boundaries of dimensions wwdssdww我们如何才能突破维度的边界
![](第二届铸剑杯预选赛misc复现-1782898666054.webp)

dwawwdsdwdssasd ddwwasawwdddsss

snowflakes are all 1.26 dimensions. 雪花都是1.26维度的，这是一个数学梗，科赫雪花的豪斯多夫维数是约 **1.26**，它是一条一维线段，却能填满二维平面的一部分，具有无限长度但有限面积的特点。

里面dwawddss，wwdssdww，dwawwdsdwdssasd ， ddwwasawwdddsss都是不构成语句的额外的字符串。里面wasd四个字母重复出现，在键盘中wsad对应了上下左右键

跟着移动

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898719425.webp)

然后说这个dwawwdsdwdssasd→wwdssdww→ddwwasawwdddsss→dwawddss可以拼接成一个小二维码

## Misc2 BB84

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898733587.webp)

查看wp，这个主要是量子密钥分发协议 BB84 的实现漏洞利用

**BB84通信协议：**

只有基一致时才能得到真实信息，否则丢弃。

|1. 客户端发送量子比特|随机选择一个“基”：“+” 或 “x”，并随机选择极化值（0 或 1），例如：“+0” 表示用“+”基发送极化为 0 的光子。|
|---|---|
|2. 服务器测量|服务器也随机选择“+”或“x”基来测量每个量子比特。如果基相同，则测得正确极化；若不同，则结果随机且无意义。|
|3. 经典信道协商|双方通过普通网络（经典信道）公开各自使用的基。保留**基相同的位**，这些位组成共享密钥。|
|||

主要漏洞是使用了 Python 的 random 模块，种子seed被泄露  
那么就可以

1. 使用相同的 seed 重新生成客户端的随机序列（基 + 极化）
2. 结合服务器的测量基，还原出共享密钥
3. 利用已知的 XOR 密钥解密 flag

数据包都是TCP流量，肯定传输了什么

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898742220.webp)

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898748114.webp)

![](/img/posts/第二届铸剑杯预选赛misc复现-1782898753719.webp)

查看前三个包的data字段

得到：

SEED:123456789

XOR_KEY:8660ace90c0352f3

x++x+x+xx++x+xxxxx++x+xxxxxx++x+（32）