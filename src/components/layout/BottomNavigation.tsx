import { ChatIcon, HomeIcon, IdeasIcon, PlusIcon, ProfileIcon } from '../icons/Icons';

const items = [
  { href: '/dashboard', label: 'Home', icon: HomeIcon, key: 'dashboard' },
  { href: '/ideas', label: 'Ideas', icon: IdeasIcon, key: 'ideas' },
  { href: '/chat', label: 'Chat', icon: ChatIcon, key: 'chat' },
  { href: '/profile', label: 'Profile', icon: ProfileIcon, key: 'profile' },
];

export function BottomNavigation({ active }: { active?: string }) {
  return (
    <nav
      style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingInline: '16px',
        paddingBottom: '12px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E8E4F0',
        overflow: 'visible',
        flex: '0 0 auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.02)',
      }}
      aria-label="Navigasi utama"
    >
      {items.slice(0, 2).map((item) => (
        <a
          style={{
            flex: 1,
            height: '56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: active === item.key ? '#7C5CFC' : '#8E8A9A',
            textDecoration: 'none',
            fontSize: '11px',
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            fontWeight: active === item.key ? 700 : 500,
            transition: 'color 0.2s ease',
          }}
          href={item.href}
          key={item.key}
        >
          <item.icon className="nav-icon" style={{ width: '20px', height: '20px', transition: 'transform 0.2s ease' }} />
          <span>{item.label}</span>
        </a>
      ))}
      <a
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '18px',
          backgroundColor: '#7C5CFC',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 8px 20px rgba(124, 92, 252, 0.3)',
          transform: 'translateY(-16px)',
          transition: 'transform 0.2s ease, backgroundColor 0.2s ease',
          cursor: 'pointer',
          flexShrink: 0,
          marginInline: '12px',
        }}
        href="/ideas/new"
        aria-label="Tambah ide"
      >
        <PlusIcon style={{ width: '24px', height: '24px' }} />
      </a>
      {items.slice(2).map((item) => (
        <a
          style={{
            flex: 1,
            height: '56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            color: active === item.key ? '#7C5CFC' : '#8E8A9A',
            textDecoration: 'none',
            fontSize: '11px',
            fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            fontWeight: active === item.key ? 700 : 500,
            transition: 'color 0.2s ease',
          }}
          href={item.href}
          key={item.key}
        >
          <item.icon className="nav-icon" style={{ width: '20px', height: '20px', transition: 'transform 0.2s ease' }} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

