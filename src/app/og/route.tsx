import { ImageResponse } from 'next/og';

export const contentType = 'image/png';

const WIDTH = 1200;
const HEIGHT = 630;

const DARK = '#141414';
const ACCENT = '#bbff00';

/**
 * Generator obrazkow Open Graph: /og?title=...&subtitle=...
 *
 * Trasa stoi poza segmentem [locale] (i poza matcherem proxy), zeby adres byl
 * stabilny niezaleznie od mapy `pathnames` - inaczej kazda zmiana sluga
 * unieważnialaby URL-e obrazkow zapisane w cache'u Facebooka czy Slacka.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') ?? 'OurMoney').slice(0, 120);
  const subtitle = (searchParams.get('subtitle') ?? '').slice(0, 180);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: DARK,
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: ACCENT,
            }}
          />
          <div
            style={{
              fontSize: 30,
              color: '#ffffff',
              letterSpacing: -0.5,
            }}
          >
            OurMoney
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: title.length > 60 ? 62 : 76,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                marginTop: 28,
                fontSize: 30,
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ height: 4, width: 84, background: ACCENT }} />
          <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.4)' }}>ourmoney.pl</div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
