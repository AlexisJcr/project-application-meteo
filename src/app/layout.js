export const metadata = {
  title: 'Application Météo',
  description: "Application Météo, développée en NextJS, utilise l'api WeatherAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
