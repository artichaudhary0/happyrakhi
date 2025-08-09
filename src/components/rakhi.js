import React, { useEffect, useMemo, useRef, useState } from "react";
import Lottie from 'lottie-react';
import QRCode from 'qrcode';

// ------------------------------------------------------------
// Digital Bandhan — single-file React app
// TailwindCSS assumed available by the environment.
// No external JS libs required. Works as a one‑pager with two flows.
// ------------------------------------------------------------

// --- Utilities ------------------------------------------------
const rupeeTiles = [101, 151, 251, 501, 1001];
const aiMessages = [
  "Though miles apart, my love and prayers are always with you. Happy Raksha Bandhan! ❤️",
  "This Rakhi carries threads of love, memories, and my best wishes. 💖",
  "Rakhi is just a thread, but our bond is unbreakable. Miss you!",
  "No matter how grown up we get, you’ll always be my little partner-in-crime 😜",
  "Distance may keep us apart, but this Rakhi keeps us connected."
];

function onlyDigits(s = "") {
  return (s || "").replace(/\D/g, "");
}

function makeWhatsAppLink(phone, text) {
  const p = onlyDigits(phone);
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

function makeUPILink({ pa, pn = "", am = "", tn = "Rakhi Gift" }) {
  const q = new URLSearchParams();
  q.set("pa", pa);
  if (pn) q.set("pn", pn);
  if (am) q.set("am", String(am));
  q.set("tn", tn);
  return `upi://pay?${q.toString()}`;
}

// Validate UPI ID format
function isValidUPI(upiId) {
  if (!upiId || typeof upiId !== 'string') return false;

  // UPI ID format: username@bank (e.g., john@paytm, user123@ybl, name@okaxis)
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;

  // Check basic format
  if (!upiRegex.test(upiId)) return false;

  // Check for common UPI handles
  const commonHandles = [
    'paytm', 'phonepe', 'ybl', 'okaxis', 'okicici', 'okhdfcbank',
    'oksbi', 'okbizaxis', 'ibl', 'axl', 'upi', 'gpay', 'amazonpay'
  ];

  const handle = upiId.split('@')[1];
  return commonHandles.some(validHandle => handle.includes(validHandle));
}

// QR Code component for UPI payments
function UPIQRCode({ upiId, amount }) {
  const [qrDataURL, setQrDataURL] = useState("");

  useEffect(() => {
    if (upiId && amount) {
      // Create optimized UPI string that works with both PhonePe and banking apps
      const upiString = `upi://pay?pa=${upiId}&pn=Digital%20Bandhan&am=${amount}&cu=INR&tn=Rakhi%20Gift`;

      // Generate QR code with settings optimized for maximum compatibility
      QRCode.toDataURL(upiString, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'L', // Lower error correction for better compatibility
        type: 'image/png',
        quality: 0.9,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      .then(url => setQrDataURL(url))
      .catch(err => console.error('QR Code generation failed:', err));
    }
  }, [upiId, amount]);

  if (!qrDataURL) return null;

  return (
    <div className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-xl border border-amber-200 shadow-sm max-w-xs mx-auto">
      <div className="text-xs sm:text-sm font-medium text-amber-900 mb-2 text-center">
        Universal UPI QR Code
      </div>
      <div className="bg-white p-3 rounded-lg border-2 border-gray-200">
        <img src={qrDataURL} alt="UPI Payment QR Code" className="block w-32 h-32 sm:w-40 sm:h-40" />
      </div>
      <div className="text-xs text-amber-700 mt-2 text-center font-medium">
        Scan to pay ₹{amount}
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        Camera might not work - open UPI directly
      </div>
    </div>
  );
}



function useQueryParams() {
  const [params, setParams] = useState(() => new URLSearchParams(window.location.search));
  useEffect(() => {
    const onPop = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return params;
}

function pushQuery(params) {
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? "?" + qs : ""}`;
  window.history.pushState({}, "", url);
}

// --- Visual Bits ------------------------------------------------
function SparkleBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50" />
      {/* floating marigold dots */}
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-300/70 animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${8 + Math.random() * 8}s`
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%{ transform: translateY(0) }
          50%{ transform: translateY(-12px) }
          100%{ transform: translateY(0) }
        }
        .animate-float{ animation: float linear infinite; }
      `}</style>
    </div>
  );
}

// Simple SVG Rakhi set (10 variants)
function RakhiSVG({ seed = 0, size = 96 }) {
  const palette = [
    "#C2410C", // orange
    "#B45309", // amber
    "#7C2D12", // deep orange
    "#92400E", // bronze
    "#A21CAF", // magenta
    "#1D4ED8", // blue
    "#16A34A", // green
    "#EA580C", // carrot
    "#D97706", // gold
    "#DC2626"  // red
  ];
  const c = palette[seed % palette.length];
  const c2 = palette[(seed + 3) % palette.length];
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* thread */}
      <path d="M-20 50 Q 20 20 50 50 T 120 50" stroke={c} strokeWidth="3" fill="none" />
      {/* center disc */}
      <circle cx="50" cy="50" r="24" fill="white" stroke={c} strokeWidth="3" />
      <circle cx="50" cy="50" r="18" fill={c} />
      {/* pattern */}
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={50 + 18 * Math.cos((i * Math.PI) / 6)} cy={50 + 18 * Math.sin((i * Math.PI) / 6)} r="2.4" fill={c2} />
      ))}
      {/* sparkle */}
      <circle cx="65" cy="38" r="2" fill="#fff" />
    </svg>
  );
}

function MarqueeRakhis({ onPick }) {
  const items = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  const trackRef = useRef(null);
  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-8 py-6 animate-marquee will-change-transform"
        style={{ animationDuration: "22s" }}
      >
        {items.concat(items).map((i, idx) => (
          <button
            key={idx}
            className="shrink-0 rounded-2xl bg-white/70 shadow hover:shadow-lg border border-amber-100 p-3 backdrop-blur-xl transition-transform hover:-translate-y-1"
            onClick={() => onPick(i)}
            aria-label={`Select Rakhi ${i + 1}`}
          >
            <RakhiSVG seed={i} />
          </button>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee linear infinite; }
      `}</style>
    </div>
  );
}

