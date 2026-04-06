# 🎮 Stray Davet & AFK Botu (Discord-Minecraft Köprüsü)

Bu proje, Discord üzerinden komut alarak bir Minecraft sunucusunda (özellikle BungeeCord ağlarındaki alt sunucularda) 7/24 AFK bekleyip istenilen komutları çalıştıran gelişmiş bir entegrasyon botudur. 

"Alihlar" ekibi için özel olarak tasarlanmış olup, Mineflayer ve Discord.js kütüphaneleri kullanılarak geliştirilmiştir.

## ✨ Özellikler

* **🛡️ 7/24 AFK Modu:** Sunucuya bir kez girer, belirlenen alt sunucuya (örn: NethPot) geçer ve çıkmadan bekler.
* **⚡ Hızlı Yanıt Sistemi:** Bot sürekli oyunda olduğu için Discord'dan gelen komutları gecikmesiz (milisaniyeler içinde) oyuna aktarır.
* **👮 Kapsamlı Yetki ve Cooldown Sistemi:**
  * **Kurucu/Admin:** Bekleme süresi (cooldown) yok. Sınırsız komut yetkisi.
  * **Özel Üyeler:** 120 saniye (2 dakika) bekleme süresi.
  * **Normal Kullanıcılar:** 30 saniye bekleme süresi.
* **💤 Uyku Modu (!kapat / !aç):** Admin istediği zaman botu oyundan çıkarıp uyku moduna alabilir. Sistem kapatıldığında Discord komutları devredışı kalır.
* **🔄 Otomatik Yeniden Bağlanma:** Bağlantı kopsa bile bot 15 saniye içinde inatla sunucuya geri döner.

## 🛠️ Kurulum ve Gereksinimler

Bu botu kendi sunucunuzda veya bilgisayarınızda çalıştırmak için sisteminizde [Node.js](https://nodejs.org/) (önerilen v18+) yüklü olmalıdır.

1. Projeyi bilgisayarınıza klonlayın veya indirin:
   ```bash
   git clone [https://github.com/Renterq/stray-davet-botu.git](https://github.com/KULLANICI_ADIN/stray-davet-botu.git)
   cd stray-davet-botu
