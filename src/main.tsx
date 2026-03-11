import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
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
import { RootLayout } from '@/components/layout/RootLayout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
const queryClient = new QueryClient();
// Shell component to wrap routes with global logic like ScrollToTop
function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}
const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: (
          <RootLayout>
            <HomePage />
          </RootLayout>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/portal",
        element: (
          <RootLayout>
            <PortalPage />
          </RootLayout>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dersler",
        element: <LessonsPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dersler/:categoryId/:courseId",
        element: <CourseDetailPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/dersler/:categoryId/:courseId/:unitId",
        element: <UnitContentView />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/kaynaklar",
        element: <ResourcesPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "/iletisim",
        element: (
          <RootLayout>
            <ContactPage />
          </RootLayout>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)