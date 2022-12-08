import Link from 'next/link';

const Nav = ({ currentUser }) => {
  // linkConfig => filter elements that are false
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <Link href={href} key={href}>
          {label}
        </Link>
      );
    });
  return (
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <a class="navbar-brand">Navbar</a>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">{links}</div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
