import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import AppProviders from '@configs/providers.config'
import router from '@routes/index.route'
import { Flex, Spinner, Text } from '@chakra-ui/react'

const LoadingFallback = () => (
    <Flex minH="100vh" alignItems="center" justifyContent="center" direction="column" gap="4">
        <Spinner size="xl" color="blue.500" />
        <Text color="slate.500" fontSize="sm">Loading...</Text>
    </Flex>
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppProviders>
            <Suspense fallback={<LoadingFallback />}>
                <RouterProvider router={router} />
            </Suspense>
        </AppProviders>
    </StrictMode>,
)
