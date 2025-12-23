import { render, screen } from '@testing-library/react'
import ChatHeader from '@/components/chat/chat-header'
// jest.setup.ts
import '@testing-library/jest-dom'
//  Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Hash: (): JSX.Element => <svg data-testid="hash-icon" />,
}))

//  Mock MobileToggle component
jest.mock('../mobile-toggle', () => ({
  __esModule: true,
  default: ({ serverId }: { serverId: string }): JSX.Element => (
    <div data-testid="mobile-toggle">{serverId}</div>
  ),
}))

//  Mock SocketIndicator
jest.mock('../socket-indicator', () => ({
  SocketIndicator: (): JSX.Element => (
    <div data-testid="socket-indicator" />
  ),
}))

//  Mock SearchMessages
jest.mock('../searchbar', () => ({
  SearchMessages: (): JSX.Element => (
    <div data-testid="search-messages" />
  ),
}))

describe('ChatHeader Component', () => {
  const defaultProps = {
    name: 'general',
    serverId: 'server-123',
    type: 'channel' as const,
  }

  it('renders the channel name', () => {
    render(<ChatHeader {...defaultProps} />)

    expect(screen.getByText('general')).toBeInTheDocument()
  })

  it('shows hash icon when type is channel', () => {
    render(<ChatHeader {...defaultProps} />)

    expect(screen.getByTestId('hash-icon')).toBeInTheDocument()
  })

  it('does not show hash icon when type is conversation', () => {
    render(
      <ChatHeader
        {...defaultProps}
        type="conversation"
      />
    )

    expect(
      screen.queryByTestId('hash-icon')
    ).not.toBeInTheDocument();
  })
})

describe('chat item test', () => {

});
