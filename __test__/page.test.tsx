import { render, screen, fireEvent } from "@testing-library/react";
import { Member, MemberRole, Profile } from "@prisma/client";
import ChatHeader from "@/components/chat/chat-header";
import ChatItem from "@/components/chat/chat-item";
// jest.setup.ts
import "@testing-library/jest-dom";
//  Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Hash: (): JSX.Element => <svg data-testid="hash-icon" />,
}));

//  Mock MobileToggle component
jest.mock("../mobile-toggle", () => ({
  __esModule: true,
  default: ({ serverId }: { serverId: string }): JSX.Element => (
    <div data-testid="mobile-toggle">{serverId}</div>
  ),
}));

//  Mock SocketIndicator
jest.mock("../socket-indicator", () => ({
  SocketIndicator: (): JSX.Element => <div data-testid="socket-indicator" />,
}));

//  Mock SearchMessages
jest.mock("../searchbar", () => ({
  SearchMessages: (): JSX.Element => <div data-testid="search-messages" />,
}));

describe("ChatHeader Component", () => {
  const defaultProps = {
    name: "general",
    serverId: "server-123",
    type: "channel" as const,
  };

  it("renders the channel name", () => {
    render(<ChatHeader {...defaultProps} />);

    expect(screen.getByText("general")).toBeInTheDocument();
  });

  it("shows hash icon when type is channel", () => {
    render(<ChatHeader {...defaultProps} />);

    expect(screen.getByTestId("hash-icon")).toBeInTheDocument();
  });

  it("does not show hash icon when type is conversation", () => {
    render(<ChatHeader {...defaultProps} type="conversation" />);

    expect(screen.queryByTestId("hash-icon")).not.toBeInTheDocument();
  });
});

describe("chat item test", () => {
  const pushMock = jest.fn();

  jest.mock("next/navigation", () => ({
    useRouter: () => ({
      push: pushMock,
    }),
    useParams: () => ({
      serverId: "server-123",
    }),
  }));

  jest.mock("../user-avatar", () => ({
    __esModule: true,
    default: ({ src }: { src?: string }) => (
      <div data-testid="user-avatar">{src}</div>
    ),
  }));

  jest.mock("../action-tooltip", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));

  jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
  }));

  const onOpenMock = jest.fn();

  jest.mock("@/hooks/user-modal-store", () => ({
    useModal: () => ({
      onOpen: onOpenMock,
    }),
  }));
  jest.mock("@/store/sessionstore", () => ({
    useSessionStore: (fn: any) =>
      fn({
        email: "test@email.com",
      }),
  }));

  const chatItemProps = {
    id: "message-123",
    content: "Hello from Prisma-backed chat 👋",
    timestamp: "2025-01-20 10:30 AM",
    fileUrl: null,
    deleted: false,
    isUpdate: false,
    socketUrl: "/api/socket/messages",
    socketQuery: {
      serverId: "server-123",
      channelId: "channel-456",
    },
    fromSearchMessages: false,

    member: {
      id: "member-1",
      role: MemberRole.MODERATOR,
      profileId: "profile-1",
      serverId: "server-123",
      createdAt: new Date(),
      updatedAt: new Date(),

      profile: {
        id: "profile-1",
        userId: "user-1",
        name: "John Doe",
        password: "hashed-password",
        imageUrl: "https://example.com/avatar.png",
        email: "john@example.com",
        otp: "123456",
        isVerified: true,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
        salt: "",
      },
    },

    currentMember: {
      id: "member-2",
      role: MemberRole.ADMIN,
      profileId: "profile-2",
      serverId: "server-123",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };
  const currentMember = {
    id: "member-2",
    role: MemberRole.ADMIN,
    profileId: "profile-2",
    serverId: "server-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  it("renders chat content and avatar", () => {
    render(<ChatItem {...chatItemProps} />);

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByTestId("user-avatar")).toHaveTextContent("avatar.png");
  });

  it("navigates when avatar is clicked", () => {
    render(<ChatItem {...chatItemProps} />);

    fireEvent.click(screen.getByTestId("user-avatar"));

    expect(pushMock).toHaveBeenCalledWith(
      "/servers/server-123/conversation/member-1"
    );
  });
  it("shows edited label when isUpdate is true", () => {
    render(<ChatItem {...chatItemProps} isUpdate />);

    expect(screen.getByText("(edited)")).toBeInTheDocument();
  });
  it("does not navigate when clicking own avatar", () => {
    render(
      <ChatItem
        {...chatItemProps}
        currentMember={currentMember}
      />
    );

    fireEvent.click(screen.getByTestId("user-avatar"));
    expect(pushMock).not.toHaveBeenCalled();
  });
});
