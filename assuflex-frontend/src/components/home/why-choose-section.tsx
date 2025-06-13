import { useRef, useEffect } from "react";
import { Handshake, FileText,Award,UserCog} from "lucide-react";
import gsap from "gsap";

const features = [
  {
    id: "expert",
    icon: <Handshake size={50} />,
    title: "Experts de l’assurance santé et prévoyance",
    desc: "Un accompagnement personnalisé pour les indépendants, professionnels de santé, artisans et entreprises.",
  },
  {
    id: "legal",
    icon: <FileText size={50} />,
    title: "Conformité légale garantie",
    desc: <>
      <span className="font-semibold">Respectez la loi</span> tout en protégeant vos projets et clients.
    </>,
  },
  {
    id: "quote",
    icon: <Award size={50} />,
    title: "Devis ultra-rapide",
    desc: "100% en ligne, recevez une offre personnalisée en quelques clics.",
  },
  {
    id: "offers",
    icon: <UserCog size={50} />,
    title: "Offres compétitives",
    desc: "Nous collaborons avec les meilleurs assureurs en France pour vous offrir le meilleur tarif.",
  },
];

export function WhyChooseSection() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const setCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el && cardsRef.current) {
      cardsRef.current[index] = el;
    }
  };
  useEffect(() => {
    const cards = cardsRef.current.filter(card => card !== null);

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.13,
        duration: 0.7,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section className="w-full bg-[#fef9f8] py-8 md:py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-center mb-8 sm:mb-12 md:mb-14 text-[#18194f]">
          Pourquoi choisir<span className="text-[#FF6A00]">ASSU</span><span className="text-[#003E8A]">FLEX</span> ?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-7 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.id}
              ref={(el) => setCardRef(el, i)}
              className="relative rounded-2xl bg-white shadow-none px-5 sm:px-6 lg:px-6 py-8 sm:py-10 md:py-12 text-[#18194f] min-h-[260px] sm:min-h-[310px] md:min-h-[340px] flex flex-col items-start justify-start"
            >
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none hidden sm:block"
                style={{
                  boxShadow: '8px 10px 0 rgba(123, 142, 251, 0.3)',
                  zIndex: 0,
                  top: '8px',
                  left: '8px'
                }}
              />

              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-6">
                  {feature.icon}
                </div>

                <h3 className="font-bold text-base sm:text-lg md:text-xl text-left  w-full mb-2 sm:mb-3">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm text-left w-full leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseSection;