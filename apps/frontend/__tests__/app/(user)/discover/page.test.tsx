import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DiscoverPage from 'app/(user)/discover/page';

jest.mock('@/store/matchesStore', () => () => ({
  potentialMatches: [
    {
      id: '1',
      user: {
        name: 'Alice',
        photos: ['https://example.com/photo.jpg'],
      },
    },
  ],
  fetchPotentialMatches: jest.fn(),
  loading: false,
}));

jest.mock('@/components/user-layout', () => ({
  UserLayout: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/user-profile-card', () => ({
  UserProfileCard: ({ user, onMatch }: any) => (
    <div>
      <p>{user.user.name}</p>
      {onMatch && (
        <button onClick={() => onMatch(user)}>Match</button>
      )}
    </div>
  ),
}));

describe('DiscoverPage', () => {
  it('shows loader when loading is true', () => {
    jest.mock('@/store/matchesStore', () => () => ({
      potentialMatches: [],
      fetchPotentialMatches: jest.fn(),
      loading: true,
    }));

    const { container } = render(<DiscoverPage />);
    expect(container).toHaveTextContent('Finding people near you...');
  });

  it('renders potential matches and triggers match animation', async () => {
    render(<DiscoverPage />);

    expect(screen.getByText('Alice')).toBeInTheDocument();

    const matchButton = screen.getByRole('button', { name: /match/i });
    fireEvent.click(matchButton);

    await waitFor(() =>
      expect(screen.getByText('It\'s a Match!')).toBeInTheDocument(),
    );

    const keepSwiping = screen.getByText('Keep Swiping');
    fireEvent.click(keepSwiping);

    await waitFor(() =>
      expect(screen.queryByText('It\'s a Match!')).not.toBeInTheDocument(),
    );
  });
});
