import CounterClient from "./CounterClient";
import getCounterData from "./get-counter-data";

export default async function Counter({
  refreshInterval,
}: {
  refreshInterval: number;
}) {
  return (
    <CounterClient
      fallbackData={await getCounterData()}
      refreshInterval={refreshInterval}
    />
  );
}
