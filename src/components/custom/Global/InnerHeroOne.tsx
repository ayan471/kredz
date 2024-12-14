import Image from "next/image";

interface InnerHeroOneProps {
  bgImgUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

const InnerHeroOne: React.FC<InnerHeroOneProps> = ({
  bgImgUrl,
  title,
  subtitle,
  ctaText,
}) => {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      <Image
        src={bgImgUrl}
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">{subtitle}</p>
        {ctaText && (
          <button className="bg-white text-orange-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-orange-100 transition duration-300">
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default InnerHeroOne;
