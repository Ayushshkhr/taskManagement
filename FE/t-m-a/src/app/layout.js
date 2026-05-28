import "./globals.css";

export const metadata = {
  title: "TaskFlow | MERN Task Manager",
  description: "A secure MERN task management app with JWT authentication and CRUD operations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}