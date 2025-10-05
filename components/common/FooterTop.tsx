import Image from "next/image";

interface FeatureItemData {
  title: string;
  icon: string; // path to image
}

const data: FeatureItemData[] = [
  {
    title: "Fast Delivery",
    icon: "/fast-delivery.png", // place file in public/icons/
  },
  {
    title: "Durability",
    icon: "/warranty-period.png",
  },
  {
    title: "Affordable Luxury",
    icon: "/star.png",
  },
  {
    title: "Customer Support",
    icon: "/public-service.png",
  },
];

const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {data.map((item, index) => (
        <FeatureItem key={index} icon={item.icon} title={item.title} />
      ))}
    </div>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
}

const FeatureItem = ({ icon, title }: FeatureItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 group p-4 transition-transform hover:scale-105">
      <Image
        src={icon}
        alt={title}
        width={50}
        height={50}
        className="transition-transform group-hover:scale-110"
      />
      <h3 className="font-normal text-gray-900 text-center">{title}</h3>
    </div>
  );
};

export default FooterTop;
