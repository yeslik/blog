---
title: 星途CTF——misc出题笔记
date: 2026-07-01 17:12:26
tags:
  - CTF
categories:
  - 比赛
---
# 星途CTF——misc出题笔记

## 签到——你要的全拿走

**考点**：base解码+Linux文件系统常识

**题目描述**：

师兄临走前拍了拍你的肩膀："我的东西你要的全部拿走。”

你打开他留下的压缩包，翻遍了每个角落……

可那个最重要的东西，怎么找都找不到。

**附件**：[https://pan.baidu.com/s/1HiTpeXvki3K0smESZqiK5Q?pwd=yeau](https://pan.baidu.com/s/1HiTpeXvki3K0smESZqiK5Q?pwd=yeau)

### 题解：

```bash
cat > home_backup/home/alice/.bash_history << 'EOF'
Wow! gooooood finding!!!
ls -la
cd /var/www/html
ls
cat index.php
cd ~
sudo apt update
sudo apt install vim -y
cd /opt/webapp
python3 app.py
ps aux | grep python
kill 1234
cd ~
ssh root@192.168.1.100
scp backup.zip root@192.168.1.100:/tmp/
mysql -u root -pSuperSecret123 mydb
show databases;
select * from users limit 10;
exit
cd /etc
cat passwd
cat shadow
cd ~
git clone <https://github.com/example/tools.git>
cd tools && pip3 install -r requirements.txt
python3 exploit.py
export SECRET=“ZmxhZ3tkMHRmMWwzc190M2xsXzRsbF9zM2NyM3RzfQ==”
vim config.yml
cat config.yml
cd /var/log
tail -f auth.log
grep "Failed password" auth.log
cd ~
zip -r backup.zip /var/www/html
ls -lh backup.zip
history -c
EOF
```

解码base64：ZmxhZ3tkMHRmMWwzc190M2xsXzRsbF9zM2NyM3RzfQ==

**flag**: `flag{d0tf1l3s_t3ll_4ll_s3cr3ts}`

## 仓库清白吗

**考点**：LSB隐写+Git历史回溯

**题目描述**：

他犯了一个错误。  
他以为他修正了它。  
他以为像素不会撒谎。  
他以为“仓库”会保守秘密。  
他全错了。  
现在轮到你了。

**附件** [https://pan.baidu.com/s/1PGxQ4ALpmx5AE07hs4kR5A?pwd=yeae](https://pan.baidu.com/s/1PGxQ4ALpmx5AE07hs4kR5A?pwd=yeae)

### 题解：

zsteg分析附件图片，发现存在LSB隐写

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ zsteg challenge.png     
imagedata           .. file: byte-swapped Berkeley vfont data
b1,rgb,lsb,xy       .. text: "ctf_repo/UT\t"
b2,r,msb,xy         .. text: ["U" repeated 9 times]
b2,g,msb,xy         .. text: "uuUUUUUUUU}u"
b2,b,msb,xy         .. text: "UUUUUUUUUuU_"
b2,rgb,msb,xy       .. file: VISX image file
b2,bgr,msb,xy       .. file: VISX image file
b4,r,msb,xy         .. text: ["w" repeated 9 times]
b4,g,msb,xy         .. text: ["w" repeated 16 times]
b4,b,msb,xy         .. text: ["w" repeated 19 times]
b4,rgb,msb,xy       .. text: ["w" repeated 8 times]
b4,bgr,msb,xy       .. text: ["w" repeated 19 times]                                                      
```

提取 `zsteg -e b1,rgb,lsb,xy 2.png > out.zip`

```bash
┌──(kali㉿kali)-[~/Desktop/ctf_repo]
└─$ ls -al
total 28
drwxrwxr-x 3 kali kali 4096 Jun  7 18:20 .
drwxr-xr-x 7 kali kali 4096 Jun  7 18:20 ..
-rwxrw-rw- 1 kali kali  199 Jun  4 00:31 config.py
drwxrwxr-x 8 kali kali 4096 Jun  7 18:20 .git
-rwxrw-rw- 1 kali kali  763 Jun  4 00:31 main.py
-rwxrw-rw- 1 kali kali   91 Jun  4 00:31 README.md
-rwxrw-rw- 1 kali kali  321 Jun  4 00:31 utils.py      
```

结合附件图片的内容、题目名称和提取出的文件夹中的.git目录，基本上可以推断这是个git仓库。这里有两个思路去看git历史：

1. 看ctf_repo文件夹里的文件，也能发现有个变量**SECRET**的值被删了，再加上附件图片内容的git log —oneline输出内容中有一行**0e2dc87 fix: remove hardcoded credentials**—>看git历史进行了什么操作
    
    ```bash
    ┌──(kali㉿kali)-[~/Desktop/ctf_repo]
    └─$ cat config.py 
    # 项目配置文件
    
    DATABASE_URL = "postgresql://localhost:5432/mydb"
    DEBUG = False
    MAX_RETRIES = 3
    
    # API credentials
    API_KEY = "sk-prod-xK9mL2nP"
    SECRET = ""
    BASE_URL = "<https://api.example.com>"
    ```
    
2. 看到有个.git目录，git本地数据库
    
    ```python
    .git/
    ├── objects/        ← 所有数据都在这，每次commit的文件快照
    │     ├── bf/
    │     │   └── 09498...  ← 第一个commit的数据
    │     ├── 7c/
    │     │   └── 31e65...  ← 加了SECRET的那个commit
    │     ├── 0e/
    │     │   └── 2dc87...  ← 删掉SECRET的那个commit
    │     └── ...
    ├── refs/heads/master   ← 指向最新commit
    └── logs/               ← 操作日志
    ```
    
    每次 git commit是在 objects/ 里新增一个对象，记录这次的文件快照。git rm或者删除一行代码再commit，不会删除旧的对象，相当于新增了一个快照
    

```bash
//那么git log --oneline查看历史
┌──(kali㉿kali)-[~/Desktop/ctf_repo]
└─$ git log --oneline
98e9b56 (HEAD -> master) feat: add utility functions
7726f84 feat: improve error handling and validation
0e2dc87 fix: remove hardcoded credentials
7c31e65 feat: add config module
bf09498 init: project setup

//根据附件图片中，remove的记录高亮，那么git show查看这条记录，get flag!!!
┌──(kali㉿kali)-[~/Desktop/ctf_repo]
└─$ git show 0e2dc87 
commit 0e2dc87097eb9a032a26cf1474f22555db85a113
Author: developer <dev@example.com>
Date:   Wed Jun 3 16:31:35 2026 +0000

    fix: remove hardcoded credentials

diff --git a/config.py b/config.py
index 8d4572c..a5b531b 100644
--- a/config.py
+++ b/config.py
@@ -6,5 +6,5 @@ MAX_RETRIES = 3
 
 # API credentials
 API_KEY = "sk-prod-xK9mL2nP"
-SECRET = "flag{git_never_forgets_a2f8c1}"
+SECRET = ""
 BASE_URL = "<https://api.example.com>"

```

**flag**: `flag{git_never_forgets_a2f8c1}`

## 回响

**考点**：流量分析+文件提取+元数据隐写+AES解密

**题目描述**：

他发回了消息。。。

**附件**： [https://pan.baidu.com/s/1pMiKCmTUUgFIzhVwryOWZg?pwd=yeaa](https://pan.baidu.com/s/1pMiKCmTUUgFIzhVwryOWZg?pwd=yeaa)

### 题解：

看协议分布，Statistics → Protocol Hierarchy，重点分析HTTP协议；

过滤http，发现有一条 POST /upload 请求带了 JPEG 图片，追踪流查看后，以原始数据导出图片，exiftool查看元数据时，发现用户评论的部分添加了新东西——`Sp3ct3rK3y!@#$%^` ，初步分析是某个key

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ exiftool photo.jpg
ExifTool Version Number         : 13.25
File Name                       : photo.jpg
Directory                       : .
File Size                       : 11 kB
File Modification Date/Time     : 2026:06:06 01:40:52+08:00
File Access Date/Time           : 2026:06:07 18:15:18+08:00
File Inode Change Date/Time     : 2026:06:06 01:41:34+08:00
File Permissions                : -rw-------
Warning                         : Processing JPEG-like data after unknown 347-byte header
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Exif Byte Order                 : Big-endian (Motorola, MM)
User Comment                    : Sp3ct3rK3y!@#$%^
Image Width                     : 400
Image Height                    : 300
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 400x300
Megapixels                      : 0.120
```

接下来解释排查还有没有藏东西的地了：

所有请求的路径都是一些标准路径，没有异常参数，排除；

除去 ****GET 请求，POST请求的 body要么是OK，要么是hello world，排除；

访问的都是微软、百度、Google 这类正常域名，排除；

那剩下能藏数据最有可能的地方就只有 **HTTP Header** 了。

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ tshark -r challenge.pcap -Y "http.request" -T fields -e http.user_agent | sort -u
curl/7.88.1
Mozilla/5.0 (4hbv0FgszLpTeX8eSErUB+PUgfJSy) Chrome/120.0
Mozilla/5.0 (JhCCFAw3zau8snIfHfiE1gNpqtbVH) Safari/537.36
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15
Mozilla/5.0 (pZsO/jATiPitFLBm6oyyn9dTzSow==) Firefox/115.0
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36
Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0
Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0
Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0
python-requests/2.31.0
```

tshark提取User-Agent字段，发现了猫腻，有三段字符串，拼凑：

`4hbv0FgszLpTeX8eSErUB+PUgfJSyJhCCFAw3zau8snIfHfiE1gNpqtbVHpZsO/jATiPitFLBm6oyyn9dTzSow==`

尝试base64解码发现是乱码，再加上4x16字节长度，推断是AES加密

```bash
┌──(kali㉿kali)-[~/Desktop]
└─$ echo "4hbv0FgszLpTeX8eSErUB+PUgfJSyJhCCFAw3zau8snIfHfiE1gNpqtbVHpZsO/jATiPitFLBm6oyyn9dTzSow==" | base64 -d | xxd
00000000: e216 efd0 582c ccba 5379 7f1e 484a d407  ....X,..Sy..HJ..
00000010: e3d4 81f2 52c8 9842 0850 30df 36ae f2c9  ....R..B.P0.6...
00000020: c87c 77e2 1358 0da6 ab5b 547a 59b0 efe3  .|w..X...[TzY...
00000030: 0138 8f8a d14b 066e a8cb 29fd 753c d2a3  .8...K.n..).u<..
```

在线网站用key=Sp3ct3rK3y!@#$%^ 解密密文得到flag

**flag** : `flag{sp3ctr3_0p3r4t10n_m1dn1ght_s1gn4l_h4s_b33n_c4ptur3d}`