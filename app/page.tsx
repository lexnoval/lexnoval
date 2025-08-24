export default function LandingLexnova() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-black text-white grid place-items-center font-bold">L</div>
            <span className="font-semibold tracking-tight">Lexnova <span className="text-black/60">AL</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#ozellikler" className="hover:text-black/80">Özellikler</a>
            <a href="#kullanim" className="hover:text-black/80">Kullanım Alanları</a>
            <a href="#fiyat" className="hover:text-black/80">Fiyatlandırma</a>
            <a href="#sss" className="hover:text-black/80">SSS</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="/auth" className="px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-100">Giriş</a>
            <a href="/signup" className="px-3 py-2 rounded-xl text-sm font-medium bg-black text-white hover:bg-black/90">Ücretsiz Dene</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">Avukatlar için yapay zekâ asistanı: Daha hızlı, hatasız, güvenli.</h1>
              <p className="mt-5 text-lg text-gray-600">Lexnova AL; dilekçe taslağı, içtihat araştırması, sözleşme inceleme ve müvekkil iletişimi için özel olarak eğitilmiş bir asistandır. Türkçe hukuk terminolojisine hakimdir ve verilerinizi güvenle işler.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="/signup" className="px-5 py-3 rounded-xl bg-black text-white font-medium hover:bg-black/90">Hemen Başla</a>
                <a href="#ozellikler" className="px-5 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50">Özellikleri İncele</a>
              </div>
              <div className="mt-6 text-sm text-gray-500">14 gün ücretsiz • Kart gerekmez • KVKK uyumlu mimari</div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-gray-200 shadow-sm p-4 bg-gradient-to-b from-gray-50 to-white">
                {/* Fake app preview */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-2 w-14 rounded bg-gray-200" />
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                    <div className="h-2 w-2 rounded-full bg-gray-200" />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <aside className="col-span-2 space-y-2">
                    <div className="h-8 rounded-lg bg-gray-100" />
                    <div className="h-8 rounded-lg bg-gray-100" />
                    <div className="h-8 rounded-lg bg-gray-100" />
                    <div className="h-8 rounded-lg bg-gray-100" />
                  </aside>
                  <div className="col-span-3">
                    <div className="h-20 rounded-xl bg-white border border-gray-200 p-4">
                      <div className="h-3 w-2/3 bg-gray-100 rounded" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded mt-2" />
                    </div>
                    <div className="h-28 rounded-xl bg-white border border-gray-200 p-4 mt-3">
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                      <div className="h-3 w-2/3 bg-gray-100 rounded mt-2" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded mt-2" />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <input placeholder="Sorunuz..." className="flex-1 h-10 rounded-xl border border-gray-200 px-3 text-sm" />
                      <button className="px-4 h-10 rounded-xl bg-black text-white text-sm font-medium">Gönder</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Öne çıkan özellikler</h2>
          <p className="mt-2 text-gray-600">Günlük hukuk pratiğinizi hızlandırmak ve kaliteyi artırmak için tasarlandı.</p>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Dilekçe & yazı taslakları",
                desc: "Dava türüne göre uygun içerik, mevzuat ve içtihat referansları ile taslak üretimi.",
              },
              {
                title: "İçtihat & mevzuat arama",
                desc: "Yargıtay/Danıştay kararlarına ve mevzuata hızlı erişim için akıllı arama.",
              },
              {
                title: "Sözleşme inceleme",
                desc: "Risk tespiti, boşluk analizi ve önerilerle dakikalar içinde gözden geçirme.",
              },
              {
                title: "Müvekkil iletişimi",
                desc: "Soru-yanıt, özetleme ve takip e-postaları için profesyonel metin üretimi.",
              },
              {
                title: "Gizlilik & güvenlik",
                desc: "Verileriniz şifreli saklanır; proje bazlı erişim ve denetim kayıtları bulunur.",
              },
              {
                title: "Türkçe hukuk dili",
                desc: "Terminolojiye hakim, yerel uygulamaları bilen bir yardımcı.",
              },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-black/90 text-white grid place-items-center font-semibold">{i+1}</div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use-cases */}
      <section id="kullanim" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight">Kullanım alanları</h2>
              <p className="mt-2 text-gray-600">Tek başınıza çalışırken ya da ekip içinde—Lexnova AL hep yanınızda.</p>
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {[
                {h:"Dava hazırlığı", p:"Ön inceleme, talep-sonuç taslağı ve delil listesi önerileri."},
                {h:"Sözleşme yaşam döngüsü", p:"Şablon oluşturma, farklı versiyonları karşılaştırma ve onaya hazır hale getirme."},
                {h:"Araştırma & özet", p:"Dosya yükleyin, özet isteyin, kritik noktaları çıkarın."},
                {h:"E-posta ve dilekçe üslubu", p:"Kurumsal üsluba uygun, tutarlı metinler."},
              ].map((u, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold">{u.h}</h3>
                  <p className="mt-2 text-sm text-gray-600">{u.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="fiyat" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">Fiyatlandırma</h2>
          <p className="mt-2 text-gray-600">Basit ve şeffaf. İhtiyacınıza göre ölçeklenir.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {name:"Bireysel", price:"₺0", sub:"14 gün deneme", features:["Sınırlı istek", "Temel şablonlar", "Topluluk desteği"], cta:"Ücretsiz Dene"},
              {name:"Profesyonel", price:"₺1.490/ay", sub:"En popüler", features:["Sınırsız sohbet", "Gelişmiş şablonlar", "Dosya yükleme & özet"], cta:"Başla"},
              {name:"Ekip", price:"Özel", sub:"5+ kullanıcı", features:["Kullanıcı bazlı yetki", "Denetim kayıtları", "Özel entegrasyonlar"], cta:"İletişime Geç"},
            ].map((p, i) => (
              <div key={i} className={`rounded-2xl border ${i===1? 'border-black': 'border-gray-200'} bg-white p-6 shadow-sm` }>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${i===1? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>{p.sub}</span>
                </div>
                <div className="mt-4 text-3xl font-bold">{p.price}</div>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {p.features.map((f, j) => <li key={j}>• {f}</li>)}
                </ul>
                <a href={i===2? '/contact' : '/signup'} className={`mt-6 inline-block w-full text-center px-4 py-3 rounded-xl font-medium ${i===1? 'bg-black text-white hover:bg-black/90' : 'border border-gray-200 hover:bg-gray-50'}`}>{p.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="sss" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-center">Sık sorulan sorular</h2>
          <div className="mt-10 divide-y divide-gray-200 border rounded-2xl">
            {[
              {q:"Verilerim güvende mi?", a:"Evet. Veriler şifreli saklanır ve sadece yetkili kullanıcılar erişebilir. Müşteri verileri model eğitiminde kullanılmaz."},
              {q:"Hangi dosya türlerini destekliyor?", a:"PDF, DOCX ve TXT ile başlayacağız; kapsamı aşamalı olarak genişleteceğiz."},
              {q:"Kurumsal teklif alabilir miyim?", a:"Evet. Ekip planı için bizimle iletişime geçebilirsiniz."},
            ].map((item, i) => (
              <details key={i} className="group open:bg-gray-50">
                <summary className="cursor-pointer list-none p-5 font-medium flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600">{item.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/contact" className="text-sm font-medium underline underline-offset-4">Başka sorunuz mu var? Bize yazın →</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-black text-white p-8 sm:p-12 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-semibold">Hukuk işlerinizi bir üst seviyeye taşıyın</h3>
              <p className="mt-2 text-white/80">Lexnova AL, sizin için arka planda araştırır, yazar ve önerir. Siz stratejiye odaklanın.</p>
            </div>
            <div className="flex md:justify-end items-center gap-3">
              <a href="/signup" className="px-5 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90">Ücretsiz Dene</a>
              <a href="/demo" className="px-5 py-3 rounded-xl border border-white/20 font-medium hover:bg-white/10">Canlı Demo</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-10 text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500">© {new Date().getFullYear()} Lexnova AL</p>
          <div className="flex items-center gap-4 text-gray-500">
            <a href="/terms" className="hover:text-gray-700">Kullanım Şartları</a>
            <a href="/privacy" className="hover:text-gray-700">Gizlilik</a>
            <a href="mailto:info@lexnoval.com" className="hover:text-gray-700">info@lexnoval.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
