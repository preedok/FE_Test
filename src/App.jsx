import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Button, Text } from '@chakra-ui/react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { PageLoading } from '@/components/common/Loading';
import { ROUTES } from '@/utils/constants';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const LalinReport = lazy(() => import('@/pages/LalinReport'));
const MasterGerbang = lazy(() => import('@/pages/MasterGerbang'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          bg="gray.50"
          p={8}
        >
          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="lg"
            textAlign="center"
            maxW="500px"
          >
            <Text fontSize="xl" fontWeight="bold" color="red.500" mb={4}>
              Oops! Terjadi Kesalahan
            </Text>
            <Text color="gray.600" mb={6}>
              Aplikasi mengalami kesalahan yang tidak terduga.
              Silakan refresh halaman atau hubungi administrator.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
            >
              Refresh Halaman
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}


const LoadingFallback = ({ message = 'Memuat halaman...' }) => (
  <PageLoading message={message} />
);


function App() {
  return (
    <ErrorBoundary>
      <Box minH="100vh" bg="gray.50">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route
              path={ROUTES.LOGIN}
              element={<Login />}
            />

            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.LALIN_REPORT}
              element={
                <ProtectedRoute>
                  <LalinReport />
                </ProtectedRoute>
              }
            />

            <Route
              path={ROUTES.MASTER_GERBANG}
              element={
                <ProtectedRoute>
                  <MasterGerbang />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />

            <Route
              path="*"
              element={
                <Box
                  minH="100vh"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  bg="gray.50"
                  p={8}
                >
                  <Box
                    bg="white"
                    p={8}
                    borderRadius="lg"
                    shadow="lg"
                    textAlign="center"
                    maxW="500px"
                  >
                    <Text fontSize="6xl" fontWeight="bold" color="gray.300" mb={4}>
                      404
                    </Text>
                    <Text fontSize="xl" fontWeight="semibold" color="gray.700" mb={2}>
                      Halaman Tidak Ditemukan
                    </Text>
                    <Text color="gray.600" mb={6}>
                      Halaman yang Anda cari tidak dapat ditemukan.
                      Mungkin URL salah atau halaman telah dipindahkan.
                    </Text>
                    <Button
                      colorScheme="blue"
                      onClick={() => window.history.back()}
                      mr={3}
                    >
                      Kembali
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = ROUTES.DASHBOARD}
                    >
                      Ke Dashboard
                    </Button>
                  </Box>
                </Box>
              }
            />
          </Routes>
        </Suspense>
      </Box>
    </ErrorBoundary>
  );
}

export default App;