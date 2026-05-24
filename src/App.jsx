import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

export default function App() {
  // =========================================================
  // HELPERS
  // =========================================================
  const calculateDaysTogether = () => {
    const startDate = new Date('2025-10-03T00:00:00');
    const today = new Date();

    const diffTime =
      today.getTime() - startDate.getTime();

    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 ? diffDays : 0;
  };

  // =========================================================
  // STATE
  // =========================================================
  const [daysTogether] =
    useState(calculateDaysTogether);

  const [isUnlocked, setIsUnlocked] =
    useState(false);

  const [formGate, setFormGate] = useState({
    name: '',
    date: '',
    drink: '',
  });

  const [gateError, setGateError] =
    useState('');

  const [loading, setLoading] = useState(true);

  const [loadingText, setLoadingText] =
    useState('initializing memories...');

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [answers, setAnswers] = useState({
    futureSelf: '',
    firstMeet: '',
    futureRelationship: '',
  });

  const [scrollProgress, setScrollProgress] =
    useState(0);

  const [showTopButton, setShowTopButton] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState('');

  const [musicVolume, setMusicVolume] =
    useState(0.7);

  const [showVolumeSlider, setShowVolumeSlider] =
    useState(false);

  // =========================================================
  // MEMOIZED STARS
  // =========================================================
  const stars = useMemo(() => {
    if (typeof window === 'undefined') return [];

    return Array.from({ length: 70 }).map(() => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.4,
      duration: Math.random() * 4 + 2,
    }));
  }, []);

  // =========================================================
  // REFS
  // =========================================================
  const audioRef = useRef(null);
  const timersRef = useRef([]);

  // =========================================================
  // EFFECTS
  // =========================================================
  useEffect(() => {
    if (!isUnlocked) return;

    const sequence = [
      {
        time: 1000,
        text: 'loading favorite person...',
      },
      {
        time: 2200,
        text: 'connecting two hearts across 1.550 km...',
      },
      {
        time: 3400,
        text: '100%',
      },
      {
        time: 4300,
        text: 'for someone special, born on may 22 💚',
      },
    ];

    timersRef.current.forEach(clearTimeout);

    timersRef.current = [];

    sequence.forEach((item) => {
      const timer = setTimeout(() => {
        setLoadingText(item.text);
      }, item.time);

      timersRef.current.push(timer);
    });

    const finalTimer = setTimeout(() => {
      setLoading(false);
    }, 5600);

    timersRef.current.push(finalTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [isUnlocked]);

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        (window.scrollY / totalHeight) * 100;

      setScrollProgress(progress);

      setShowTopButton(window.scrollY > 500);
    };

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      !isUnlocked || loading
        ? 'hidden'
        : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isUnlocked, loading]);

  useEffect(() => {
    const saved =
      localStorage.getItem('love-answers');

    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'love-answers',
      JSON.stringify(answers)
    );
  }, [answers]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    if (!isUnlocked || loading) return;

    const autoPlay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
      } catch (err) {
        console.log('autoplay blocked:', err);
      }
    };

    const timer = setTimeout(() => {
      autoPlay();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isUnlocked, loading]);

  // =========================================================
  // FUNCTIONS
  // =========================================================
  const handleGateInput = useCallback(
    (field, value) => {
      setFormGate((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleAnswerInput = useCallback(
    (field, value) => {
      setAnswers((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleUnlockGate = () => {
    const isDateValid =
      formGate.date === '2205';

    const isDrinkValid =
      formGate.drink
        .trim()
        .toLowerCase() === 'matcha';

    if (
      formGate.name.trim() === '' ||
      !isDateValid ||
      !isDrinkValid
    ) {
      setGateError(
        'aww, akses ditolak! coba cek nama, tanggal lahir, atau minuman favorit kamu lagi ya, sayangg 🤨'
      );

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

      setIsPlaying((prev) => !prev);
    } catch (err) {
      console.log('audio blocked:', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSendLiveWish = () => {
    const message =
      `💚 JAWABAN DARI SAYANGG 💚\n\n` +
      `1. Di umur baru ini, kamu pengen jadi versi diri yang kayak gimana?\n` +
      `👉 ${answers.futureSelf || '-'}\n\n` +
      `2. Kalau nanti kita akhirnya ketemu, hal pertama yang pengen kita lakuin apa?\n` +
      `👉 ${answers.firstMeet || '-'}\n\n` +
      `3. Menurut kamu, hubungan kita bakal kayak apa beberapa tahun lagi?\n` +
      `👉 ${answers.futureRelationship || '-'}`;

    window.open(
      `https://wa.me/6285773615870?text=${encodeURIComponent(
        message
      )}`,
      '_blank'
    );
  };

  // =========================================================
  // COMPONENTS
  // =========================================================
  const SectionTitle = ({
    title,
    subtitle,
  }) => (
    <div className="space-y-1 text-center">
      <h2 className="text-xl italic font-serif text-slate-200">
        {title}
      </h2>

      <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">
        {subtitle}
      </p>
    </div>
  );

  const ImageCard = ({ src, alt }) => (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="w-full overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 shadow-2xl"
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-auto w-full object-cover transition duration-700 hover:scale-[1.02]"
      />
    </motion.div>
  );

  const TextareaField = ({
    label,
    placeholder,
    value,
    onChange,
  }) => (
    <div className="space-y-2">
      <label className="block text-xs font-medium leading-relaxed text-slate-300">
        {label}
      </label>

      <textarea
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#7BAE7F]"
      />
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070b] font-sans text-white selection:bg-[#7BAE7F]/20">

      {/* SCROLL PROGRESS */}
      <motion.div
        className="fixed left-0 top-0 z-[9999] h-[3px] bg-[#7BAE7F]"
        animate={{
          width: `${scrollProgress}%`,
        }}
      />

      {/* AUDIO */}
      <audio
        ref={audioRef}
        src="/sayangnyaa-masss-ultah/about-you.mp3"
        loop
        preload="metadata"
      />

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* gradient */}
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#7BAE7F]/10 blur-[120px]" />

        {/* stars */}
        {stars.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* GATE */}
      <AnimatePresence>
        {!isUnlocked && (
          <motion.div
            exit={{
              opacity: 0,
              scale: 0.98,
            }}
            transition={{
              duration: 0.8,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#05070b] p-4"
          >
            <div className="w-full max-w-sm space-y-5 rounded-3xl border border-[#7BAE7F]/20 bg-[#0c1118] p-8 text-center shadow-2xl">

              <motion.span
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className="block text-4xl"
              >
                🔒
              </motion.span>

              <div className="space-y-2">
                <h1 className="text-xl font-bold uppercase tracking-wider text-[#7BAE7F]">
                  strictly personal
                </h1>

                <p className="text-xs text-slate-400">
                  web ini dikunci khusus buat kamu, sayangg
                </p>
              </div>

              <div className="space-y-3 pt-2">

                <input
                  type="text"
                  value={formGate.name}
                  placeholder="nama panggilan kamu..."
                  onChange={(e) =>
                    handleGateInput(
                      'name',
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200 outline-none transition focus:border-[#7BAE7F]"
                />

                <input
                  type="text"
                  maxLength={4}
                  value={formGate.date}
                  placeholder="tanggal lahir (2205)"
                  onChange={(e) =>
                    handleGateInput(
                      'date',
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-center font-mono text-xs tracking-widest text-slate-200 outline-none transition focus:border-[#7BAE7F]"
                />

                <input
                  type="text"
                  value={formGate.drink}
                  placeholder="minuman favorit kamu? 😜"
                  onChange={(e) =>
                    handleGateInput(
                      'drink',
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200 outline-none transition focus:border-[#7BAE7F]"
                />
              </div>

              <AnimatePresence mode="wait">
                {gateError && (
                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="px-1 text-[11px] leading-relaxed text-rose-400"
                  >
                    {gateError}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                onClick={handleUnlockGate}
                className="w-full rounded-xl bg-[#7BAE7F] py-3 text-xs font-bold uppercase tracking-widest text-slate-950 shadow-lg shadow-[#7BAE7F]/10 transition-all hover:bg-green-400 active:scale-95"
              >
                buka kado ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING */}
      <AnimatePresence>
        {isUnlocked && loading && (
          <motion.div
            exit={{
              opacity: 0,
              filter: 'blur(10px)',
            }}
            transition={{
              duration: 1,
            }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#05070b] p-4"
          >
            <div className="absolute h-[250px] w-[250px] animate-pulse rounded-full bg-[#7BAE7F] opacity-10 blur-[100px]" />

            <motion.p
              key={loadingText}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="text-center font-mono text-xs uppercase leading-relaxed tracking-[0.3em] text-slate-300"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      {isUnlocked && !loading && (
        <>
          {/* CLOCK */}
          <div className="fixed right-5 top-5 z-50 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-mono tracking-widest text-[#7BAE7F] backdrop-blur-xl">
            {currentTime}
          </div>

          {/* TOP BUTTON */}
          <AnimatePresence>
            {showTopButton && (
              <motion.button
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#7BAE7F] text-lg text-slate-950 shadow-2xl transition hover:scale-105"
              >
                ↑
              </motion.button>
            )}
          </AnimatePresence>

          <div className="relative z-10 mx-auto max-w-xl space-y-24 px-4 pb-24">

            {/* MUSIC */}
            <section className="space-y-8 rounded-3xl border border-white/5 bg-slate-900/20 p-6 py-24 text-center">

              <div className="space-y-2">
                <h2 className="font-serif text-sm italic text-slate-300">
                  every time this song plays,
                </h2>

                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  masss always think about you
                </p>
              </div>

              <div className="relative flex items-center justify-center py-4">

                <motion.div
                  animate={{
                    rotate: isPlaying
                      ? 360
                      : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: 'linear',
                  }}
                  className="h-48 w-48 overflow-hidden rounded-full border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                >
                  <img
                    src="/sayangnyaa-masss-ultah/ABOUT_YOU.png"
                    alt="vinyl"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                {isPlaying && (
                  <motion.div
                    animate={{
                      scale: [1, 1.18, 1],
                      opacity: [
                        0.4,
                        0,
                        0.4,
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                    }}
                    className="absolute inset-0 rounded-full border border-[#7BAE7F]/30"
                  />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-200">
                  about you
                </h3>

                <p className="text-[9px] uppercase tracking-[0.25em] text-[#7BAE7F]">
                  the 1975
                </p>
              </div>

              {/* VOLUME */}
              <div className="space-y-3">
                <button
                  onClick={toggleMusic}
                  className="rounded-full bg-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-950 shadow-md transition-all hover:bg-[#7BAE7F] hover:text-white active:scale-95"
                >
                  {isPlaying
                    ? 'pause music ⏸'
                    : 'play music ▶'}
                </button>

                <button
                  onClick={() =>
                    setShowVolumeSlider(
                      (prev) => !prev
                    )
                  }
                  className="block mx-auto text-[10px] uppercase tracking-[0.2em] text-slate-500"
                >
                  volume settings
                </button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="mx-auto w-[220px]"
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={musicVolume}
                        onChange={(e) =>
                          setMusicVolume(
                            Number(
                              e.target.value
                            )
                          )
                        }
                        className="w-full accent-[#7BAE7F]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* COUNTER */}
            <section className="flex items-center justify-center py-6">
              <div className="w-full rounded-3xl border border-white/5 bg-slate-900/30 px-8 py-6 text-center shadow-xl backdrop-blur-md">

                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#7BAE7F]">
                  together since
                </p>

                <motion.h1
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  whileInView={{
                    scale: 1,
                    opacity: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="pt-3 text-5xl font-black text-white"
                >
                  {daysTogether}
                </motion.h1>

                <p className="pt-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                  days with you 💚
                </p>

                <div className="my-5 h-px w-full bg-white/5" />

                <p className="mx-auto max-w-[220px] text-center text-[11px] leading-relaxed text-slate-500">
  sejak 3 october 2025, dan masss masih tetep
  bersyukur karena random chat itu ternyata
  bawa masss ke sayanggg.
</p>
              </div>
            </section>

            {/* HERO */}
            <section className="flex min-h-screen flex-col items-center justify-center space-y-8 text-center">

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.2,
                }}
                className="space-y-6"
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-[#7BAE7F]/70">
                  3 october 2025
                </h3>

                <h1 className="px-2 font-serif text-2xl italic leading-relaxed text-white md:text-4xl">
                  the day i met someone
                  <br />
                  through a random
                  telegram chat...
                </h1>

                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  and somehow, she became
                  my favorite person.
                </p>
              </motion.div>

              <ImageCard
                src="/sayangnyaa-masss-ultah/photo1.jpeg"
                alt="opening"
              />

              <span className="animate-bounce pt-4 text-[10px] uppercase tracking-widest text-slate-500">
                scroll slowly ↓
              </span>
            </section>

            {/* MAP */}
            <section className="space-y-4">
              <SectionTitle
                title="distance means nothing"
                subtitle="bekasi ↔ sanggau (1.550 km)"
              />

              <ImageCard
                src="/sayangnyaa-masss-ultah/Map.png"
                alt="map"
              />
            </section>

            {/* PHOTOBOOTH */}
            <section className="space-y-4">
              <SectionTitle
                title="photobooth memories"
                subtitle="pieces of you"
              />

              <ImageCard
                src="/sayangnyaa-masss-ultah/photo.png"
                alt="photobooth"
              />
            </section>

            {/* CHAT */}
            <section className="space-y-4">
              <SectionTitle
                title="tiny conversations, huge meanings"
                subtitle="screenshots i secretly keep"
              />

              <ImageCard
                src="/sayangnyaa-masss-ultah/chat-dumb.png"
                alt="chat"
              />
            </section>

            {/* MESSAGE */}
            <section className="space-y-4">
              <SectionTitle
                title="a little message for you"
                subtitle="from your favorite boy"
              />

              <ImageCard
                src="/sayangnyaa-masss-ultah/pesan.png"
                alt="message"
              />
            </section>

            {/* FORM */}
            <section className="space-y-6 rounded-3xl border border-[#7BAE7F]/10 bg-[#0c1118]/90 p-6 shadow-xl backdrop-blur-md">

              <div className="space-y-1 text-center">
                <h2 className="font-serif text-lg italic text-slate-200">
                  one more thing...
                </h2>

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#7BAE7F]">
                  answer honestly 💚
                </p>
              </div>

              <div className="space-y-5">

                <TextareaField
                  label='“di umur baru ini, kamu pengen jadi versi diri yang kayak gimana?”'
                  placeholder='tulis di sini ya, sayangg...'
                  value={
                    answers.futureSelf
                  }
                  onChange={(e) =>
                    handleAnswerInput(
                      'futureSelf',
                      e.target.value
                    )
                  }
                />

                <TextareaField
                  label='“kalau nanti kita akhirnya ketemu, hal pertama yang pengen kita lakuin apa?”'
                  placeholder='pengen jalan bareng atau nge-matcha? 🍵'
                  value={
                    answers.firstMeet
                  }
                  onChange={(e) =>
                    handleAnswerInput(
                      'firstMeet',
                      e.target.value
                    )
                  }
                />

                <TextareaField
                  label='“menurut kamu, hubungan kita bakal kayak apa beberapa tahun lagi?”'
                  placeholder='ceritain ekspektasi kamu...'
                  value={
                    answers.futureRelationship
                  }
                  onChange={(e) =>
                    handleAnswerInput(
                      'futureRelationship',
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={
                    handleSendLiveWish
                  }
                  className="w-full rounded-xl bg-[#7BAE7F] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-950 shadow-md shadow-[#7BAE7F]/5 transition-all hover:bg-green-400 active:scale-[0.99]"
                >
                  kirim jawaban ke
                  masss 💚
                </button>
              </div>
            </section>

            {/* ENDING */}
            <section className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4 text-center">

              <h1 className="bg-gradient-to-r from-white via-slate-300 to-[#7BAE7F] bg-clip-text text-3xl font-black uppercase leading-tight tracking-wide text-transparent md:text-4xl">
                happy birthday,
                <br />
                my favorite person 💚
              </h1>

              <p className="max-w-xs font-mono text-xs leading-relaxed text-slate-500">
                and in every universe,
                masss would still choose
                you.
              </p>

              <span className="block pt-6 font-mono text-[10px] uppercase tracking-widest text-[#7BAE7F]">
                — from your favorite
                telegram boy
              </span>
            </section>
          </div>
        </>
      )}
    </div>
  );
}