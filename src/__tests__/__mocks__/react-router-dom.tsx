module.exports = {
  __esModule: true,
  useLocation: jest.fn().mockReturnValue({
    pathname: "/",
  }),
  useSearchParams: jest.fn().mockReturnValue([new Map(), jest.fn()]),
  Link: ({
    to,
    children,
    testId,
  }: {
    to: string;
    children: React.ReactNode;
    testId: string;
  }) => <div>{children}</div>,
};
