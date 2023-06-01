module.exports = {
  __esModule: true,
  useLocation: jest.fn().mockReturnValue({
    pathname: "/",
  }),
  useSearchParams: jest.fn().mockReturnValue([new Map(), jest.fn()]),
  useNavigate: jest.fn(() => {
    return jest.fn();
  }),
  Link: ({
    children,
  }: {
    to: string;
    children: React.ReactNode;
    testId: string;
  }) => <div>{children}</div>,
};
