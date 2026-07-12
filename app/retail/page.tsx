import { getRetailCatalogData } from "@/app/actions/retail";
import RetailCatalogView from "@/components/catalog/RetailCatalogView";

export const metadata = {
  title: "Retail Banking Catalog - Learning & Development",
  description: "Explore the training programs and career learning tracks for Retail job families.",
};

export default async function RetailCatalogPage() {
  const data = await getRetailCatalogData();
  return <RetailCatalogView data={data} />;
}
