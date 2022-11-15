import { Button, Result } from 'antd';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { queryClient } from '~/lib/react-query';
import { AuthProvider } from './AuthProvider';

const ErrorFallback = () => {
    const navigate = useNavigate();
    return (
        <div className="text-red-500 w-screen h-screen flex flex-col justify-center items-center" role="alert">
            <Result
                style={{
                    display: 'flex',
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                extra={
                    <Button
                        onClick={() => {
                            navigate('/')
                        }}
                        type="primary"
                    >
                        Back Home
                    </Button>
                }
            />
        </div>
    );
};

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <React.Suspense
            fallback={
                <div className="h-screen w-screen flex items-center justify-center">{/*<Spinner size="xl"/>*/}</div>
            }
        >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Router>{children}</Router>
                    </AuthProvider>
                    {/* {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />} */}
                </QueryClientProvider>
            </ErrorBoundary>
        </React.Suspense>
    );
};
