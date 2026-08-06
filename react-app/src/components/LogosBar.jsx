const BRANDS = [
  'GLAMOUR',
  'InStyle',
  'VANITY FAIR',
  'allure',
  "Women'sHealth",
  'COSMOPOLITAN',
];

export default function LogosBar() {
  return (
    <div className="logos-bar">
      {BRANDS.map((brand) => (
        <span key={brand}>{brand}</span>
      ))}
    </div>
  );
}
