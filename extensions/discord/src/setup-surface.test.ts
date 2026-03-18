import { beforeEach, describe, expect, it, vi } from "vitest";

const resolveDiscordChannelAllowlistMock = vi.fn();

vi.mock("./resolve-channels.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./resolve-channels.js")>();
  return {
    ...actual,
    resolveDiscordChannelAllowlist: resolveDiscordChannelAllowlistMock,
  };
});

describe("discordSetupWizard group allowlist resolution", () => {
  beforeEach(() => {
    resolveDiscordChannelAllowlistMock.mockReset();
  });

  it("maps resolved channel entries to guildKey/channelKey", async () => {
    resolveDiscordChannelAllowlistMock.mockResolvedValue([
      {
        input: "My Server/#general",
        resolved: true,
        guildId: "guild-123",
        channelId: "channel-456",
      },
    ]);

    const { discordSetupWizard } = await import("./setup-surface.js");
    const resolved = await discordSetupWizard.groupAccess!.resolveAllowlist!({
      cfg: {},
      accountId: "default",
      credentialValues: { token: "token" },
      entries: ["My Server/#general"],
      prompter: { note: async () => {} },
    });

    expect(resolved).toEqual([
      expect.objectContaining({
        input: "My Server/#general",
        resolved: true,
        guildKey: "guild-123",
        channelKey: "channel-456",
      }),
    ]);
  });
});
