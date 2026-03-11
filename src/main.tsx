import '@/lib/errorReporter';
import { enableMapSet } from "immer";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { PortalPage } from '@/pages/PortalPage'
import { LessonsPage } from '@/pages/LessonsPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { UnitContentView } from '@/pages/UnitContentView'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { BlogPage } from '@/pages/BlogPage'
import { ContactPage } from '@/pages/ContactPage'
import { CertificatePage } from '@/pages/CertificatePage'
import { RootLayout } from '@/components/layout/RootLayout'
import { AppShell } from '@/components/layout/AppShell'
// Enable Immer Map/Set support
enableMapSet();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: (
          <RootLayout>
            <HomePage />
          </RootLayout>
        ),
      },
      {
        path: "/portal",
        element: (
          <RootLayout>
            <PortalPage />
          </RootLayout>
        ),
      },
      {
        path: "/dersler",
        element: <LessonsPage />,
      },
      {
        path: "/dersler/:categoryId/:courseId",
        element: <CourseDetailPage />,
      },
      {
        path: "/dersler/:categoryId/:courseId/:unitId",
        element: <UnitContentView />,
      },
      {
        path: "/kaynaklar",
        element: <ResourcesPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/iletisim",
        element: (
          <RootLayout>
            <ContactPage />
          </RootLayout>
        ),
      },
      {
        path: "/sertifikalar",
        element: (
          <RootLayout>
            <CertificatePage />
          </RootLayout>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)