import StorePage from "../components/store-page";

interface StoreSlugPageProps {
  params: Promise<{ storename: string }>;
}

export default async function StoreSlugPage({ params }: StoreSlugPageProps) {
  const { storename } = await params;
  const decodedStorename = decodeURIComponent(storename);

  return <StorePage storeSlug={decodedStorename} />;
}
