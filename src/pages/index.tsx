import React from "react";

function Landing() {
  return (
    <div>
      <header className="flex h-screen flex-col items-center justify-center gap-3 px-2">
        <h1 className="text-[33px] font-semibold">Welcome to Hush ASMR</h1>{" "}
        <p className="w-full px-1 text-center text-[15px] text-zinc-400">
          A subscription platform empowering ASMR creators to own their full
          potential, monetize their content, and develop authentic connections
          with their fans.
        </p>
        <div className="flex w-full items-center justify-between gap-2 px-6 py-2">
          <input
            type="email"
            placeholder="creator@email.com"
            aria-label="Email for creators"
            className="w-full rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-primary" // Focus styles added for better UX
          />
          <button className="rounded-md bg-primary p-2 text-white">
            Waitlist
          </button>{" "}
        </div>
      </header>
      <main>
        <section className="flex flex-col items-center justify-center gap-3 bg-gray-800 px-2 py-8 text-center">
          <h2 className="text-[26px] font-semibold">
            ASMR is inherently sexy.
          </h2>{" "}
          <p className="w-full px-1 text-center text-[15px] text-zinc-400">
            ASMR should be playful, sensual, and sexy. We believe that ASMR can
            be a powerful tool for intimacy and connection. Experience the power
            of sexy ASMR.
          </p>
        </section>
        <section className="flex flex-col items-center justify-center gap-3 bg-gray-700 px-2 py-8 text-center">
          <h2 className="text-[26px] font-semibold">
            Empowering content creators.
          </h2>
          <p className="w-full px-1 text-center text-[15px] text-zinc-400">
            Creators should fully own their potential, monetize their content
            effectively, and build genuine connections with their audience.
            We're here to make that happen.
          </p>
        </section>
        <section className="flex flex-col items-center justify-center gap-3 bg-gray-800 px-2 py-8 text-center">
          <h2 className="text-[26px] font-semibold">
            A platform tailored for ASMR.
          </h2>
          <p className="w-full px-1 text-center text-[15px] text-zinc-400">
            From dark mode to high-quality audio and a focus on community, we're
            crafting an experience that meets the unique needs of the ASMR
            community.
          </p>
        </section>
      </main>
      <footer className="py-4 text-center text-white">
        <p>© {new Date().getFullYear()} Hush ASMR. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;
