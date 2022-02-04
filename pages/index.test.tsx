import { render, screen } from '@testing-library/react';
import Index from './index';

describe(Index.name, () => {
  it('should render a heading with text', async () => {
    // Arrange
    render(<Index />);

    // Act
    const heading = screen.getByTestId('page-header');

    // Assert
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual('Hello world!');
  });
});
