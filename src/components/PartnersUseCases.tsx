import Image from "next/image";

export default function PartnersUseCases({
  title,
  subTitle,
  description,
  sealedDesc,
  resources,
}: {
  title: string;
  subTitle: string;
  description: string;
  sealedDesc: string;
  resources: { link: string; label: string }[];
}) {
  return (
    <section className="relative z-20 rounded-[28px]">
      <div
        className="group flex flex-col items-center justify-center rounded-[15px] p-5 text-center shadow-[0_1.25px_2.5px_rgba(0,0,0,0.05)] ring-1 ring-transparent transition-all duration-300 ease-out "
        style={{
          backgroundImage:
            "linear-gradient(203deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.2) 40%), linear-gradient(90deg, rgba(28,28,28,0.2) 0%, rgba(28,28,28,0.2) 100%)",
        }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300
               bg-[linear-gradient(93.59deg,#6BFAD6_18.6%,#CA7344_96.15%)]"
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
        <div className="flex gap-3 flex-col">
          <p className="text-xl font-bold text-left">{title}</p>
          <p className="text-md text-white/80 bg-[#1c1c1c]  text-left w-fit px-3 py-[2px] rounded-[8px] mb-1 mt-1 ">
            {subTitle}
          </p>

          <p className="text-sm text-left text-white/80">{description}</p>

          <div className="relative p-[1px] rounded-xl border border-[#6BFAD6]">
            <div className="bg-[#0D1F1A] rounded-[11px] px-4 py-3">
              <p className="text-sm text-left text-white/90">
                <span className="font-semibold text-[#6BFAD6]">
                  Sealed Solution:
                </span>{" "}
                {sealedDesc}
              </p>
            </div>
          </div>

          <div className="">
            <h4 className="text-md text-left">Resources</h4>
            <ol className="flex items-center gap-8">
              {resources.map((res, idx) => (
                <li key={idx} className="mt-2 text-xs text-sealed-teal">
                  <a href={res.link} target="_blank" className="flex gap-2">
                    {res.label}{" "}
                    <Image
                      src="/assets/icons/download.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
