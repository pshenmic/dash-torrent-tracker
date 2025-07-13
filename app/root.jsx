import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import stylesheet from "./app.css?url";
import { useEffect, useState } from 'react'
import TorrentTrackerHeader from './components/TorrentTrackerHeader.jsx'
import { WalletInfo } from './models/WalletInfo.js'

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [walletInfo, setWalletInfo] = useState(new WalletInfo(false, null, null))
  const [extensionInstalled, setExtensionInstalled] = useState(false)

  useEffect(() => {
    if (window.dashPlatformExtension) {
      console.log('Dash Platform Extension detected')
      return setExtensionInstalled(true)
    }

    console.log('Dash Platform Extension not installed')
    setExtensionInstalled(false)
  }, [])

  return <div>
    <TorrentTrackerHeader walletInfo={walletInfo} setWalletInfo={setWalletInfo} extensionInstalled={extensionInstalled} />
    <Outlet context={{walletInfo, setWalletInfo}}/>
  </div>;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">{message}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{details}</p>
          {stack && (
            <pre className="mt-8 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-left text-sm text-gray-700 dark:text-gray-300">
              <code>{stack}</code>
            </pre>
          )}
        </div>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Go back home
        </a>
      </div>
    </main>
  );
}
