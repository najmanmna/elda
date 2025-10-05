// components/MissionSection.tsx
import { client } from "@/sanity/lib/client";
import Container from "@/components/Container";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-relaxed whitespace-pre-wrap mb-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
  },
};

const MISSION_QUERY = `*[_type == "page" && slug.current == "our-mission"][0]{
  title,
  content
}`;

export default async function MissionSection() {
  const mission = await client.fetch(MISSION_QUERY);

  if (!mission) return null;

  return (
   <section className="relative bg-tech_white py-16">
  {/* Background Image */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: "url('/ourmission.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.15, // 85% transparent → 15% visible
    }}
  ></div>

  {/* Overlay to ensure content readable */}
  {/* <div className="absolute inset-0 bg-white/80"></div> */}

  <Container className="relative max-w-6xl px-4 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Left: Image */}
      <div className="sm:w-[420px] mx-auto h-[500px] rounded-3xl overflow-hidden flex items-center justify-center relative z-10">
        <Image
          src="/ourmission.jpg"
          alt="Our Mission"
          width={500}
          height={200}
          className="w-full h-full object-cover rounded-3xl bg-blue-800"
        />
      </div>

      {/* Right: Text */}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-6">{mission.title}</h2>
        <div className="prose prose-gray max-w-3xl sm:text-[18px]">
          <PortableText value={mission.content} components={components} />
        </div>
      </div>
    </div>
  </Container>
</section>

  );
}