function BoxPackAnimation({ rakhiSeed = 0, onDone }) {
  const [phase, setPhase] = useState(0); // 0: waiting, 1: rakhi drops, 2: box opens, 3: rakhi goes in, 4: complete
  const lottieRef = useRef();
  const [giftBoxData, setGiftBoxData] = useState(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Load the gift box animation data
  useEffect(() => {
    fetch('/gift_box.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Gift box data loaded successfully');
        setGiftBoxData(data);
      })
      .catch(error => {
        console.error('Error loading gift box animation:', error);
        // Set a flag to use fallback animation
        setGiftBoxData('fallback');
      });
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);   // rakhi appears
    const t2 = setTimeout(() => setPhase(2), 1200);  // box opens
    const t3 = setTimeout(() => setPhase(3), 2400);  // rakhi drops into box
    const t4 = setTimeout(() => setPhase(4), 3600);  // WAIT for rakhi to be inside, THEN close
    const t5 = setTimeout(() => onDone && onDone(), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [onDone]);

  // Control Lottie animation: open when phase 2, close when phase 4
  useEffect(() => {
    if (lottieRef.current && giftBoxData) {
      if (phase === 2 && !animationStarted) {
        // Box opens and stays open
        lottieRef.current.play();
        setAnimationStarted(true);
      } else if (phase === 4) {
        // NOW close the box - restart animation to show closing
        lottieRef.current.goToAndPlay(0, true);
      }
    }
  }, [phase, giftBoxData, animationStarted]);

  // Fallback simple box if Lottie fails to load
  if (!giftBoxData) {
    return (
      <div className="relative mt-8 h-64 flex items-center justify-center">
        <div className="text-amber-600">Loading gift box...</div>
      </div>
    );
  }

  // Use fallback simple box animation if Lottie failed
  if (giftBoxData === 'fallback') {
    return (
      <div className="relative mt-8 h-64">
        {/* Rakhi floating and dropping */}
        <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-1200 ease-in-out ${
          phase === 0 ? "-top-6 scale-100 opacity-0" :
          phase === 1 ? "-top-6 scale-100 opacity-100" :
          phase === 2 ? "top-4 scale-90 opacity-100" :
          phase === 3 ? "top-20 scale-70 opacity-100" :
          "top-24 scale-50 opacity-0"
        }`}>
          <div className={phase === 1 ? "animate-pulse" : ""}>
            <RakhiSVG seed={rakhiSeed} size={100} />
          </div>
        </div>

        {/* Simple fallback box */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-32 h-24 bg-gradient-to-b from-amber-200 to-amber-400 border-2 border-amber-600 rounded-lg shadow-lg relative">
            {/* Box flaps */}
            <div className={`absolute -top-2 left-0 w-8 h-6 bg-amber-300 border border-amber-600 rounded-t transition-transform duration-700 ${
              phase >= 2 && phase < 4 ? '-rotate-45 -translate-x-2' : 'rotate-0'
            }`} style={{ transformOrigin: 'bottom right' }} />
            <div className={`absolute -top-2 right-0 w-8 h-6 bg-amber-300 border border-amber-600 rounded-t transition-transform duration-700 ${
              phase >= 2 && phase < 4 ? 'rotate-45 translate-x-2' : 'rotate-0'
            }`} style={{ transformOrigin: 'bottom left' }} />
            <div className={`absolute -top-2 left-8 right-8 h-6 bg-amber-300 border border-amber-600 rounded-t transition-transform duration-700 ${
              phase >= 2 && phase < 4 ? '-translate-y-4' : 'translate-y-0'
            }`} />
          </div>
        </div>

        {/* Sparkles when closing */}
        {phase === 4 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-yellow-400 animate-sparkle"
                style={{
                  top: `${30 + Math.random() * 40}%`,
                  left: `${30 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 0.8}s`
                }}
              />
            ))}
            <style>{`
              @keyframes sparkle {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1); opacity: 1; }
                100% { transform: scale(0); opacity: 0; }
              }
              .animate-sparkle { animation: sparkle 1000ms ease-out forwards; }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative mt-8 h-64">
      {/* Rakhi floating and dropping */}
      <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-1200 ease-in-out ${
        phase === 0 ? "-top-6 scale-100 opacity-0" :
        phase === 1 ? "-top-6 scale-100 opacity-100" :
        phase === 2 ? "top-4 scale-90 opacity-100" :
        phase === 3 ? "top-20 scale-70 opacity-100" :
        "top-24 scale-50 opacity-0"
      }`}>
        <div className={phase === 1 ? "animate-pulse" : ""}>
          <RakhiSVG seed={rakhiSeed} size={100} />
        </div>
      </div>

      {/* Lottie Gift Box Animation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Lottie
          lottieRef={lottieRef}
          animationData={giftBoxData}
          loop={false}
          autoplay={false}
          style={{ width: 200, height: 160 }}
        />
      </div>

      {/* Sparkles when box closes */}
      {phase === 4 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-yellow-400 animate-sparkle"
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${30 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 0.8}s`
              }}
            />
          ))}
          <style>{`
            @keyframes sparkle {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1); opacity: 1; }
              100% { transform: scale(0); opacity: 0; }
            }
            .animate-sparkle { animation: sparkle 1000ms ease-out forwards; }
          `}</style>
        </div>
      )}
    </div>
  );
}

