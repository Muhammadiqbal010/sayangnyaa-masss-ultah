import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // =========================================================
  // STATE
  // =========================================================
  
  // PERBAIKAN TOTAL: Hitung hari langsung lewat Lazy Initial State agar aman dari Cascading Render
  const [daysTogether] = useState(() => {
    const startDate = new Date('2025-10-03T00:00:00');
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputName, setInputName] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [inputMatcha, setInputMatcha] = useState('');
  const [gateError, setGateError] = useState('');

  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('initializing memories...');
  const [isPlaying, setIsPlaying] = useState(false);

  // Form State
  const [futureSelf, setFutureSelf] = useState('');
  const [firstMeet, setFirstMeet] = useState('');
  const [futureRelationship, setFutureRelationship] = useState('');

  // Lazy Initial State untuk Bintang (Aman dari React Compiler v19)
  const [stars] = useState(() => {
    if (typeof window === 'undefined') return [];
    return Array.from({ length: 60 }).map(() => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.4,
      duration: Math.random() * 3 + 2,
    }));
  });

  const audioRef = useRef(null);
  const timersRef = useRef([]);

  // =========================================================
  // EFFECTS
  // =========================================================
  useEffect(() => {
    if (isUnlocked) {
      const sequence = [
        { time: 1000, text: 'loading favorite person...' },
        { time: 2200, text: 'connecting two hearts across 1.550 km...' },
        { time: 3400, text: '100%' },
        { time: 4200, text: 'for someone special, born on may 22 💚' },
      ];

      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];

      sequence.forEach((item) => {
        const timer = setTimeout(() => setLoadingText(item.text), item.time);
        timersRef.current.push(timer);
      });

      const finalTimer = setTimeout(() => setLoading(false), 5500);
      timersRef.current.push(finalTimer);
    }

    return () => timersRef.current.forEach(clearTimeout);
  }, [isUnlocked]);

  // Audio Cleanup
  useEffect(() => {
    const currentAudio = audioRef.current;
    return () => {
      if (currentAudio) currentAudio.pause();
    };
  }, []);

  // =========================================================
  // FUNCTIONS
  // =========================================================
  const handleUnlockGate = () => {
    if (
      inputName.trim() === '' ||
      inputDate !== '2205' ||
      inputMatcha.trim().toLowerCase() !== 'matcha'
    ) {
      setGateError('aww, akses ditolak! coba cek nama, tanggal lahir, atau minuman favorit kamu lagi ya, sayangg 🤨');
      return;
    }

    setGateError('');
    setIsUnlocked(true);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.log("Audio play blocked:", err);
    }
  };

  const handleSendLiveWish = () => {
    const message = `💚 JAWABAN DARI SAYANGG 💚\n\n` +
      `1. Di umur baru ini, kamu pengen jadi versi diri yang kayak gimana?\n` +
      `👉 ${futureSelf || '-'}\n\n` +
      `2. Kalau nanti kita akhirnya ketemu, hal pertama yang pengen kita lakuin apa?\n` +
      `👉 ${firstMeet || '-'}\n\n` +
      `3. Menurut kamu, hubungan kita bakal kayak apa beberapa tahun lagi?\n` +
      `👉 ${futureRelationship || '-'}`;

    window.open(`https://wa.me/6285773615870?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-[#05070b] text-white min-h-screen overflow-x-hidden relative font-sans selection:bg-[#7BAE7F]/20">

      {/* AUDIO */}
      <audio ref={audioRef} src="/sayangnyaa-masss-ultah/about-you.mp3" loop preload="metadata" />

      {/* Background Stars */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${s.width}px`,
              height: `${s.height}px`,
              top: `${s.top}%`,
              left: `${s.left}%`,
              opacity: s.opacity,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* GATE SECTION */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#05070b] z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#0c1118] border border-[#7BAE7F]/20 rounded-3xl p-8 w-full max-w-sm space-y-4 shadow-2xl text-center">
              <span className="text-4xl block animate-bounce">🔒</span>
              <h1 className="text-[#7BAE7F] font-bold text-xl tracking-wider uppercase">strictly personal</h1>
              <p className="text-xs text-slate-400">web ini dikunci khusus buat kamu, sayangg</p>

              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="nama panggilan kamu..."
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-[#7BAE7F] transition text-slate-200"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                />
                <input
                  type="text"
                  maxLength={4}
                  placeholder="tanggal lahir (contoh: DD/MM (3108))"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-center font-mono tracking-widest outline-none focus:border-[#7BAE7F] transition text-slate-200"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="minuman favorit kamu? 😜"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-[#7BAE7F] transition text-slate-200"
                  value={inputMatcha}
                  onChange={(e) => setInputMatcha(e.target.value)}
                />
              </div>

              {gateError && (
                <p className="text-rose-400 text-[11px] font-mono leading-relaxed px-1">
                  {gateError}
                </p>
              )}

              <button
                onClick={handleUnlockGate}
                className="w-full bg-[#7BAE7F] text-slate-950 py-3 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-green-400 transition-all active:scale-95 shadow-lg shadow-[#7BAE7F]/10"
              >
                buka kado ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING SECTION */}
      <AnimatePresence>
        {isUnlocked && loading && (
          <motion.div
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-40 bg-[#05070b] flex items-center justify-center p-4"
          >
            <div className="absolute w-[250px] h-[250px] bg-[#7BAE7F] rounded-full filter blur-[100px] opacity-10 animate-pulse pointer-events-none" />
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs uppercase tracking-[0.3em] text-slate-300 font-mono text-center leading-relaxed"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {isUnlocked && !loading && (
        <div className="relative z-10 max-w-xl mx-auto px-4 pb-24 space-y-24">
          
          {/* Counter Together */}
          <section className="flex justify-center items-center py-6 pt-12">
            <div className="bg-slate-900/30 border border-white/5 rounded-3xl px-8 py-6 text-center backdrop-blur-md shadow-xl w-full">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#7BAE7F] font-mono">
                together since
              </p>
              <h1 className="text-5xl font-black text-white pt-3">
                {daysTogether}
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-[0.25em] pt-2">
                days with you 💚
              </p>
              <div className="w-full h-px bg-white/5 my-5" />
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                sejak 3 october 2025, dan masss masih tetep bersyukur karena random chat itu ternyata bawa masss ke sayanggg.
              </p>
            </div>
          </section>

          {/* Opening Section */}
          <section className="min-h-screen flex flex-col justify-center items-center text-center space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="space-y-6">
              <h3 className="text-xs tracking-[0.4em] uppercase text-[#7BAE7F]/70 font-mono">3 october 2025</h3>
              <h1 className="text-2xl md:text-4xl italic font-serif text-white leading-relaxed px-2">
                the day i met someone<br />through a random telegram chat...
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                and somehow, she became my favorite person.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }} className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
              <img src="/sayangnyaa-masss-ultah/photo1.jpeg" alt="Opening Moments" className="w-full h-auto object-cover" loading="lazy" />
            </motion.div>

            <span className="text-[10px] uppercase tracking-widest text-slate-500 animate-bounce pt-4 block">scroll slowly ↓</span>
          </section>

          {/* LDR Map */}
          <section className="space-y-4 pt-12">
            <div className="text-center space-y-1">
              <h2 className="text-xl italic font-serif tracking-wide text-slate-200">distance means nothing</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#7BAE7F]">bekasi ↔ sanggau (1.550 km)</p>
            </div>
            <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
              <img src="/sayangnyaa-masss-ultah/Map.png" alt="LDR Map" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          {/* Photobooth */}
          <section className="space-y-4 pt-12">
            <div className="text-center space-y-1">
              <h2 className="text-xl italic font-serif text-slate-200">photobooth memories</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">pieces of you</p>
            </div>
            <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
              <img src="/sayangnyaa-masss-ultah/photo.png" alt="Photobooth" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          {/* Chat Dump */}
          <section className="space-y-4 pt-12">
            <div className="text-center space-y-1">
              <h2 className="text-xl italic font-serif text-slate-200">tiny conversations, huge meanings</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">screenshots i secretly keep</p>
            </div>
            <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
              <img src="/sayangnyaa-masss-ultah/chat-dumb.png" alt="Chat Dump" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          {/* Vinyl Music */}
          <section className="flex flex-col justify-center items-center text-center p-6 bg-slate-900/20 border border-white/5 rounded-3xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-serif italic text-slate-300">every time this song plays,</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">masss always think about you</p>
            </div>

            <div className="relative flex justify-center items-center py-2">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                className="w-48 h-48 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden border-4 border-slate-800"
              >
                <img src="/sayangnyaa-masss-ultah/vinyl.png" alt="Vinyl" className="w-full h-full object-cover" loading="lazy" />
              </motion.div>

              {isPlaying && (
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="absolute inset-0 rounded-full border border-[#7BAE7F]/30 pointer-events-none"
                />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="uppercase tracking-[0.3em] text-xs font-bold text-slate-200">about you</h3>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#7BAE7F]">the 1975</p>
            </div>

            <button
              onClick={toggleMusic}
              className="bg-white text-slate-950 px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#7BAE7F] hover:text-white transition-all shadow-md active:scale-95"
            >
              {isPlaying ? 'pause music ⏸' : 'play music ▶'}
            </button>
          </section>

          {/* Pesan Section */}
          <section className="space-y-4 pt-12">
            <div className="text-center space-y-1">
              <h2 className="text-xl italic font-serif text-slate-200">a little message for you</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">from your favorite boy</p>
            </div>
            <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40">
              <img src="/sayangnyaa-masss-ultah/pesan.png" alt="Love Message" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </section>

          {/* Form Section */}
          <section className="bg-[#0c1118]/90 border border-[#7BAE7F]/10 rounded-3xl p-6 shadow-xl space-y-6 backdrop-blur-md">
            <div className="text-center space-y-1">
              <h2 className="text-lg italic font-serif text-slate-200">one more thing...</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#7BAE7F]">answer honestly 💚</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-medium leading-relaxed">
                  “di umur baru ini, kamu pengen jadi versi diri yang kayak gimana?”
                </label>
                <textarea
                  rows={3}
                  value={futureSelf}
                  placeholder="Tulis di sini ya, sayangg..."
                  onChange={(e) => setFutureSelf(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-[#7BAE7F] resize-none text-slate-200 placeholder:text-slate-600 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-medium leading-relaxed">
                  “kalau nanti kita akhirnya ketemu, hal pertama yang pengen kita lakuin apa?”
                </label>
                <textarea
                  rows={3}
                  value={firstMeet}
                  placeholder="Pengen jalan bareng atau nge-matcha? 🍵"
                  onChange={(e) => setFirstMeet(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-[#7BAE7F] resize-none text-slate-200 placeholder:text-slate-600 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300 block font-medium leading-relaxed">
                  “menurut kamu, hubungan kita bakal kayak apa beberapa tahun lagi?”
                </label>
                <textarea
                  rows={3}
                  value={futureRelationship}
                  placeholder="Ceritain ekspektasi kamu..."
                  onChange={(e) => setFutureRelationship(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-[#7BAE7F] resize-none text-slate-200 placeholder:text-slate-600 transition"
                />
              </div>

              <button
                onClick={handleSendLiveWish}
                className="w-full bg-[#7BAE7F] text-slate-950 py-3.5 rounded-xl uppercase tracking-[0.15em] text-xs font-bold hover:bg-green-400 transition-all active:scale-[0.99] shadow-md shadow-[#7BAE7F]/5"
              >
                kirim jawaban ke masss 💚
              </button>
            </div>
          </section>

          {/* Ending */}
          <section className="min-h-[60vh] flex flex-col justify-center items-center text-center space-y-4 px-4">
            <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight bg-gradient-to-r from-white via-slate-300 to-[#7BAE7F] bg-clip-text text-transparent tracking-wide">
              happy birthday,<br />my favorite person 💚
            </h1>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-mono">
              and in every universe, masss would still choose you.
            </p>
            <span className="text-[10px] font-mono text-[#7BAE7F] tracking-widest uppercase pt-6 block">
              — from your favorite telegram boy
            </span>
          </section>

        </div>
      )}
    </div>
  );
}