import Image from "next/image";

function Wagenge() {
  return (
    <Image
      className="rounded-full"
      src="/icons/icon-512x512.png"
      alt="Wagenge"
      width={256}
      height={256}
      priority={false}
    />
  );
}

export { Wagenge };
