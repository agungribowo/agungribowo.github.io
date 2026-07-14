import { motion, type Variants } from 'framer-motion'
import { Mail, MessageCircle, ExternalLink, ChevronRight, Server, RefreshCw, ShieldCheck } from 'lucide-react'

const easeOut = [0.25, 0.1, 0.25, 1] as const

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: easeOut },
  }),
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12)_0%,_transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 inline-block rounded-full border border-emerald-700/50 bg-emerald-900/40 px-4 py-1.5 text-sm font-medium tracking-wide text-emerald-300 backdrop-blur-sm"
        >
          Web Developer &amp; System Architect
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Solusi Web Modern,{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent">
            Future-Proof
          </span>
          , dan Terintegrasi.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-emerald-200 sm:text-lg"
        >
          Menghadirkan layanan pengembangan dan pemeliharaan website profesional untuk bisnis Anda. Dibangun dengan fondasi arsitektur modern yang menjamin performa tinggi, skalabilitas, dan kesiapan untuk integrasi teknologi cerdas.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-emerald-300/80 sm:text-base"
        >
          Klien B2B di kota besar sangat menghargai stabilitas. Dengan latar belakang <span className="font-semibold text-emerald-200">Magister Informatika</span> dan pola pikir engineering yang terstruktur &amp; analitis, setiap sistem yang saya bangun berfokus pada <span className="font-semibold text-emerald-200">stabilitas server, keamanan data,</span> dan <span className="font-semibold text-emerald-200">kesiapan infrastruktur untuk masa depan</span> — bukan sekadar tampilan yang menarik.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3.5 font-semibold text-emerald-950 shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:bg-yellow-400 hover:shadow-yellow-400/40 hover:scale-105 active:scale-95"
          >
            Konsultasikan Proyek
            <ChevronRight className="h-4 w-4" />
          </a>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-700/60 bg-emerald-900/30 px-6 py-3.5 font-semibold text-amber-50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/80 hover:bg-emerald-900/50 hover:scale-105 active:scale-95"
          >
            Lihat Karya Saya
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

function About() {
  return (
    <motion.section
      id="about"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative mx-auto max-w-6xl px-4 py-28 sm:px-6"
    >
      <div className="rounded-2xl border border-emerald-800/60 bg-emerald-900/30 p-8 backdrop-blur-sm sm:p-12 md:p-16">
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Pendekatan Engineering untuk{' '}
          <span className="text-yellow-400">Solusi Bisnis</span>
        </h2>
        <div className="h-1 w-20 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 mb-8" />
        <p className="max-w-4xl text-base leading-relaxed text-emerald-200 sm:text-lg">
          Dengan latar belakang akademis di tingkat Magister Informatika, setiap proyek dikembangkan melalui pendekatan engineering yang terstruktur. Fokus utama saya adalah membangun infrastruktur web yang tidak hanya berfungsi hari ini, tetapi juga siap beradaptasi dengan kebutuhan masa depan. Mulai dari merancang arsitektur baru menggunakan ekosistem modern, hingga memastikan efisiensi pengelolaan data pada skala yang lebih besar.
        </p>
      </div>
    </motion.section>
  )
}

const services = [
  {
    icon: Server,
    title: 'Pengembangan Website Kustom',
    description:
      'Membangun company profile, katalog, atau sistem web dari nol dengan fokus pada kecepatan dan desain responsif.',
  },
  {
    icon: RefreshCw,
    title: 'Modernisasi &amp; Migrasi Sistem',
    description:
      'Peningkatan arsitektur dari sistem lama ke tech stack modern untuk keamanan dan performa yang lebih optimal.',
  },
  {
    icon: ShieldCheck,
    title: 'Pemeliharaan (Maintenance) Berkala',
    description:
      'Memastikan server, keamanan, dan uptime website tetap stabil secara jangka panjang, membebaskan pemilik bisnis dari kendala teknis.',
  },
]

function Services() {
  return (
    <motion.section
      id="services"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mx-auto max-w-6xl px-4 py-28 sm:px-6"
    >
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Layanan <span className="text-yellow-400">Profesional</span>
        </h2>
        <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ scale: 1.03 }}
            className="group cursor-default rounded-2xl border border-emerald-800/60 bg-emerald-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-600/80 hover:bg-emerald-900/60 hover:shadow-lg hover:shadow-emerald-900/30"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 transition-colors duration-300 group-hover:bg-yellow-500/20">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-amber-50">{s.title}</h3>
            <p className="leading-relaxed text-emerald-200">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

const portfolioItems = [
  {
    name: 'Surya Mandiri Steel',
    url: 'https://suryamandiristeel.id',
    image: '/portfolio-sms.jpg',
    description:
      'Pengembangan platform digital representatif untuk industri baja dan pemeliharaan sistem berkelanjutan untuk memastikan aksesibilitas yang andal bagi mitra bisnis.',
  },
  {
    name: 'Surya Plast HDPE',
    url: 'https://suryaplasthdpe.co.id',
    image: '/portfolio-sph.jpg',
    description:
      'Pembuatan sekaligus manajemen infrastruktur website manufaktur plastik HDPE. Fokus pada representasi profesional dan stabilitas performa jangka panjang.',
  },
]

function Portfolio() {
  return (
    <motion.section
      id="portfolio"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mx-auto max-w-6xl px-4 py-28 sm:px-6"
    >
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Sistem yang Saya <span className="text-yellow-400">Pelihara</span>
        </h2>
        <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {portfolioItems.map((item, i) => (
          <motion.a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ scale: 1.02 }}
            className="group block overflow-hidden rounded-2xl border border-emerald-800/60 bg-emerald-900/40 backdrop-blur-sm transition-all duration-300 hover:border-emerald-600/80 hover:bg-emerald-900/60 hover:shadow-lg hover:shadow-emerald-900/30"
          >
            <div className="relative overflow-hidden bg-emerald-950">
              <div className="flex items-center gap-1.5 border-b border-emerald-800/40 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-2 p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-amber-50 transition-colors duration-300 group-hover:text-yellow-400">
                  {item.name}
                </h3>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-emerald-400 transition-colors duration-300 group-hover:text-yellow-400" />
              </div>
              <p className="font-mono text-sm text-emerald-300">{item.url}</p>
              <p className="leading-relaxed text-emerald-200">{item.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  )
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-emerald-800/40 bg-emerald-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-8 text-lg leading-relaxed text-emerald-200 sm:text-xl">
            Mari diskusikan bagaimana teknologi web modern dapat mengefisiensikan operasional bisnis dan meningkatkan kehadiran digital Anda.
          </p>
          <div className="flex items-center justify-center gap-5">
            {[
              { icon: Mail, href: 'mailto:ribowoagung@gmail.com', label: 'Email' },
              { icon: MessageCircle, href: 'https://wa.me/6281328996617', label: 'WhatsApp' },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/agungribowo',
                svg: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
              },
              {
                label: 'GitHub',
                href: 'https://github.com/agungribowo',
                svg: <><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></>,
              },
            ].map(({ icon: Icon, href, label, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-700/50 bg-emerald-900/40 text-emerald-300 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/60 hover:bg-yellow-500/10 hover:text-yellow-400 hover:scale-110"
              >
                {Icon ? <Icon className="h-5 w-5" /> : <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{svg}</svg>}
              </a>
            ))}
          </div>
          <p className="mt-12 text-sm text-emerald-700">
            &copy; {new Date().getFullYear()} Portfolio Web Developer. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-emerald-950">
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Footer />
    </div>
  )
}
