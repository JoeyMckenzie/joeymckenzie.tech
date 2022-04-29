import { render, screen } from '@testing-library/react';
import Index from '@/pages/index';

describe(Index.name, () => {
  it('should render a heading with text', () => {
    // Arrange
    render(<Index />);

    // Act
    const heading = screen.getByTestId('page-header');

    // Assert
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual('Hello world!');
  });
});
