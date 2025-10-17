"use client";

import { motion } from "framer-motion";
import Container from "@/components/Container";
import Image from "next/image";
import { Feather, Gem, Scissors, Sparkle, Square, Sun, Waves } from "lucide-react";

// Data for the fabric categories, structured for easy mapping
const fabricCategories = [
  {
    title: "Plain Fabrics",
    icon: Square,
    items: ["Cotton", "Linen", "Viscose", "Denim & Chambray", "Chiffon & Georgette", "Lycra", "Muslin", "Poplin", "Velvet", "Lycra Stretch"],
  },
  {
    title: "Printed Fabrics",
    icon: Sparkle,
    items: ["Hand-block Printed (Dabu, Jahota, Bagru, Vanaspati, Batik, Kalamkari)", "Kantha Stitch", "Printed Cotton", "Printed Glazed Cotton", "Printed Viscose", "Printed Linen", "Printed Chiffon", "Printed Bubble Georgette", "Printed Denim", "Printed Velvet"],
  },
  {
    title: "Silks",
    icon: Gem,
    items: ["Raw Silk", "Pure Silk", "Armani Silk", "Bridal Satin", "American Silk", "Perfume Silk", "Charmause Silk", "Valentina", "Nidha", "Organza", "Shimmer Silk", "Lame"],
  },
  {
    title: "Embroidered",
    icon: Feather,
    items: ["Embroidered Raw Silk", "Cutlawn Cotton", "Cutlawn Linen", "Mirror Work Embroidered Raw Silk", "Embroidered Denim", "Embroidered Nets & Laces", "Embroidered Nidha"],
  },
  {
    title: "Brocades",
    icon: Sun,
    items: ["Silk Brocade", "Banarasi Brocade", "Heavy Brocade"],
  },
  {
    title: "Laces & Nets",
    icon: Waves,
    items: ["Gaipure Lace", "Stretch Lace", "Plain Tulle Net", "Embroidered Nets"],
  },
  {
    title: "Sequin Fabrics",
    icon: Scissors, // Re-using an icon for visual variety
    items: ["A variety of sequin fabrics for special occasions."],
  },
];


const AboutPage = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="bg-[#F9F6F2] py-24 sm:py-32">
        <Container className="text-center">
          <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
            <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#3A322D]">
              25 Years of Curating Beauty
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-[#6B625C] leading-relaxed">
              As a family business, we understand the transformative power of
              fabrics – they have the ability to make you feel truly beautiful and
              confident in your own skin.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Our Story Section */}
      <Container className="py-20 sm:py-28">
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
        >
            {/* Placeholder for an image of the store or founders */}
            <div className="w-full aspect-square bg-[#F0EBE3] rounded-lg">
                {/* <Image src={...} alt="Ambrins Fabrics Store" className="rounded-lg object-cover w-full h-full" /> */}
            </div>
            <div className="text-center lg:text-left">
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#3A322D] mb-4">Our Journey in Fabric</h2>
                <p className="text-[#6B625C] leading-loose">
                Our journey began a quarter of a century ago, and our love for fabrics has only grown stronger. We source textiles internationally and locally, offering a comprehensive selection that empowers you to create outfits that fit perfectly and tell unique stories.
                </p>
            </div>
        </motion.div>
      </Container>
      
      {/* Commitment Section */}
       <div className="bg-[#3A322D] py-20">
            <Container className="text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={sectionVariants}
                >
                    <h3 className="font-serif text-4xl text-[#F9F6F2]">"We take fabrics seriously."</h3>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-300">
                        This is not just our tagline; it's our commitment to providing you with the finest materials available, so you can unleash your creativity.
                    </p>
                </motion.div>
            </Container>
        </div>


      {/* Fabric Collection Section */}
      <div className="py-20 sm:py-28 bg-[#F9F6F2]">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#3A322D]">Our Fabric Collection</h2>
            <p className="mt-4 max-w-2xl mx-auto text-[#6B625C]">
              Our selection includes fashion fabrics spanning, but not limited to lace, linen, silk, brocades, denim, chiffon, cotton and silks for all your fabric needs.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {fabricCategories.map((category) => (
              <motion.div
                key={category.title}
                variants={sectionVariants}
                className="bg-white p-6 rounded-lg border border-gray-200/70 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-3">
                    <category.icon className="w-6 h-6 text-[#B98B73]" />
                    <h3 className="font-serif text-xl font-semibold text-[#3A322D]">{category.title}</h3>
                </div>
                <p className="text-sm text-[#6B625C]">
                    {category.items.join(', ')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>
    </section>
  );
};

export default AboutPage;