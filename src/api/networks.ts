export function networkLabel(id: string) {
  return (
    (
      {
        "eip155:1": "Ethereum · ETH",
        "eip155:56": "BNB Smart Chain · BNB",
        "eip155:137": "Polygon PoS · POL",
      } as Record<string, string>
    )[id] || id
  );
}
