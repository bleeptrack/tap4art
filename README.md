# tap4art
"tap4art" is a sticker street art project that playfully connects digital generative art with street art sticker culture. Each sticker contains an nfc tag, which most smartphones can scan. The integrated tag stores two informations: it's own ID and a SCAN COUNT. When tapped, an algorithm creates: a unique style (color, dimensions) from the ID and a unique shape arrangement from the scan count. So each sticker has a different look and each scan creates a completely new image! 

## Example
If you want to see what a scan would look like, try [this link](https://tap4art.bleeptrack.de/?uid=04F3C2A2325C80x00002A)!
As you might have noticed, the URL has a special ending:
```
?uid=04F3C2A2325C80x00002A
```
where the hex part before the 'x' (04F3C2A2325C80) is the NFC tag's UID and the part afterwards (00002A) is the scan count also as hexadecimal value.

## Create your own
Of course you can also convert your own NFC tags into a tap4art tag! 
What you need is:
  - a NFC tag that has the ID and scan count mirror feature (f.e. NTAG213, NTAG215, NTAG216)
  - an app that can activate those two features (f.e. NXP TagWriter)

Then just write ```tap4art.bleeptrack.de``` as URL onto your tag and activate both features. It should look something like this:

## Creation journey
![youtube video](https://youtu.be/G-BeRXeH5V0)
