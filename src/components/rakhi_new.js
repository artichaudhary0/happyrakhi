import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from 'qrcode';

// Function to update Open Graph meta tags for WhatsApp preview
function updateMetaTags(message, selectedImage) {
  if (typeof window === 'undefined') return;

  // Update or create meta tags
  const updateMetaTag = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  updateMetaTag('og:title', '🎀 Digital Rakhi from Sister');
  updateMetaTag('og:description', message || 'Happy Raksha Bandhan! I\'ve sent you a beautiful digital rakhi with love.');
  updateMetaTag('og:image', selectedImage);
  updateMetaTag('og:image:width', '800');
  updateMetaTag('og:image:height', '600');
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:url', window.location.href);

  // Twitter Card meta tags
  const updateTwitterTag = (name, content) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  updateTwitterTag('twitter:card', 'summary_large_image');
  updateTwitterTag('twitter:title', '🎀 Digital Rakhi from Sister');
  updateTwitterTag('twitter:description', message || 'Happy Raksha Bandhan! I\'ve sent you a beautiful digital rakhi with love.');
  updateTwitterTag('twitter:image', selectedImage);
}

// Rupee amount tiles
const rupeeTiles = [11, 21, 51, 101, 201, 501, 1001];

// AI-generated messages
const aiMessages = [
  "Dear Bhai, on this special day of Raksha Bandhan, I'm sending you this digital rakhi with all my love! 🎀",
  "Happy Raksha Bandhan! May this rakhi bring you happiness, success, and good health always! ❤️",
  "Bhai, distance can't diminish our bond! This digital rakhi carries all my love and best wishes for you! 🌟",
  "On this Raksha Bandhan, I pray for your happiness and prosperity. You're the best brother ever! 🙏",
  "Sending you this beautiful digital rakhi with lots of love and warm wishes! Happy Raksha Bandhan! 💕"
];

// UPI validation function
function isValidUPI(upi) {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upi);
}

// UPI link generator
function makeUPILink({ pa, pn = "Digital Bandhan", am, cu = "INR", tn = "Rakhi Gift" }) {
  const params = new URLSearchParams();
  params.set("pa", pa);
  params.set("pn", pn);
  if (am) params.set("am", am);
  params.set("cu", cu);
  params.set("tn", tn);
  return `upi://pay?${params.toString()}`;
}

// Instagram handle validation
function isValidInstagramHandle(handle) {
  if (!handle) return false;
  const cleanHandle = handle.replace(/^@/, '').toLowerCase();
  const commonHandles = ['instagram', 'insta', 'ig', 'official', 'real', 'the'];
  return commonHandles.some(validHandle => handle.includes(validHandle));
}

