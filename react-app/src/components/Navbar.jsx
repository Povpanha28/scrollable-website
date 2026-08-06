const NAV_ITEMS = [
  { label: 'HOME', href: '#' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'PROGRAM', href: '#program' },
  { label: 'MY TOP PICKS', href: '#picks' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <a href="#" className="logo">X3 Fashion</a>
      <nav className="nav-links">
        {NAV_ITEMS.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
