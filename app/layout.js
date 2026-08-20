export const metadata = {
  title: 'Pajangan NFC Google Review',
  description: 'Sistem Redirect Google Review',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
        {children}
      </body>
    </html>
  );
}
