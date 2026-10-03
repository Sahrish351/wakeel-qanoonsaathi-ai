// =============================================================
// WAKEEL — Application Router
// All routes are lazy-loaded for code splitting.
// Auth and role guards protect every sensitive route.
// =============================================================

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingState } from '@/components/states/LoadingState';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// ─── LAZY-LOADED PAGES ────────────────────────────────────────

// Public pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const HowItWorksPage = lazy(() => import('@/pages/public/HowItWorksPage'));
const SafetyCenterPublicPage = lazy(() => import('@/pages/public/SafetyCenterPage'));
const LawyerDirectoryPublicPage = lazy(() => import('@/pages/public/LawyerDirectoryPublicPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/public/TermsPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const OnboardingPage = lazy(() => import('@/pages/auth/OnboardingPage'));

// Citizen pages
const DashboardPage = lazy(() => import('@/pages/citizen/DashboardPage'));
const AIPage = lazy(() => import('@/pages/citizen/AIPage'));
const CasesPage = lazy(() => import('@/pages/citizen/CasesPage'));
const NewCasePage = lazy(() => import('@/pages/citizen/NewCasePage'));
const CaseDetailPage = lazy(() => import('@/pages/citizen/CaseDetailPage'));
const CaseTimelinePage = lazy(() => import('@/pages/citizen/CaseTimelinePage'));
const EvidenceVaultPage = lazy(() => import('@/pages/citizen/EvidenceVaultPage'));
const DocumentAnalyzerPage = lazy(() => import('@/pages/citizen/DocumentAnalyzerPage'));
const ActionPlanPage = lazy(() => import('@/pages/citizen/ActionPlanPage'));
const TasksPage = lazy(() => import('@/pages/citizen/TasksPage'));
const LawyerMatchPage = lazy(() => import('@/pages/citizen/LawyerMatchPage'));
const LawyerProfilePage = lazy(() => import('@/pages/citizen/LawyerProfilePage'));
const ConsultationsPage = lazy(() => import('@/pages/citizen/ConsultationsPage'));
const ResourcesPage = lazy(() => import('@/pages/citizen/ResourcesPage'));
const ProfilePage = lazy(() => import('@/pages/citizen/ProfilePage'));
const PrivacySettingsPage = lazy(() => import('@/pages/citizen/PrivacySettingsPage'));

// Lawyer pages
const LawyerDashboardPage = lazy(() => import('@/pages/lawyer/LawyerDashboardPage'));
const LawyerProfileEditPage = lazy(() => import('@/pages/lawyer/LawyerProfileEditPage'));
const LawyerConsultationsPage = lazy(() => import('@/pages/lawyer/LawyerConsultationsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminSourcesPage = lazy(() => import('@/pages/admin/AdminSourcesPage'));
const AdminLawyersPage = lazy(() => import('@/pages/admin/AdminLawyersPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminAuditPage = lazy(() => import('@/pages/admin/AdminAuditPage'));

// Layouts & Guards
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { LawyerLayout } from '@/components/layout/LawyerLayout';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { RoleGuard } from '@/features/auth/RoleGuard';

// ─── SUSPENSE WRAPPER ─────────────────────────────────────────
function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingState message="Loading page..." />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// ─── ROUTER ──────────────────────────────────────────────────
export const router = createBrowserRouter([
  // ── PUBLIC ────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <PageSuspense><LandingPage /></PageSuspense> },
      { path: '/how-it-works', element: <PageSuspense><HowItWorksPage /></PageSuspense> },
      { path: '/safety', element: <PageSuspense><SafetyCenterPublicPage /></PageSuspense> },
      { path: '/find-a-lawyer', element: <PageSuspense><LawyerDirectoryPublicPage /></PageSuspense> },
      { path: '/about', element: <PageSuspense><AboutPage /></PageSuspense> },
      { path: '/privacy', element: <PageSuspense><PrivacyPage /></PageSuspense> },
      { path: '/terms', element: <PageSuspense><TermsPage /></PageSuspense> },
    ],
  },

  // ── AUTH (no layout wrapper needed) ──────────────────────
  { path: '/login', element: <PageSuspense><LoginPage /></PageSuspense> },
  { path: '/register', element: <PageSuspense><RegisterPage /></PageSuspense> },
  { path: '/forgot-password', element: <PageSuspense><ForgotPasswordPage /></PageSuspense> },
  { path: '/reset-password', element: <PageSuspense><ResetPasswordPage /></PageSuspense> },
  { path: '/verify-email', element: <PageSuspense><VerifyEmailPage /></PageSuspense> },
  {
    path: '/onboarding',
    element: (
      <AuthGuard>
        <PageSuspense><OnboardingPage /></PageSuspense>
      </AuthGuard>
    ),
  },

  // ── CITIZEN (authenticated) ───────────────────────────────
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['citizen']}>
          <AppLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: '/dashboard', element: <PageSuspense><DashboardPage /></PageSuspense> },
      { path: '/ai', element: <PageSuspense><AIPage /></PageSuspense> },
      { path: '/cases', element: <PageSuspense><CasesPage /></PageSuspense> },
      { path: '/cases/new', element: <PageSuspense><NewCasePage /></PageSuspense> },
      { path: '/cases/:id', element: <PageSuspense><CaseDetailPage /></PageSuspense> },
      { path: '/cases/:id/timeline', element: <PageSuspense><CaseTimelinePage /></PageSuspense> },
      { path: '/cases/:id/evidence', element: <PageSuspense><EvidenceVaultPage /></PageSuspense> },
      { path: '/cases/:id/documents', element: <PageSuspense><DocumentAnalyzerPage /></PageSuspense> },
      { path: '/cases/:id/action-plan', element: <PageSuspense><ActionPlanPage /></PageSuspense> },
      { path: '/tasks', element: <PageSuspense><TasksPage /></PageSuspense> },
      { path: '/lawyers', element: <PageSuspense><LawyerMatchPage /></PageSuspense> },
      { path: '/lawyers/:id', element: <PageSuspense><LawyerProfilePage /></PageSuspense> },
      { path: '/consultations', element: <PageSuspense><ConsultationsPage /></PageSuspense> },
      { path: '/resources', element: <PageSuspense><ResourcesPage /></PageSuspense> },
      { path: '/profile', element: <PageSuspense><ProfilePage /></PageSuspense> },
      { path: '/profile/privacy', element: <PageSuspense><PrivacySettingsPage /></PageSuspense> },
    ],
  },

  // ── LAWYER ────────────────────────────────────────────────
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['lawyer']}>
          <LawyerLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: '/lawyer/dashboard', element: <PageSuspense><LawyerDashboardPage /></PageSuspense> },
      { path: '/lawyer/profile', element: <PageSuspense><LawyerProfileEditPage /></PageSuspense> },
      { path: '/lawyer/consultations', element: <PageSuspense><LawyerConsultationsPage /></PageSuspense> },
    ],
  },

  // ── ADMIN ─────────────────────────────────────────────────
  {
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { path: '/admin', element: <Navigate to="/admin/dashboard" replace /> },
      { path: '/admin/dashboard', element: <PageSuspense><AdminDashboardPage /></PageSuspense> },
      { path: '/admin/sources', element: <PageSuspense><AdminSourcesPage /></PageSuspense> },
      { path: '/admin/lawyers', element: <PageSuspense><AdminLawyersPage /></PageSuspense> },
      { path: '/admin/users', element: <PageSuspense><AdminUsersPage /></PageSuspense> },
      { path: '/admin/audit', element: <PageSuspense><AdminAuditPage /></PageSuspense> },
    ],
  },

  // ── ROLE REDIRECT ────────────────────────────────────────
  // After login, direct users to their role's home
  {
    path: '/app',
    element: <AuthGuard><RoleRedirect /></AuthGuard>,
  },

  // ── 404 ──────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
]);

function RoleRedirect() {
  const { role } = useRole();
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'lawyer') return <Navigate to="/lawyer/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
}

// Import inside component to avoid circular deps
import { useAuth } from '@/contexts/AuthContext';
function useRole() {
  const { role } = useAuth();
  return { role };
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}

