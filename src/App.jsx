import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const assets = {
  // Replace these with your real transparent assets.
  savannah: '/assets/savannah-sunset.jpg',
  tanJacket: '/assets/jacket-tan.png',
  darkJacket: '/assets/jacket-dark.png',
  logo: '/assets/kilimani-logo.png',
};

const products = {
  tan: {
    name: 'Tan Kilimani Jacket',
    colorway: 'Tan',
    sizes: {
      XS: 'https://your-store.myshopify.com/products/tan-jacket?variant=XS',
      S: 'https://your-store.myshopify.com/products/tan-jacket?variant=S',
      M: 'https://your-store.myshopify.com/products/tan-jacket?variant=M',
      L: 'https://your-store.myshopify.com/products/tan-jacket?variant=L',
      XL: 'https://your-store.myshopify.com/products/tan-jacket?variant=XL',
    },
  },
  darkGrey: {
    name: 'Dark Grey Kilimani Jacket',
    colorway: 'Dark Grey',
    sizes: {
      XS: 'https://your-store.myshopify.com/products/dark-grey-jacket?variant=XS',
      S: 'https://your-store.myshopify.com/products/dark-grey-jacket?variant=S',
      M: 'https://your-store.myshopify.com/products/dark-grey-jacket?variant=M',
      L: 'https://your-store.myshopify.com/products/dark-grey-jacket?variant=L',
      XL: 'https://your-store.myshopify.com/products/dark-grey-jacket?variant=XL',
    },
  },
};

const sizes = ['XS', 'S', 'M', 'L', 'XL'];

const jacketConfig = {
  tan: { src: assets.tanJacket, side: 'left', product: products.tan },
  darkGrey: { src: assets.darkJacket, side: 'right', product: products.darkGrey },
};

function Silhouette({ wearing }) {
  return (
    <div className="relative z-20 flex h-[44vh] w-[22vh] min-w-[140px] flex-col items-center justify-start">
      <div className="h-[16vh] w-[11vh] rounded-full bg-black/95" />
      <div className="relative -mt-2 h-[28vh] w-[18vh] rounded-[42%] bg-black" />
      {wearing && (
        <motion.img
          src={jacketConfig[wearing].src}
          alt={`${wearing} jacket worn on mannequin`}
          className="pointer-events-none absolute top-[10vh] w-[26vh] min-w-[170px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.75)]"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

export default function App() {
  const [activeJacket, setActiveJacket] = useState(null);
  const [selectedJacket, setSelectedJacket] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const cinematicTiming = useMemo(
    () => ({
      // Controls initial camera zoom into the sun.
      introZoomDuration: 4.8,
      // Controls when blur/fade overtakes the savannah scene.
      blurFadeDelay: 3.2,
      blurFadeDuration: 1.8,
      // Controls the transition of sun to final glowing globe.
      globeRevealDelay: 3.6,
      globeRevealDuration: 1.5,
    }),
    []
  );

  const onSizeClick = (jacketKey, size) => {
    const url = products[jacketKey].sizes[size];
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-zinc-100">
      <header className="pointer-events-none absolute left-0 top-0 z-50 flex w-full items-start justify-between px-6 py-5 md:px-12">
        <div className="pointer-events-auto text-2xl font-semibold lowercase tracking-wide">kilimani</div>
        <button className="pointer-events-auto flex h-10 w-10 flex-col items-center justify-center gap-1.5" aria-label="menu">
          <span className="h-0.5 w-6 bg-zinc-200" />
          <span className="h-0.5 w-6 bg-zinc-200" />
          <span className="h-0.5 w-6 bg-zinc-200" />
        </button>
      </header>

      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
        animate={{ scale: 1.9, filter: 'blur(12px)', opacity: 0.45 }}
        transition={{ duration: cinematicTiming.introZoomDuration, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '34% 54%' }}
      >
        <img src={assets.savannah} alt="Savannah sunset" className="h-full w-full object-cover" />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_48%_50%,rgba(255,187,0,.48),rgba(121,14,0,.95)_52%,#090909_85%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: cinematicTiming.blurFadeDelay, duration: cinematicTiming.blurFadeDuration }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-[35vmin] w-[35vmin] min-h-[220px] min-w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle at 30% 30%, #ffee9e, #ffd200 45%, #d79f00 85%)', boxShadow: '0 0 140px rgba(255,204,0,0.55), inset 0 -20px 70px rgba(165,95,0,0.35)' }}
        initial={{ opacity: 0, scale: 0.45 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: cinematicTiming.globeRevealDelay, duration: cinematicTiming.globeRevealDuration }}
      />

      <section className="absolute inset-0 z-30 flex items-center justify-center pt-10">
        <div className="relative flex h-full w-full items-center justify-center">
          <Silhouette wearing={selectedJacket} />

          {Object.entries(jacketConfig).map(([key, cfg]) => {
            const isLeft = cfg.side === 'left';
            const isActive = activeJacket === key;
            const xBase = isLeft ? '-26vw' : '26vw';
                        return (
              <motion.div
                key={key}
                className="absolute z-30"
                initial={{ opacity: 0, y: 22 }}
                animate={{
                  opacity: 1,
                  x: isActive ? 0 : xBase,
                  y: isActive ? -14 : [0, -10, 0],
                  scale: isActive ? 1.12 : [1, 1.03, 1],
                  rotate: isActive ? 0 : isLeft ? [-2, 1.5, -2] : [2, -1.5, 2],
                }}
                transition={isActive ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] } : { duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
                onHoverStart={() => {
                  setActiveJacket(key);
                  setSelectedJacket(key);
                }}
                onHoverEnd={() => setActiveJacket(null)}
              >
                <img src={cfg.src} alt={cfg.product.name} className="w-[36vw] max-w-[420px] min-w-[170px]" />

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="mt-4 flex justify-center gap-2"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                    >
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => onSizeClick(key, size)}
                          className="h-9 w-9 rounded-full bg-yellow-400 text-[11px] font-semibold text-black transition hover:scale-110"
                        >
                          {size}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {redirecting && (
          <motion.div
            className="absolute inset-0 z-[60] grid place-items-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-xs uppercase tracking-[0.35em] text-yellow-300">Routing to Shopify…</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
