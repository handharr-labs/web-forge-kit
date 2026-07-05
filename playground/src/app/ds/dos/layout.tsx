// forge-ui-dos (Mekar) declares its font families in tokens but the host app
// loads them. Next hoists this stylesheet <link> into <head> for this route.
export default function DosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Pinyon+Script&family=Jost:wght@300;400;500&display=swap"
      />
      {children}
    </>
  );
}