// QR Code component for UPI payments
function UPIQRCode({ upiId, amount }) {
  const [qrDataURL, setQrDataURL] = useState("");

  useEffect(() => {
    if (upiId && amount) {
      // Create optimized UPI string that works with both PhonePe and banking apps
      const upiString = `upi://pay?pa=${upiId}&pn=Digital%20Bandhan&am=${amount}&cu=INR&tn=Rakhi%20Gift`;
      
      QRCode.toDataURL(upiString, {
        width: 200,
        margin: 2,
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
    <div className="text-center">
      <img src={qrDataURL} alt="UPI QR Code" className="mx-auto rounded-lg shadow-md" />
      <p className="text-xs text-gray-600 mt-2">Scan to pay ₹{amount}</p>
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

function RakhiCarousel({ onPick }) {
  const items = useMemo(() => [1, 11, 12, 13, 14, 15, 16, 17], []);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  const handlePick = (item) => {
    onPick(item);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Main display */}
      <div className="relative h-48 flex items-center justify-center">
        <div 
          className="w-32 h-32 cursor-pointer transform transition-all duration-300 hover:scale-110"
          onClick={() => handlePick(items[currentIndex])}
        >
          <img
            src={`/rakhi${items[currentIndex]}.png`}
            alt={`Rakhi ${items[currentIndex]}`}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((item, index) => (
          <button
            key={item}
            onClick={() => setCurrentIndex(index)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              index === currentIndex 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-white hover:border-red-300'
            }`}
          >
            <img
              src={`/rakhi${item}.png`}
              alt={`Rakhi ${item}`}
              className="w-full h-full object-contain rounded-full"
            />
          </button>
        ))}
      </div>

      {/* Pick button */}
      <div className="text-center mt-6">
        <button
          onClick={() => handlePick(items[currentIndex])}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Pick This Rakhi
        </button>
      </div>
    </div>
  );
}

function BoxPackAnimation({ rakhiSeed = 0, onDone }) {
  const [phase, setPhase] = useState(0); // 0: waiting, 1: rakhi appears top, 2: rakhi drops slowly, 3: rakhi hides, 4: show final box

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000);   // rakhi appears at top
    const t2 = setTimeout(() => setPhase(2), 2000);   // rakhi starts dropping slowly
    const t3 = setTimeout(() => setPhase(3), 4500);   // rakhi hides when dhakkan reaches center
    const t4 = setTimeout(() => setPhase(4), 5000);   // show final packed box
    const t5 = setTimeout(() => onDone && onDone(), 6000); // call onDone
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onDone]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-300 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-orange-300 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-amber-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-12 w-12 h-12 bg-red-400 rounded-full blur-md"></div>
      </div>

      <div className="relative w-80 h-80 mx-auto">
        {/* Rakhi - appears at top, drops slowly, then hides */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 w-24 h-24 transition-all duration-2000 ease-in-out ${
            phase === 0 ? 'opacity-0 -top-10' :
            phase === 1 ? 'opacity-100 -top-10' :
            phase === 2 ? 'opacity-100 top-32' :
            'opacity-0 top-32'
          }`}
        >
          <img
            src={`/rakhi${rakhiSeed}.png`}
            alt="Rakhi"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Box bottom - always visible */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32">
          <img
            src="/box_bottom.png"
            alt="Box Bottom"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Box top/dhakkan - drops down to cover rakhi */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 w-64 h-32 transition-all duration-2000 ease-in-out ${
            phase < 2 ? '-top-16' : 'top-16'
          }`}
        >
          <img
            src="/box_top.png"
            alt="Box Top"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Text */}
      <div className="text-center mt-8 space-y-4">
        <h2 className="text-2xl font-bold text-red-900">
          {phase < 4 ? "Packing your rakhi with love..." : "Ready to send! 🎁"}
        </h2>
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-2 h-2 bg-red-500 rounded-full animate-bounce ${
                phase < 4 ? '' : 'animate-none opacity-50'
              }`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
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
  const [sisterName, setSisterName] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1 = basic details, 2 = payment details

  const effectiveAmount = customAmount ? Number(customAmount) || 0 : amount;

  function buildRakhiViewLink() {
    const params = new URLSearchParams();
    params.set("view", "rakhi");
    params.set("r", picked);
    if (msg) params.set("m", msg);
    if (sisterName) params.set("sn", sisterName);
    if (upi) params.set("upi", upi);
    if (effectiveAmount) params.set("am", effectiveAmount);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleSend() {
    if (!broPhone) return;
    
    const rakhiLink = buildRakhiViewLink();
    const upiLink = makeUPILink({ pa: upi, am: effectiveAmount, tn: "Rakhi Gift" });

    const text = `Hey Bhai! I'm sending you this digital Rakhi. Open it here: ${rakhiLink}\n\nIf you'd like to send your blessings: ${upiLink}\nHappy Raksha Bandhan! 🎀`;
    let finalText = `Hey Bhai! I'm sending you this digital Rakhi. Open it here: ${rakhiLink}`;

    // Add custom message if provided
    if (msg) {
      finalText += `\n\n"${msg}"`;
    }

    // Add UPI link if provided
    if (upi && isValidUPI(upi) && effectiveAmount) {
      finalText += `\n\nIf you'd like to send your blessings: ${upiLink}`;
    }

    finalText += `\n\nHappy Raksha Bandhan! 🎀`;

    const whatsappUrl = `https://wa.me/${broPhone.replace(/\D/g, '')}?text=${encodeURIComponent(finalText)}`;
    window.open(whatsappUrl, '_blank');
  }

  if (packed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto">
            <img src="/box_packed.png" alt="Packed Gift" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-green-800">Rakhi Sent Successfully! 🎉</h2>
          <p className="text-green-700">Your brother will receive the digital rakhi on WhatsApp</p>
          <button
            onClick={() => {
              setPicked(null);
              setPacked(false);
              setBroPhone("");
              setMsg("");
              setSisterName("");
              setCurrentStep(1);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
          >
            Send Another Rakhi
          </button>
        </div>
      </div>
    );
  }

  if (picked && !packed) {
    return <BoxPackAnimation rakhiSeed={picked} onDone={() => setPacked(true)} />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-900 mb-4">
          🎀 Digital Rakhi
        </h1>
        <p className="text-lg text-red-700 max-w-2xl mx-auto">
          Send a beautiful digital rakhi to your brother with love and blessings
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {!picked ? (
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-red-900 mb-4">Choose Your Rakhi</h2>
              <p className="text-red-700">Select a beautiful rakhi for your brother</p>
            </div>
            <RakhiCarousel onPick={setPicked} />
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4">
                <img
                  src={`/rakhi${picked}.png`}
                  alt="Selected Rakhi"
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-8">Provide Few Details</h3>
            </div>

            {/* Form Container */}
            <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-3xl p-6 shadow-lg border border-orange-200">
            
            {currentStep === 1 ? (
              <>
                {/* Step 1: Basic Details */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Name & Message</h3>
                  
                  {/* Name Input */}
                  <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5 mb-4">
                    <input 
                      value={sisterName} 
                      onChange={(e)=>setSisterName(e.target.value)} 
                      placeholder="Write Your name" 
                      className="w-full rounded-xl border border-orange-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-orange-400" 
                    />
                  </div>
                  
                  {/* Message Input */}
                  <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <button onClick={()=>setMsg(aiMessages[Math.floor(Math.random()*aiMessages.length)])} className="text-xs sm:text-sm underline text-red-700 self-end">✨ Write using AI</button>
                    </div>
                    <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} rows={4} placeholder="Write something sweet..." className="w-full rounded-xl border border-orange-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>

                {/* Brother's WhatsApp Number */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Brothers Whatsapp No.</h3>
                  <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
                    <input value={broPhone} onChange={(e)=>setBroPhone(e.target.value)} placeholder="98xxxxxx" className="w-full rounded-xl border border-orange-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Payment Details */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Decide your sagun</h3>
                  
                  {/* Amount Selection */}
                  <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5 mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {rupeeTiles.map(v => (
                        <button key={v} onClick={()=>{ setAmount(v); setCustomAmount(""); }} className={`px-3 sm:px-4 py-2 rounded-xl border text-sm sm:text-base ${amount===v && !customAmount? "bg-red-600 text-white border-red-600" : "border-orange-300 bg-white"}`}>₹{v}</button>
                      ))}
                    </div>
                    <input value={customAmount} onChange={(e)=>setCustomAmount(e.target.value)} inputMode="numeric" placeholder="Custom amount" className="w-full px-3 py-2 rounded-xl border border-orange-300 bg-white text-sm sm:text-base" />
                  </div>
                  
                  {/* UPI ID */}
                  <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
                    <label className="block text-sm text-red-900/80 mb-2">Your UPI ID (to receive the gift)</label>
                    <input
                      value={upi}
                      onChange={(e)=>setUpi(e.target.value)}
                      placeholder="e.g., yourname@paytm, user@phonepe"
                      className={`w-full rounded-xl border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 ${
                        upi && !isValidUPI(upi)
                          ? 'border-red-300 bg-red-50 focus:ring-red-400'
                          : 'border-orange-300 bg-white focus:ring-orange-400'
                      }`}
                    />
                    {upi && !isValidUPI(upi) && (
                      <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <span>❌</span>
                        <span>Please enter a valid UPI ID</span>
                      </div>
                    )}
                    {upi && isValidUPI(upi) && (
                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <span>✅</span>
                        <span>Valid UPI ID</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step indicator and Next button */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-red-600 font-medium">Step{currentStep}/2</span>
              {currentStep === 1 ? (
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!sisterName || !msg || !broPhone}
                  className="bg-red-900 hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!upi || !isValidUPI(upi)}
                  className="bg-red-900 hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
                >
                  Send
                </button>
              )}
            </div>

            </div>
          </div>
        )}
      </div>

      {/* Box bottom image at the bottom - MOBILE BIGGER - Only show during rakhi selection */}
      {!picked && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <img
            src="/box_bottom.png"
            alt="Box Bottom"
            className="w-[95vw] max-w-[600px] h-[30vh] sm:w-[500px] sm:h-48 object-contain opacity-90"
          />
        </div>
      )}
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
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleSendWish() {
    if (!sisPhone) return;

    const wishLink = buildWishLink();
    const text = `Hey Sister! Thank you for the beautiful rakhi! Here's my wish for you: ${wishLink}\n\n"${msg}"\n\nHappy Raksha Bandhan! 🎀`;

    const whatsappUrl = `https://wa.me/${sisPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-4">Send Wishes Back</h1>
          <p className="text-purple-700">Send your blessings to your sister</p>
        </div>

        <div className="bg-gradient-to-b from-purple-50 to-pink-50 rounded-3xl p-6 shadow-lg border border-purple-200">
          <div className="rounded-2xl bg-white border border-purple-200 shadow-lg p-4 sm:p-5 mb-4">
            <label className="block text-sm text-purple-900/80">Sister's Name</label>
            <input value={sisName} onChange={(e)=>setSisName(e.target.value)} placeholder="Write Your name" className="mt-2 w-full rounded-xl border border-purple-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-400" />
          </div>

          <div className="rounded-2xl bg-white border border-purple-200 shadow-lg p-4 sm:p-5 mb-4">
            <label className="block text-sm text-purple-900/80">Sister's Phone</label>
            <input value={sisPhone} onChange={(e)=>setSisPhone(e.target.value)} placeholder="Sister's WhatsApp number" className="mt-2 w-full rounded-xl border border-purple-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-400" />
          </div>

          <div className="rounded-2xl bg-white border border-purple-200 shadow-lg p-4 sm:p-5 mb-4">
            <label className="block text-sm text-purple-900/80">Your Message</label>
            <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} rows={3} placeholder="Write your blessings..." className="mt-2 w-full rounded-xl border border-purple-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-purple-400" />
          </div>

          <button
            onClick={handleSendWish}
            disabled={!sisPhone || !msg}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg"
          >
            Send Wishes
          </button>
        </div>
      </div>
    </section>
  );
}

function RakhiView() {
  const qp = useQueryParams();
  const rakhiSeed = qp.get("r") || "1";
  const message = qp.get("m") || "";
  const sisterName = qp.get("sn") || "";
  const upi = qp.get("upi") || "";
  const am = qp.get("am") || "";
  const upiLink = upi ? makeUPILink({ pa: upi, am, tn: "Rakhi Gift" }) : null;
  const qrUrl = upiLink ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}` : null;

  const [reveal, setReveal] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setReveal(1), 600);
    const t2 = setTimeout(() => setReveal(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    updateMetaTags(message, `/rakhi${rakhiSeed}.png`);
  }, [message, rakhiSeed]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-300 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-orange-300 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-amber-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-12 w-12 h-12 bg-red-400 rounded-full blur-md"></div>
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
        <div className={`transition-all duration-1000 ${reveal >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl font-bold text-red-900 mb-4">🎀 Digital Rakhi</h1>
          {sisterName && <p className="text-xl text-red-700 mb-6">From: {sisterName}</p>}
        </div>

        <div className={`transition-all duration-1000 delay-300 ${reveal >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="w-48 h-48 mx-auto mb-6 relative">
            <img
              src={`/rakhi${rakhiSeed}.png`}
              alt="Digital Rakhi"
              className="w-full h-full object-contain drop-shadow-2xl animate-pulse"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {message && (
          <div className={`transition-all duration-1000 delay-500 ${reveal >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-orange-200">
              <p className="text-gray-800 italic text-lg leading-relaxed">"{message}"</p>
            </div>
          </div>
        )}

        {upiLink && qrUrl && (
          <div className={`transition-all duration-1000 delay-700 ${reveal >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Send Your Blessings</h3>
              <div className="flex flex-col items-center space-y-4">
                <img src={qrUrl} alt="UPI QR Code" className="w-32 h-32 rounded-lg shadow-md" />
                <p className="text-sm text-green-700">Scan to send ₹{am}</p>
                <a
                  href={upiLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg"
                >
                  Pay Now
                </a>
              </div>
            </div>
          </div>
        )}

        <div className={`transition-all duration-1000 delay-1000 ${reveal >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-red-600 font-semibold text-lg">Happy Raksha Bandhan! 🎉</p>
        </div>
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
    // Check if URL path is /happyrakhibhaiya
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath, "View param:", view);

    if (currentPath === "/happyrakhibhaiya") {
      setRoute("brother");
    } else if (view === "rakhi") {
      setRoute("rakhi");
    } else if (view === "sister") {
      setRoute("sister");
    } else {
      setRoute("sister"); // Default to sister flow
    }
  }, [view]);

  if (route === "brother") return <BrotherFlow />;
  if (route === "rakhi") return <RakhiView />;
  return <SisterFlow />;
}
