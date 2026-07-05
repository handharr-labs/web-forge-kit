// forge-ui-dos (Mekar) declares its font families in tokens but the host app
// loads them. Next hoists this stylesheet <link> into <head> for this route.
// Covers all four typography sets (classic · modern · romantic · editorial).
const FONTS =
  "https://fonts.googleapis.com/css2" +
  "?family=Cormorant+Garamond:wght@500;600" +
  "&family=Pinyon+Script" +
  "&family=Jost:wght@300;400;500" +
  "&family=Playfair+Display:wght@500;600" +
  "&family=Great+Vibes" +
  "&family=Montserrat:wght@300;400;500" +
  "&family=EB+Garamond:wght@500;600" +
  "&family=Tangerine:wght@400;700" +
  "&family=Lato:wght@300;400;700" +
  "&family=Fraunces:wght@500;600" +
  "&family=Sacramento" +
  "&family=Inter:wght@300;400;500" +
  "&display=swap";

export default function DosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href={FONTS} />
      {children}
    </>
  );
}
