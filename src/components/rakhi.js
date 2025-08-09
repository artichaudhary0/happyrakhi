import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from 'qrcode';

// Function to update Open Graph meta tags for WhatsApp preview
function updateMetaTags(rakhiSeed, message) {
  const rakhiImages = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', // Beautiful rakhi 1
    'https://images.unsplash.com/photo-1597149508230-0c0c6d4d6c6c?w=800&h=600&fit=crop', // Beautiful rakhi 2
    'https://images.unsplash.com/photo-1628191081676-8f0c8e5e5e5e?w=800&h=600&fit=crop', // Beautiful rakhi 3
    'https://images.unsplash.com/photo-1629630062-8b9f8b8b8b8b?w=800&h=600&fit=crop', // Beautiful rakhi 4
    'https://images.unsplash.com/photo-1630630062-8b9f8b8b8b8b?w=800&h=600&fit=crop', // Beautiful rakhi 5
    'https://picsum.photos/800/600?random=1', // Fallback beautiful image 1
    'https://picsum.photos/800/600?random=2', // Fallback beautiful image 2
    'https://picsum.photos/800/600?random=3', // Fallback beautiful image 3
    'https://picsum.photos/800/600?random=4', // Fallback beautiful image 4
    'https://picsum.photos/800/600?random=5'  // Fallback beautiful image 5
  ];

  const selectedImage = rakhiImages[rakhiSeed] || rakhiImages[0];

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
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', '🎀 Digital Rakhi from Sister');
  updateMetaTag('twitter:description', message || 'Happy Raksha Bandhan! I\'ve sent you a beautiful digital rakhi with love.');
  updateMetaTag('twitter:image', selectedImage);
}

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
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-amber-50 to-orange-100" />
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

