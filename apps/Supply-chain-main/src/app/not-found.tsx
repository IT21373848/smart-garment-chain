"use client"
import Link from 'next/link';
import React from 'react';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center items-center p-4">
      {/* Truck Animation */}
      <div className="mb-8">
        <div className="truck">
          <div className="truck__body">
            <div className="truck__body truck__body--top">
              <div className="truck__window">
                <div className="truck__window-glass"></div>
              </div>
            </div>
            <div className="truck__body truck__body--mid">
              <div className="truck__mid-body"></div>
            </div>
            <div className="truck__body truck__body--bottom">
              <div className="truck__underpanel"></div>
              <div className="truck__rear-bumper"></div>
              <div className="truck__side-skirt"></div>
            </div>
          </div>
          <div className="truck__wheel truck__wheel--front">
            <div className="truck__wheel-arch"></div>
            <div className="truck__wheel-arch-trim truck__wheel-arch-trim--top"></div>
            <div className="truck__wheel-arch-trim truck__wheel-arch-trim--left"></div>
            <div className="truck__wheel-arch-trim truck__wheel-arch-trim--right"></div>
            <div className="truck-wheel">
              <div className="truck-wheel__rim">
                <div style={{ "--index": 0 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 1 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 2 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 3 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 4 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 5 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 6 } as React.CSSProperties} className="truck-wheel__spoke"></div>
              </div>
            </div>
          </div>
          <div className="truck__wheel truck__wheel--rear">
            <div className="truck__wheel-arch"></div>
            <div className="truck__wheel-arch-trim truck__wheel-arch-trim--top"></div>
            <div className="truck__wheel-arch-trim truck__wheel-arch-trim--left"></div>
            <div className="truck__wheel-arch-trim truck__wheel-arch-trim--right"></div>
            <div className="truck-wheel">
              <div className="truck-wheel__rim">
                <div style={{ "--index": 0 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 1 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 2 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 3 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 4 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 5 } as React.CSSProperties} className="truck-wheel__spoke"></div>
                <div style={{ "--index": 6 } as React.CSSProperties} className="truck-wheel__spoke"></div>
              </div>
            </div>
          </div>
          <div className="truck__headlight"></div>
          <div className="truck__taillight"></div>
          <div className="truck__indicator"></div>
          <div className="truck__foglight"></div>
        </div>
      </div>

      {/* Error Message */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p className="mt-4 text-lg text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Go back home
        </Link>
      </div>

      {/* Truck CSS */}
      <style jsx global>{`
        .truck {
          --width: 220;
        }
        .truck * {
          transition: all 0.25s ease;
        }
        .truck {
          position: relative;
          width: calc(var(--width) * 1px);
          height: calc(var(--width) * 0.33px);
          margin: 0 auto;
        }
        .truck:after {
          content: "";
          height: 5%;
          width: 100%;
          background: #000;
          position: absolute;
          left: 0;
          bottom: 5%;
          border-radius: 100%;
          filter: blur(10px);
        }
        .truck__indicator {
          height: 2%;
          width: 3%;
          position: absolute;
          right: 1.5%;
          background: #915d08;
          top: 64%;
          opacity: 0.45;
          z-index: 10;
        }
        .truck__foglight {
          height: 2%;
          width: 1%;
          position: absolute;
          left: 2%;
          background: #911308;
          top: 58%;
          opacity: 0.45;
          z-index: 10;
        }
        .truck__taillight {
          height: 2%;
          width: 1%;
          background: radial-gradient(circle at center, #ffebeb, #f00), #f00;
          box-shadow: 0 0 30px 5px #f33;
          position: absolute;
          top: 25%;
          z-index: 10;
          left: 0;
        }
        .truck__taillight:after {
          content: "";
          height: 100%;
          width: 800%;
          background: #ff4d4d;
          position: absolute;
          right: 0;
          top: 0;
          border-radius: 25%;
          filter: blur(8px);
          box-shadow: 0 0 60px 5px #ff8080;
        }
        .truck__headlight {
          height: 5%;
          width: 4%;
          position: absolute;
          right: 0;
          border-radius: 25%;
          top: 42%;
          z-index: 10;
          transform: rotate(4deg);
          background: #fff;
          box-shadow: 0 0 40px 5px #9bf, 0 0 2px 2px #b3ccff inset;
        }
        .truck__wheel {
          position: absolute;
        }
        .truck__wheel--front {
          height: 57%;
          width: 21%;
          bottom: 0;
          left: 75%;
          z-index: 4;
          transform: rotate(2deg);
        }
        .truck__wheel--rear {
          height: 57%;
          width: 21%;
          bottom: 2%;
          left: 10%;
          z-index: 4;
          transform: rotate(2deg);
        }
        .truck-wheel {
          border-radius: 100%;
          height: calc(var(--width) * 0.15px);
          width: calc(var(--width) * 0.15px);
          background: #242424;
          border-top: 1px solid #ccc;
          position: absolute;
          bottom: 0;
          left: 52%;
          transform: translate(-50%, 0);
        }
        .truck-wheel__rim {
          height: 60%;
          width: 60%;
          background: radial-gradient(circle at center, transparent, #666), #0d0d0d;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 100%;
          animation: spin 0.35s infinite linear;
        }
        .truck-wheel__rim:after {
          content: "";
          height: 35%;
          width: 35%;
          background: radial-gradient(
              circle at center,
              #0d0d0d,
              #0d0d0d 40%,
              transparent 40%
            ),
            radial-gradient(circle at center, #262626, #262626 40%, transparent),
            #8c8c8c;
          border: 1px solid #1a1a1a;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 100%;
          z-index: 2;
        }
        @keyframes spin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .truck-wheel__spoke {
          position: absolute;
          height: 60%;
          width: 20%;
          background: linear-gradient(0deg, transparent, #1a1a1a 50%), #808080;
          border-left: 1px solid #4d4d4d;
          border-right: 1px solid #333;
          border-radius: 0 0 25% 25%;
          top: 50%;
          left: 50%;
          transform-origin: top center;
          transform: translate(-50%, 0) rotate(calc(360 / 7 * var(--index) * 1deg));
        }
        .truck__wheel-arch {
          background: #080808;
          position: absolute;
          top: 0;
          left: 0;
          right: 1%;
          height: 54%;
          clip-path: polygon(0 100%, 23% 0, 81% 0%, 95% 60%, 95% 100%);
        }
        .truck__wheel-arch-trim {
          position: absolute;
        }
        .truck__wheel-arch-trim--top {
          top: 0;
          left: 25%;
          background: #8c8c8c;
          height: 5%;
          width: 53%;
          z-index: 2;
        }
        .truck__wheel-arch-trim--left {
          top: 0;
          left: -20%;
          background: linear-gradient(160deg, transparent, #666), #333;
          height: 5%;
          width: 44%;
          transform-origin: top right;
          transform: rotate(-60deg);
        }
        .truck__wheel-arch-trim--right {
          top: 0;
          left: 79%;
          background: linear-gradient(-158deg, transparent, #666), #333;
          height: 5%;
          width: 35%;
          transform-origin: top left;
          transform: rotate(58deg);
        }
        .truck__body {
          position: absolute;
          height: 100%;
          width: 100%;
        }
        .truck__body--top {
          background: linear-gradient(90deg, #f4f1f1, #bfbfbf 50%), #e8e3e3;
          height: 33%;
          width: 100%;
          top: 0;
          transform: rotate(3deg);
          clip-path: polygon(0 100%, 58% 0, 98% 100%);
        }
        .truck__body--top:before {
          --groove: #999;
          content: "";
          background: linear-gradient(
              95deg,
              transparent,
              transparent 2%,
              var(--groove) 2%,
              var(--groove) 3%,
              transparent 3%
            ),
            linear-gradient(
              75deg,
              transparent,
              transparent 47%,
              var(--groove) 47%,
              var(--groove) 48%,
              transparent 48%
            ),
            linear-gradient(
              78deg,
              transparent,
              transparent 95%,
              var(--groove) 95%,
              var(--groove) 96%,
              transparent 96%
            );
          position: absolute;
          height: 55%;
          width: 40%;
          left: 36%;
          bottom: 0;
          clip-path: polygon(0 100%, 0 0, 100% 58%, 100% 100%);
        }
        .truck__body--mid {
          position: absolute;
          width: 100%;
          height: 36%;
          top: 25%;
          transform: rotate(3deg);
          transform-origin: top left;
          z-index: 2;
        }
        .truck__body--mid:after {
          content: "";
          position: absolute;
          background: #1f1f1f;
          height: 20%;
          width: 5%;
          bottom: 20%;
          right: -0.25%;
          opacity: 1;
          border-left: 1px solid #1a1a1a;
        }
        .truck__body--mid:before {
          content: "";
          position: absolute;
          background: #0f0f0f;
          height: 20%;
          width: 5%;
          bottom: 5%;
          right: 0%;
          border-radius: 0 0 50% 25%;
          border-left: 1px solid #141414;
        }
        .truck__body--bottom {
          top: 50%;
          height: 32%;
        }
        .truck__rear-bumper {
          position: absolute;
          height: 1px;
          width: 9%;
          background: #808080;
          top: 38%;
          left: 2.5%;
          transform-origin: top left;
          transform: rotate(3deg);
        }
        .truck__side-skirt {
          height: 1px;
          width: 43%;
          position: absolute;
          bottom: 19%;
          left: 32%;
          transform-origin: top left;
          transform: rotate(1deg);
          background: #808080;
        }
        .truck__underpanel {
          background: #080808;
          height: 65%;
          width: 100%;
          position: absolute;
          bottom: 0;
          clip-path: polygon(2% 0, 14% 100%, 88% 100%, 99% 60%, 99% 40%);
        }
        .truck__mid-body {
          --groove: #262626;
          height: 100%;
          width: 100%;
          background: linear-gradient(
              84deg,
              transparent,
              transparent 36.75%,
              var(--groove) 36.75%,
              var(--groove) 37.25%,
              transparent 37.25%
            ),
            linear-gradient(
              83deg,
              transparent,
              transparent 55.75%,
              var(--groove) 55.75%,
              var(--groove) 56.25%,
              transparent 56.25%
            ),
            linear-gradient(
              88deg,
              transparent,
              transparent 75%,
              var(--groove) 75%,
              var(--groove) 75.5%,
              transparent 75.5%
            ),
            linear-gradient(90deg, transparent, transparent 96%, #1f1f1f 96%),
            linear-gradient(90deg, transparent, #262626),
            #333;
          clip-path: polygon(0 0, 3% 100%, 80% 84%, 99.5% 78%, 100% 10%, 98% 0);
        }
        .truck__mid-body:after,
        .truck__mid-body:before {
          content: "";
          position: absolute;
          width: 4%;
          height: 4%;
          left: 38%;
          top: 6%;
          border: 1px solid #4d4d4d;
          border-radius: 25%;
        }
        .truck__mid-body:before {
          left: 58%;
        }
        .truck__window {
          --window-black: rgba(0, 0, 0, 0.85);
          --window-white: rgba(255, 255, 255, 0.3);
          position: absolute;
          height: 80%;
          width: 60%;
          background: #000;
          left: 37%;
          transform: skew(-5deg);
          clip-path: polygon(0 100%, 0 55%, 34.5% 11%, 85% 108%);
        }
        .truck__window-glass {
          background: linear-gradient(
              0deg,
              var(--window-black) 0,
              var(--window-black) 15%,
              transparent 15%
            ),
            linear-gradient(90deg, transparent, var(--window-black) 90%),
            linear-gradient(90deg, var(--window-white), transparent 80%),
            linear-gradient(
              68deg,
              transparent,
              transparent 30%,
              var(--window-black) 30%,
              var(--window-black) 31%,
              transparent 31%,
              transparent 55%,
              var(--window-black) 55%,
              var(--window-black) 56%,
              transparent 56%
            ),
            var(--window-white);
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 88%;
          width: 98%;
          clip-path: polygon(0 100%, 0 55%, 34.5% 11%, 85% 105%);
        }
        .truck__window:before {
          content: "";
          background: #000;
          position: absolute;
          height: 10%;
          width: 100%;
          bottom: 0;
          transform: rotate(2deg);
          z-index: -1;
          clip-path: polygon(40% 100%, 100% -100%, 100% 100%);
        }
      `}</style>
    </div>
  );
}
