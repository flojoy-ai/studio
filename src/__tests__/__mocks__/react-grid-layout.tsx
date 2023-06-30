const reactGrid = {
  __esModule: true,
  default: jest.fn(() => <div></div>),
  WidthProvider: jest.fn((props) => props),
  Responsive: jest.fn(({ children }) => (
    <div data-testid="react-grid">{children}</div>
  )),
};

module.exports = reactGrid;
