import { render as originalRender } from '@testing-library/react';
import {
  AppRouterContext,
  AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { useSession, SessionProvider } from 'next-auth/react';

jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(),
    SessionProvider: originalModule.SessionProvider,
  };
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

type Router = ReturnType<typeof useRouter>;
const mockedUseRouter = jest.mocked(useRouter);
const mockedUseSession = jest.mocked(useSession);

export const createMockRouter = (
  props: Partial<Router> = {}
): AppRouterInstance => ({
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  ...props,
});

interface RenderOptions {
  router?: Partial<Router>;
  session?: Session | null;
}

export function render(ui: React.ReactElement, options: RenderOptions = {}) {
  const router = createMockRouter(options.router);
  mockedUseRouter.mockReturnValue(router);

  if (options.session) {
    mockedUseSession.mockReturnValue({
      data: options.session,
      status: 'authenticated' as const,
      update: jest.fn(),
    });
  } else {
    mockedUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated' as const,
      update: jest.fn(),
    });
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider session={options.session}>
      <AppRouterContext.Provider value={router}>
        {children}
      </AppRouterContext.Provider>
    </SessionProvider>
  );

  return {
    router,
    ...originalRender(ui, { wrapper: Wrapper }),
  };
}
