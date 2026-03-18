import { describe, expect, it } from "vitest";
import { setDiscordGuildChannelAllowlist } from "./setup-core.js";

describe("setDiscordGuildChannelAllowlist", () => {
  it("ignores entries without a guild key", () => {
    const next = setDiscordGuildChannelAllowlist({}, "default", [
      { guildKey: "", channelKey: "123" },
    ]);

    expect(next.channels?.discord?.guilds).toEqual({});
  });

  it("stores channel allowlist entries under the resolved guild key", () => {
    const next = setDiscordGuildChannelAllowlist({}, "default", [
      { guildKey: "guild-1", channelKey: "channel-1" },
    ]);

    expect(next.channels?.discord?.guilds).toEqual({
      "guild-1": {
        channels: {
          "channel-1": { allow: true },
        },
      },
    });
  });
});