// Function to convert SVG to downloadable image
function svgToImage(svgElement, width = 300, height = 300) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // Create a white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Center the rakhi on canvas
      const padding = 50;
      const size = Math.min(width, height) - (padding * 2);
      const x = (width - size) / 2;
      const y = (height - size) / 2;

      ctx.drawImage(img, x, y, size, size);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 0.9);
    };
    img.src = url;
  });
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

  return (
    <div className="relative w-full py-8">
      <div className="relative h-80 lg:h-96 flex items-center justify-center overflow-hidden">

        {/* Carousel track */}
        <div className="relative w-full flex items-center justify-center">
          {items.map((rakhi, index) => {
            const offset = index - currentIndex;
            const isCenter = offset === 0;
            const distance = Math.abs(offset);

            // Smooth looping
            let translateX = offset * 220; // space between items
            if (offset < -Math.floor(items.length / 2)) {
              translateX += items.length * 220;
            }
            if (offset > Math.floor(items.length / 2)) {
              translateX -= items.length * 220;
            }

            return (
              <div
                key={rakhi}
                className="absolute transition-all duration-700 ease-in-out"
                style={{
                  transform: `translateX(${translateX}px) scale(${isCenter ? 1 : 0.85})`,
                  opacity: distance > 2 ? 0 : isCenter ? 1 : 0.6,
                  filter: isCenter ? 'none' : 'blur(1px)',
                  zIndex: isCenter ? 20 : 10,
                }}
              >
                <button
                  onClick={() => {
                    if (isCenter) {
                      onPick(rakhi);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                  className={`relative bg-white/90 rounded-3xl shadow-xl border-2 backdrop-blur-xl transition-all duration-300 ${
                    isCenter
                      ? 'border-amber-300 p-8 lg:p-12 hover:shadow-2xl hover:-translate-y-2'
                      : 'border-amber-200 p-4 lg:p-6 hover:scale-90'
                  }`}
                >
                  {isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-orange-200/40 to-amber-200/30 rounded-3xl blur-xl -z-10"></div>
                  )}

                  <img
                    src={`/rakhi${rakhi}.png`}
                    alt={`Rakhi ${rakhi}`}
                    className={`object-contain transition-transform duration-500 ease-in-out ${
                      isCenter
                        ? 'w-48 h-48 lg:w-64 lg:h-64'
                        : 'w-32 h-32 lg:w-40 lg:h-40'
                    }`}
                  />

                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// function RakhiCarousel({ onPick }) {
//   const items = useMemo(() => [1, 11, 12, 13, 14, 15, 16, 17], []);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Auto-rotation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prev => (prev + 1) % items.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [items.length]);

//   return (
//     <div className="relative w-full py-8">
//       <div className="relative h-80 lg:h-96 flex items-center justify-center overflow-hidden">

//         {/* Show all items in a horizontal line */}
//         <div className="flex items-center gap-8 lg:gap-12">
//           {items.map((rakhi, index) => {
//             const isCenter = index === currentIndex;
//             const distance = Math.abs(index - currentIndex);
//             const isVisible = distance <= 2;

//             if (!isVisible) return null;

//             return (
//               <div
//                 key={rakhi}
//                 className="absolute"
//                 style={{
//                   transform: `translateX(${(index - currentIndex) * 180}px) scale(${isCenter ? 1 : 0.8})`,
//                   opacity: isCenter ? 1 : 0.6,
//                   filter: isCenter ? 'none' : 'blur(1px)',
//                   zIndex: isCenter ? 20 : 10,
//                   transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
//                   left: '50%',
//                   top: '50%',
//                   marginLeft: '-100px',
//                   marginTop: '-120px'
//                 }}
//               >
//                 <button
//                   onClick={() => {
//                     if (isCenter) {
//                       onPick(rakhi);
//                     } else {
//                       setCurrentIndex(index);
//                     }
//                   }}
//                   className={`relative bg-white/90 rounded-3xl shadow-xl border-2 backdrop-blur-xl transition-all duration-300 group ${
//                     isCenter
//                       ? 'border-amber-300 p-8 lg:p-12 hover:shadow-2xl hover:-translate-y-2'
//                       : 'border-amber-200 p-4 lg:p-6 hover:scale-90'
//                   }`}
//                 >
//                   {/* Background glow for center item */}
//                   {isCenter && (
//                     <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-orange-200/40 to-amber-200/30 rounded-3xl blur-xl -z-10"></div>
//                   )}

//                   <img
//                     src={`/rakhi${rakhi}.png`}
//                     alt={`Rakhi ${rakhi}`}
//                     className={`object-contain group-hover:scale-105 transition-transform duration-300 ${
//                       isCenter
//                         ? 'w-48 h-48 lg:w-64 lg:h-64'
//                         : 'w-32 h-32 lg:w-40 lg:h-40'
//                     }`}
//                     onError={(e) => {
//                       console.log(`Failed to load: /rakhi${rakhi}.png`);
//                       e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
//                     }}
//                   />

//                   {/* Rakhi number indicator */}
//                   {isCenter && (
//                     <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
//                       {rakhi}
//                     </div>
//                   )}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

function BoxPackAnimation({ rakhiSeed = 0, onDone }) {
  const [phase, setPhase] = useState(0); // 0: waiting, 1: rakhi appears, 2: rakhi drops + box closes instantly, 3: show final box

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1000);   // rakhi appears
    const t2 = setTimeout(() => setPhase(2), 2500);   // rakhi drops + box closes instantly
    const t3 = setTimeout(() => setPhase(3), 3000);   // show final box.png
    const t4 = setTimeout(() => onDone && onDone(), 3500); // complete
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  // Simple animation - rakhi drops inside box, then show final box.png
  return (
      <div className="relative flex items-center justify-center h-[85vh] min-h-[700px]">

        {/* Phase 3: Show final closed box.png - CENTER */}
        {phase === 3 ? (
          <div className="flex items-center justify-center">
            <img
              src="/box.png"
              alt="Final Closed Box"
              className="w-[500px] h-80 object-contain"
            />
          </div>
        ) : (
          <>
            {/* Rakhi floating and dropping INSIDE the box - ULTRA BIG */}
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all ease-in-out ${
              phase === 0 ? "bottom-60 scale-100 opacity-0 duration-0" :
              phase === 1 ? "bottom-60 scale-100 opacity-100 duration-1000" :
              phase >= 2 ? "bottom-48 scale-60 opacity-0 duration-500" : ""
            }`} style={{ zIndex: 15 }}>
              <div className={phase === 1 ? "animate-pulse" : ""}>
                <img
                  src={`/rakhi${rakhiSeed}.png`}
                  alt={`Rakhi ${rakhiSeed}`}
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>

            {/* Box Animation - ULTRA MAXIMUM SIZE - CENTER */}
            <div className="flex items-center justify-center">
              <div className="relative w-[500px] h-96">

                {/* Box Bottom - Always visible */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <img
                    src="/box_bottom.png"
                    alt="Box Bottom"
                    className="w-[500px] h-80 object-contain"
                  />
                </div>

                {/* Box Top - Instantly closes when rakhi drops */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 transition-all duration-200 ease-out`}
                  style={{
                    bottom: phase >= 2 ? '40px' : '280px',
                    transform: `translateX(-50%)`,
                    zIndex: 30
                  }}
                >
                  <img
                    src="/box_top.png"
                    alt="Box Top"
                    className="w-[500px] h-80 object-contain"
                  />
                </div>

              </div>
            </div>
          </>
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
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-900 tracking-wide">HAPPY</h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-900 -mt-2" style={{fontFamily: 'serif'}}>Raksha</h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-900 -mt-1 tracking-wide">BANDHAN</h1>
        </div>

        <div className="max-w-none mx-auto px-4">
          {/* Mobile: Stack vertically, Desktop: Side by side */}
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-center gap-6 lg:gap-12">
            {/* First Card */}
            <button onClick={() => onPick("sister")}
              className="group rounded-2xl bg-white border border-orange-200 p-6 lg:p-12 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full lg:flex-1 lg:min-w-[500px] min-h-[180px] lg:min-h-[300px]">
              <div className="flex items-center justify-between h-full">
                {/* Text Content - LEFT SIDE */}
                <div className="flex-1">
                  <div className="text-xl lg:text-4xl font-semibold text-gray-800 mb-4 lg:mb-6">Send Digital Rakhi</div>
                  <button className="px-4 py-2 lg:px-6 lg:py-3 bg-orange-200 text-red-800 rounded-lg text-sm lg:text-lg font-medium hover:bg-orange-300 transition-colors">
                    Extort Money →
                  </button>
                </div>
                {/* Character Image - RIGHT SIDE */}
                <div className="flex-shrink-0 ml-4 lg:ml-8">
                  <img src="/bhen.png" alt="Sister" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-52 lg:h-52 object-contain" />
                </div>
              </div>
            </button>

            {/* OR Divider - Show on mobile only */}
            <div className="flex items-center justify-center py-2 lg:hidden">
              <div className="text-lg font-medium text-gray-500 bg-orange-50 px-4 py-1 rounded-full border border-orange-200">
                OR
              </div>
            </div>

            {/* OR Divider - Show on desktop only */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-2xl font-bold text-gray-400 bg-white px-4 py-2 rounded-full border border-orange-200 shadow-lg">
                OR
              </div>
            </div>

            {/* Second Card */}
            <button onClick={() => onPick("brother")}
              className="group rounded-2xl bg-white border border-orange-200 p-6 lg:p-12 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full lg:flex-1 lg:min-w-[500px] min-h-[180px] lg:min-h-[300px]">
              <div className="flex items-center justify-between h-full">
                {/* Text Content - LEFT SIDE */}
                <div className="flex-1">
                  <div className="text-xl lg:text-4xl font-semibold text-gray-800 mb-1 lg:mb-2">Send Your</div>
                  <div className="text-xl lg:text-4xl font-semibold text-gray-800 mb-4 lg:mb-6">sister a Gift</div>
                  <button className="px-4 py-2 lg:px-6 lg:py-3 bg-orange-200 text-red-800 rounded-lg text-sm lg:text-lg font-medium hover:bg-orange-300 transition-colors">
                    Send Gift →
                  </button>
                </div>
                {/* Character Image - RIGHT SIDE */}
                <div className="flex-shrink-0 ml-4 lg:ml-8">
                  <img src="/bhai.png" alt="Brother" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-52 lg:h-52 object-contain" />
                </div>
              </div>
            </button>
          </div>
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

  async function downloadRakhiImage() {
    try {
      // Use the selected rakhi image
      const selectedRakhiUrl = `/rakhi${picked}.png`;

      // Check if selected rakhi image exists, otherwise fall back to generated SVG
      const response = await fetch(selectedRakhiUrl);
      if (response.ok) {
        // Download selected rakhi image
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `selected-rakhi-${picked}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    } catch (error) {
      console.log('Selected rakhi image not available, using generated SVG');
    }

    // Fallback to generated SVG
    const svgElement = document.querySelector(`[data-rakhi-seed="${picked}"]`);
    if (!svgElement) return;

    try {
      const blob = await svgToImage(svgElement, 400, 400);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rakhi-${picked + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download rakhi image:', error);
    }
  }

  function handleSend() {
    // Check if phone number is provided
    if (!broPhone || !broPhone.trim()) {
      alert('Please enter brother\'s phone number first!');
      return;
    }

    // Build WhatsApp message
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

    // Download rakhi image first
    downloadRakhiImage().catch(error => {
      console.log('Image download failed:', error);
    });

    finalText += `\n\n📷 *Beautiful rakhi image has been downloaded to your phone!*`;
    finalText += `\nPlease attach the downloaded image to this WhatsApp chat.`;
    finalText += `\n\n✨ *Happy Raksha Bandhan!* ✨`;

    // Create WhatsApp link and open immediately
    const whatsappUrl = makeWhatsAppLink(broPhone, finalText);
    console.log('Opening WhatsApp with URL:', whatsappUrl);
    console.log('Phone number:', broPhone);



    // Open WhatsApp immediately - try multiple methods
    try {
      // Method 1: Open in new tab (preferred for mobile)
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened) {
        // Method 2: Direct navigation if popup blocked
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
      // Method 3: Fallback direct navigation
      window.location.href = whatsappUrl;
    }
  }

  return (
    <section className="min-h-screen px-3 sm:px-4 pt-8 pb-24 relative">
      {/* Back button at top */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-50 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-amber-200 transition-all duration-300 hover:scale-105"
      >
        <svg className="w-6 h-6 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 text-center px-2">Choose a Rakhi for Bhai ❤️</h2>

        {!picked && (
          <div className="mt-6">
            <RakhiCarousel onPick={setPicked} />
          </div>
        )}

        {picked !== null && !packed && (
          <div className="mt-6 text-center">
            <div className="inline-block rounded-2xl bg-white px-3 sm:px-4 py-2 border border-orange-200 shadow-lg">
              <p className="text-sm sm:text-base text-red-900/90">Nice pick! Packing your rakhi…</p>
            </div>
            <BoxPackAnimation rakhiSeed={picked} onDone={() => setPacked(true)} />
          </div>
        )}

        {packed && (
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6">
            {/* Display selected rakhi for download */}
            <div className="text-center">
              <div className="inline-block rounded-2xl bg-white border border-orange-200 shadow-lg p-4">
                <p className="text-sm text-red-900/80 mb-3">Your Selected Rakhi</p>
                <img
                  src={`/rakhi${picked}.png`}
                  alt={`Selected Rakhi ${picked}`}
                  className="w-32 h-32 object-contain mx-auto"
                />
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
              <label className="block text-sm text-red-900/80">Brother’s WhatsApp Number</label>
              <input value={broPhone} onChange={(e)=>setBroPhone(e.target.value)} placeholder="e.g., +91 98XXXXXXXX" className="mt-2 w-full rounded-xl border border-orange-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
              <label className="block text-sm text-red-900/80">Amount to request (optional)</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {rupeeTiles.map(v => (
                  <button key={v} onClick={()=>{ setAmount(v); setCustomAmount(""); }} className={`px-3 sm:px-4 py-2 rounded-xl border text-sm sm:text-base ${amount===v && !customAmount? "bg-red-600 text-white border-red-600" : "border-orange-300 bg-white"}`}>₹{v}</button>
                ))}
                <input value={customAmount} onChange={(e)=>setCustomAmount(e.target.value)} inputMode="numeric" placeholder="Custom" className="px-3 py-2 rounded-xl border border-orange-300 bg-white w-20 sm:w-28 text-sm sm:text-base" />
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="block text-sm text-red-900/80">Message (optional)</label>
                <button onClick={()=>setMsg(aiMessages[Math.floor(Math.random()*aiMessages.length)])} className="text-xs sm:text-sm underline text-red-700 self-start sm:ml-auto">✨ Generate</button>
              </div>
              <textarea value={msg} onChange={(e)=>setMsg(e.target.value)} rows={3} placeholder="Write something sweet…" className="mt-2 w-full rounded-xl border border-orange-300 bg-white px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="rounded-2xl bg-white border border-orange-200 shadow-lg p-4 sm:p-5">
              <label className="block text-sm text-red-900/80">Your UPI ID (to receive the gift)</label>
              <input
                value={upi}
                onChange={(e)=>setUpi(e.target.value)}
                placeholder="e.g., yourname@paytm, user@phonepe"
                className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 ${
                  upi && !isValidUPI(upi)
                    ? 'border-red-300 bg-red-50 focus:ring-red-400'
                    : 'border-orange-300 bg-white focus:ring-orange-400'
                }`}
              />
              {upi && (
                <div className="mt-3 text-xs text-red-800/80">We’ll include a secure UPI payment link for Bhai to scan or tap.</div>
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-red-700 text-white px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base shadow-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition">
              📥 Download Rakhi Image + Send WhatsApp
            </button>

            <div className="text-xs text-red-700/60 text-center px-4 mt-3 space-y-1">
              <p><strong>📱 How to Send Rakhi Image:</strong></p>
              <p>1. Click button → Downloads rakhi image + opens WhatsApp</p>
              <p>2. In WhatsApp: Click 📎 (attachment) → Photo → Select downloaded rakhi image</p>
              <p>3. Add the pre-written message and send!</p>
              <p className="text-green-600 font-medium mt-2">✅ Brother gets actual rakhi image + digital link!</p>
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
    if (sisName) params.set("n", sisName);
    if (giftLink) params.set("g", giftLink);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleSend() {
    const link = buildWishLink();
    const text = `Hey ${sisName || "Didi"}! Sending you my Raksha Bandhan wishes 💖 Read here: ${link}${giftLink ? `\nAnd a small gift for you: ${giftLink}` : ""}`;
    // Open WhatsApp directly (same tab for smoother experience)
    window.location.href = makeWhatsAppLink(sisPhone, text);
  }

  return (
    <section className="min-h-screen px-3 sm:px-4 pt-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 px-2">To My Lovely Sister</h2>
          <div className="flex justify-center mt-3">
            <img src="/bhen.png" alt="Sister" className="w-12 h-12 object-contain" />
          </div>
        </div>
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
    <section className="min-h-screen px-4 pt-8 pb-24 relative">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900">Your Digital Rakhi 🎁</h2>
        <p className="text-amber-800/80 mt-2">A rakhi sent with love — open your surprise</p>

        {/* Box reveal with actual images */}
        <div className="relative mt-8 h-80 flex items-center justify-center">
          {/* Box bottom - always visible */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <img
              src="/box_bottom.png"
              alt="Box Bottom"
              className="w-64 h-32 object-contain"
            />
          </div>

          {/* Box top - slides up when revealed */}
          <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-transform duration-700 ${reveal>=1?"translate-y-20":""}`}>
            <img
              src="/box_top.png"
              alt="Box Top"
              className="w-64 h-32 object-contain"
            />
          </div>

          {/* Selected rakhi rises */}
          {reveal>=2 && (
            <div className="absolute left-1/2 -translate-x-1/2 top-10 animate-pulse">
              <img
                src={`/rakhi${rakhiSeed}.png`}
                alt={`Selected Rakhi ${rakhiSeed}`}
                className="w-32 h-32 object-contain"
              />
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
          <div className="w-28 h-28 rounded-full bg-white/80 border border-amber-200 shadow grid place-items-center animate-bounce-slow">
            <img src="/bhen.png" alt="Sister" className="w-20 h-20 object-contain" />
          </div>
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

  // Update meta tags for WhatsApp preview when page loads
  useEffect(() => {
    const rakhiSeed = parseInt(qp.get("rakhi")) || 0;
    const message = qp.get("msg") || "";
    updateMetaTags(rakhiSeed, message);
  }, [qp]);

  function navigate(next) {
    setRoute(next);
    const params = new URLSearchParams(window.location.search);
    params.delete("view"); params.delete("rakhi"); params.delete("m"); params.delete("upi"); params.delete("am"); params.delete("n"); params.delete("g");
    pushQuery(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="font-[Inter,ui-sans-serif] text-red-900">
      <SparkleBg />



      {route === "home" && <Landing onPick={navigate} />}
      {route === "sister" && <SisterFlow />}
      {route === "brother" && <BrotherFlow />}
      {route === "brotherView" && <BrotherReceivedView params={qp} />}
      {route === "sisterView" && <SisterReceivedView params={qp} />}


    </main>
  );
}