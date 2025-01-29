"use client";

const Background = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-100 dark:bg-gray-100 transition-colors duration-300 
       w-full h-full">
        {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className="fixed w-full h-full"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gold Gradient */}
            <linearGradient id="goldGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#c99c33", stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: "#b8860b", stopOpacity: 1 }} />
            </linearGradient>

            {/* Dark Mode Gold Gradient */}
            <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#b8860b", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#a07a22", stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: "#8b5e20", stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Main Wave */}
          <path
            className="dark:hidden"
            fill="url(#goldGradientLight)"
            d="M0,400 C400,150 800,650 1440,300 L1440,800 L0,800 Z"
          />
          <path
            className="hidden dark:block"
            fill="url(#goldGradientDark)"
            d="M0,400 C400,150 800,650 1440,300 L1440,800 L0,800 Z"
          />

          {/* Thicker Top Curves */}
          {Array.from({ length: 3 }).map((_, i) => (
            <>
              <path
                key={`light-${i}`}
                className="dark:hidden"
                fill="none"
                stroke="gold"
                strokeWidth={4 - i}
                opacity={0.6 - i * 0.15}
                d={`M0,${80 + i * 30} C400,${50 + i * 30} 800,${150 + i * 30} 1440,${
                  100 + i * 30
                }`}
              />
              <path
                key={`dark-${i}`}
                className="hidden dark:block"
                fill="none"
                stroke="#c99c33"
                strokeWidth={5 - i}
                opacity={0.7 - i * 0.2}
                d={`M0,${80 + i * 30} C400,${50 + i * 30} 800,${150 + i * 30} 1440,${
                  100 + i * 30
                }`}
              />
            </>
          ))}

          {/* Detail Curves */}
          {Array.from({ length: 8 }).map((_, i) => (
            <>
              <path
                key={`light-detail-${i}`}
                className="dark:hidden"
                fill="none"
                stroke="gold"
                strokeWidth="1.5"
                opacity="0.5"
                d={`M0,${300 + i * 20} C400,${100 + i * 20} 800,${500 + i * 20} 1440,${
                  250 + i * 20
                }`}
              />
              <path
                key={`dark-detail-${i}`}
                className="hidden dark:block"
                fill="none"
                stroke="#c99c33"
                strokeWidth="1.8"
                opacity="0.6"
                d={`M0,${300 + i * 20} C400,${100 + i * 20} 800,${500 + i * 20} 1440,${
                  250 + i * 20
                }`}
              />
            </>
          ))}

          {/* Additional Accent Shapes */}
          <path
            className="dark:hidden"
            fill="none"
            stroke="gold"
            strokeWidth="3"
            opacity="0.7"
            d="M100,50 C500,200 900,0 1300,100"
          />
          <path
            className="hidden dark:block"
            fill="none"
            stroke="#c99c33"
            strokeWidth="3.5"
            opacity="0.75"
            d="M100,50 C500,200 900,0 1300,100"
          />
        </svg>
        ))}
    </div>
    );
  };
  
  export default Background;
  