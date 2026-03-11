import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
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
import { RootLayout } from '@/components/layout/RootLayout'
const queryClient = new QueryClient();
const router = createBrowserRouter([
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
    path: "/dersler/:gradeId/:courseId",
    element: <CourseDetailPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dersler/:gradeId/:courseId/:unitId",
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