// --- Screens ---------------------------------------------------
function Landing({ onPick }) {
  return (
    <section className="min-h-screen grid place-items-center text-center px-4 py-8">
      <SparkleBg />
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900">Digital Bandhan</h1>
        <p className="mt-3 text-sm sm:text-base text-amber-800/80 px-2">Celebrate Raksha Bandhan with a playful digital rakhi & heartfelt wishes.</p>
        <div className="mt-8 sm:mt-10 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          <button onClick={() => onPick("sister")}
            className="group rounded-2xl bg-white/80 border border-amber-200 p-4 sm:p-6 shadow hover:shadow-lg hover:-translate-y-0.5 transition transform">
            <div className="text-2xl sm:text-3xl">🎀</div>
            <div className="mt-2 text-lg sm:text-xl font-semibold">Send Rakhi to My Brother</div>
            <p className="text-xs sm:text-sm text-amber-700/80 mt-1">Choose a rakhi, pack it, and request a gift via UPI.</p>
          </button>
          <button onClick={() => onPick("brother")}
            className="group rounded-2xl bg-white/80 border border-amber-200 p-4 sm:p-6 shadow hover:shadow-lg hover:-translate-y-0.5 transition transform">
            <div className="text-2xl sm:text-3xl">💌</div>
            <div className="mt-2 text-lg sm:text-xl font-semibold">Send Wishes to My Sister</div>
            <p className="text-xs sm:text-sm text-amber-700/80 mt-1">Write a message and share a gift-card link over WhatsApp.</p>
          </button>
        </div>
        <p className="mt-6 sm:mt-8 text-xs text-amber-700/60 px-4">Sound off by default • No data stored • WhatsApp opens with prefilled text</p>
      </div>
    </section>
  );
}

