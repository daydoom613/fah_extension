Dim Sound
Set Sound = CreateObject("WMPlayer.OCX.7")
Sound.URL = WScript.Arguments.Item(0)
Sound.settings.volume = 100
Sound.Controls.play
WScript.Sleep 3000 ' Keep script alive for 3 seconds so the sound finishes playing