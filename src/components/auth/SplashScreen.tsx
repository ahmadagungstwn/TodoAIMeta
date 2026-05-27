import { AppShell } from '../layout/AppShell';
import { LogoMark } from '../ui/LogoMark';

export function SplashScreen() {
  return (
    <AppShell hideNav className="splash-phone">
      <div className="preloader">
        <LogoMark size="lg" />
        <div className="center-copy">
          <h1>Ideaku AI</h1>
          <p>Menyiapkan ruang ide kamu...</p>
        </div>
        <div className="loading-dots" aria-label="Memuat aplikasi">
          <span />
          <span />
          <span />
        </div>
      </div>
    </AppShell>
  );
}