function SisterFlow() {
  const [picked, setPicked] = useState(null);
  const [packed, setPacked] = useState(false);

  const [broPhone, setBroPhone] = useState("");
  const [upi, setUpi] = useState(""); // e.g., name@upi
  const [amount, setAmount] = useState(rupeeTiles[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [msg, setMsg] = useState("");

  const effectiveAmount = customAmount ? Number(customAmount) || 0 : amount;

  function buildRakhiViewLink() {
    const params = new URLSearchParams();
    params.set("view", "brother");
    params.set("rakhi", String(picked ?? 0));
    if (msg) params.set("m", msg);
    if (upi) params.set("upi", upi);
    if (effectiveAmount) params.set("am", String(effectiveAmount));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleSend() {
    const rakhiLink = buildRakhiViewLink();
    const upiLink = makeUPILink({ pa: upi, am: effectiveAmount, tn: "Rakhi Gift" });

    const text = `Hey Bhai! I’m sending you this digital Rakhi. Open it here: ${rakhiLink}\n\nIf you’d like to send your blessings: ${upiLink}\nHappy Raksha Bandhan! 🎀`;
    let finalText = `Hey Bhai! I'm sending you this digital Rakhi. Open it here: ${rakhiLink}`;

    // Add custom message if provided
    if (msg.trim()) {
      finalText += `\n\n💌 ${msg.trim()}`;
    }

    // Add UPI payment request if provided
    if (upi && effectiveAmount) {
      finalText += `\n\n🎁 If you'd like to send your blessings (₹${effectiveAmount}): ${upiLink}`;
    }

    finalText += `\n\nHappy Raksha Bandhan! 🎀`;

    window.open(makeWhatsAppLink(broPhone, finalText), "_blank");
  }

  return (
    <section className="min-h-screen px-3 sm:px-4 pt-16 pb-24">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 text-center px-2">Choose a Rakhi for Bhai ❤️</h2>

        {!picked && (
          <div className="mt-6">
            <MarqueeRakhis onPick={setPicked} />
            <p className="mt-4 text-center text-sm sm:text-base text-amber-800/80 px-4">Tap a rakhi to preview & pack</p>
          </div>
        )}

        {picked !== null && !packed && (
          <div className="mt-6 text-center">
            <div className="inline-block rounded-2xl bg-white/80 px-3 sm:px-4 py-2 border border-amber-200 shadow">
              <p className="text-sm sm:text-base text-amber-900/90">Nice pick! Packing your rakhi…</p>
            </div>
            <BoxPackAnimation rakhiSeed={picked} onDone={() => setPacked(true)} />
          </div>
        )}

        {packed && (
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6">
            <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
              <label className="block text-sm text-amber-900/80">Brother’s WhatsApp Number</label>
              <input value={broPhone} onChange={(e)=>setBroPhone(e.target.value)} placeholder="e.g., +91 98XXXXXXXX" className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-400" />
            </div>

            <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
              <label className="block text-sm text-amber-900/80">Amount to request (optional)</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {rupeeTiles.map(v => (
                  <button key={v} onClick={()=>{ setAmount(v); setCustomAmount(""); }} className={`px-3 sm:px-4 py-2 rounded-xl border text-sm sm:text-base ${amount===v && !customAmount? "bg-amber-600 text-white border-amber-600" : "border-amber-300 bg-white"}`}>₹{v}</button>
                ))}
                <input value={customAmount} onChange={(e)=>setCustomAmount(e.target.value)} inputMode="numeric" placeholder="Custom" className="px-3 py-2 rounded-xl border border-amber-300 bg-white w-20 sm:w-28 text-sm sm:text-base" />
              </div>
            </div>

            <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="block text-sm text-amber-900/80">Message (optional)</label>
                <button onClick={()=>setMsg(aiMessages[Math.floor(Math.random()*aiMessages.length)])} className="text-xs sm:text-sm underline text-amber-700 self-start sm:ml-auto">✨ Generate</button>
              </div>
              <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} rows={3} placeholder="Write something sweet…" className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-400" />
            </div>

            <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
              <label className="block text-sm text-amber-900/80">Your UPI ID (to receive the gift)</label>
              <input
                value={upi}
                onChange={(e)=>setUpi(e.target.value)}
                placeholder="e.g., yourname@paytm, user@phonepe"
                className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 ${
                  upi && !isValidUPI(upi)
                    ? 'border-red-300 bg-red-50 focus:ring-red-400'
                    : 'border-amber-300 bg-white focus:ring-amber-400'
                }`}
              />
              {upi && (
                <div className="mt-3 text-xs text-amber-800/80">We’ll include a secure UPI payment link for Bhai to scan or tap.</div>
              )}

              {/* UPI Validation Feedback */}
              {upi && !isValidUPI(upi) && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <span>❌</span>
                  <span>Please enter a valid UPI ID (e.g., yourname@paytm)</span>
                </div>
              )}

              {upi && isValidUPI(upi) && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <span>✅</span>
                  <span>Valid UPI ID - Payment link will be included</span>
                </div>
              )}

              {/* Show QR Code ONLY if UPI ID is valid and amount is provided */}
              {isValidUPI(upi) && effectiveAmount && (
                <div className="mt-4 flex justify-center">
                  <UPIQRCode
                    upiId={upi}
                    amount={effectiveAmount}
                  />
                </div>
              )}
            </div>

            <button onClick={handleSend} disabled={!broPhone}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 text-white px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base shadow hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
              📤 Send Rakhi on WhatsApp
            </button>

            <p className="text-xs text-amber-700/60 text-center px-4 mt-3">WhatsApp will open with a prefilled message. You can edit before sending.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function BrotherFlow() {
  const [sisName, setSisName] = useState("");
  const [sisPhone, setSisPhone] = useState("");
  const [giftLink, setGiftLink] = useState("");
  const [msg, setMsg] = useState("");

  function buildWishLink() {
    const params = new URLSearchParams();
    params.set("view", "sister");
    if (msg) params.set("m", msg);
    if (sisName) params.set("n", sisName);
    if (giftLink) params.set("g", giftLink);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleSend() {
    const link = buildWishLink();
    const text = `Hey ${sisName || "Didi"}! Sending you my Raksha Bandhan wishes 💖 Read here: ${link}${giftLink ? `\nAnd a small gift for you: ${giftLink}` : ""}`;
    window.open(makeWhatsAppLink(sisPhone, text), "_blank");
  }

  return (
    <section className="min-h-screen px-3 sm:px-4 pt-16 pb-24">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 text-center px-2">To My Lovely Sister 💖</h2>
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6">
          <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
            <label className="block text-sm text-amber-900/80">Sister’s Name</label>
            <input value={sisName} onChange={(e)=>setSisName(e.target.value)} placeholder="e.g., Aisha" className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="block text-sm text-amber-900/80">Personal Message</label>
              <button onClick={()=>setMsg(aiMessages[Math.floor(Math.random()*aiMessages.length)])} className="text-xs sm:text-sm underline text-amber-700 self-start sm:ml-auto">✨ Suggest</button>
            </div>
            <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} rows={4} placeholder="Write something heartfelt…" className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-5">
            <label className="block text-sm text-amber-900/80">Sister’s WhatsApp Number</label>
            <input value={sisPhone} onChange={(e)=>setSisPhone(e.target.value)} placeholder="e.g., +91 98XXXXXXXX" className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-4 sm:p-5">
            <label className="block text-sm text-amber-900/80">Gift Card Link (optional)</label>
            <input value={giftLink} onChange={(e)=>setGiftLink(e.target.value)} placeholder="Paste Amazon/Flipkart/Myntra card URL" className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-400" />
          </div>

          <button onClick={handleSend} disabled={!sisPhone}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 text-white px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base shadow hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
            📤 Send Wishes on WhatsApp
          </button>

          <p className="text-xs text-amber-700/60 text-center px-4">WhatsApp will open with your personalized message and gift link.</p>
        </div>
      </div>
    </section>
  );
}

function BrotherReceivedView({ params }) {
  const rakhiSeed = Number(params.get("rakhi") || 0);
  const msg = params.get("m") || "Happy Raksha Bandhan!";
  const upi = params.get("upi") || "";
  const am = params.get("am") || "";
  const upiLink = upi ? makeUPILink({ pa: upi, am, tn: "Rakhi Gift" }) : null;
  const qrUrl = upiLink ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}` : null;

  const [reveal, setReveal] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setReveal(1), 600);
    const t2 = setTimeout(() => setReveal(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="min-h-screen px-4 pt-16 pb-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Your Digital Rakhi 🎁</h2>
        <p className="text-amber-800/80 mt-2">A rakhi sent with love — open your surprise</p>

        {/* Box reveal */}
        <div className="relative mt-8 h-64">
          {/* closed box */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-40`}>
            <div className="relative w-full h-full">
              <div className="absolute inset-x-0 bottom-0 h-24 bg-amber-200 rounded-b-2xl shadow-lg border border-amber-300" />
              <div className={`absolute inset-x-0 bottom-24 h-10 bg-amber-300 rounded-t-2xl shadow transition-transform duration-700 origin-bottom ${reveal>=1?"translate-y-24":""}`} />
            </div>
          </div>
          {/* rakhi rises */}
          {reveal>=2 && (
            <div className="absolute left-1/2 -translate-x-1/2 top-10 animate-pulse">
              <RakhiSVG seed={rakhiSeed} size={120} />
            </div>
          )}
        </div>

        <p className="mt-6 text-lg text-amber-900/90 whitespace-pre-line">{msg}</p>

        {upiLink ? (
          <div className="mt-8 grid place-items-center">
            <div className="rounded-2xl bg-white/80 border border-amber-200 shadow p-5">
              <h3 className="font-semibold text-amber-900">Scan or Tap to Send Your Blessings</h3>
              {qrUrl && (
                <img alt="UPI QR" src={qrUrl} className="mt-4 w-40 h-40 mx-auto rounded-lg border" />
              )}
              <a href={upiLink} className="mt-4 inline-block rounded-xl px-4 py-2 bg-amber-600 text-white hover:bg-amber-700">Pay via UPI</a>
              <p className="text-xs text-amber-800/70 mt-2">UPI ID: {upi}{am?` • Suggested ₹${am}`:""}</p>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-amber-700/70">No UPI details were attached.</p>
        )}
      </div>
    </section>
  );
}

function SisterReceivedView({ params }) {
  const msg = params.get("m") || "Happy Raksha Bandhan!";
  const name = params.get("n") || "Sister";
  const gift = params.get("g") || "";
  return (
    <section className="min-h-screen px-4 pt-16 pb-24">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900">For {name} 💖</h2>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full bg-white/80 border border-amber-200 shadow grid place-items-center animate-bounce-slow">🎀</div>
          <p className="text-lg text-amber-900/90 whitespace-pre-line">{msg}</p>
          {gift && (
            <a href={gift} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-amber-600 text-white px-5 py-3 font-semibold shadow hover:bg-amber-700">🎁 View Your Gift</a>
          )}
        </div>
        <style>{`
          @keyframes bounce-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
          .animate-bounce-slow{ animation: bounce-slow 2.2s ease-in-out infinite; }
        `}</style>
      </div>
    </section>
  );
}

// --- Main App --------------------------------------------------
export default function DigitalBandhan() {
  const qp = useQueryParams();
  const view = qp.get("view");

  const [route, setRoute] = useState("home");
  useEffect(() => {
    if (view === "brother") setRoute("brotherView");
    else if (view === "sister") setRoute("sisterView");
  }, [view]);

  function navigate(next) {
    setRoute(next);
    const params = new URLSearchParams(window.location.search);
    params.delete("view"); params.delete("rakhi"); params.delete("m"); params.delete("upi"); params.delete("am"); params.delete("n"); params.delete("g");
    pushQuery(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="font-[Inter,ui-sans-serif] text-amber-900">
      <SparkleBg />

      <header className="fixed top-0 left-0 right-0 z-20 backdrop-blur bg-white/50 border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={()=>navigate("home")} className="flex items-center gap-2 font-semibold text-amber-800">
            <span className="text-xl">🪢</span> Digital Bandhan
          </button>
          <nav className="hidden sm:flex items-center gap-2 text-sm">
            <button onClick={()=>navigate("sister")} className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50">Send Rakhi</button>
            <button onClick={()=>navigate("brother")} className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-50">Send Wishes</button>
          </nav>
        </div>
      </header>

      {route === "home" && <Landing onPick={navigate} />}
      {route === "sister" && <SisterFlow />}
      {route === "brother" && <BrotherFlow />}
      {route === "brotherView" && <BrotherReceivedView params={qp} />}
      {route === "sisterView" && <SisterReceivedView params={qp} />}

      <footer className="py-10 text-center text-xs text-amber-800/60">
        Made with ❤️ for Raksha Bandhan • Demo experience — no data stored.
      </footer>
    </main>
  );
}