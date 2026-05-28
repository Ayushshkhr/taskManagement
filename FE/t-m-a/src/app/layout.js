import "./globals.css";

export const metadata = {
  title: "TaskFlow - Task Manager",
  description: "MERN task management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}