import { INITIAL_STOCKS } from "@/data/stocks";
import StockDetailClient from "./StockDetailClient";

export async function generateStaticParams() {
  return INITIAL_STOCKS.map((stock) => ({
    id: stock.id,
  }));
}

export default function StockDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <StockDetailClient params={params} />;
}
