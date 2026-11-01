import type { StaticImageData } from "next/image";
import heroBanner from "../public/banner.webp";
import logoSpMotos from "../public/logo-spmotos.webp";

interface BrandAssets {
  logo: StaticImageData;
  heroBanner: StaticImageData;
}

export const brandAssets: BrandAssets = {
  logo: logoSpMotos,
  heroBanner,
};
