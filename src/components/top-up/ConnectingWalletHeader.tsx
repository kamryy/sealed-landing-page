interface ConnectingWalletHeaderProps {
  title: string;
  subTitle: string;
}

export default function ConnectingWalletHeader({
  title,
  subTitle,
}: ConnectingWalletHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mr-auto">
      <p className="text-2xl sm:text-4xl font-bold ">{title}</p>
      <p className="text-base sm:text-xl text-[#b3b3b3]">{subTitle}</p>
    </div>
  );
}
