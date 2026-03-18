import type { OpenClawConfig } from "openclaw/plugin-sdk/setup";
import { describe, expect, it } from "vitest";
import { createDiscordSetupWizardBase, setDiscordGuildChannelAllowlist } from "./setup-core.js";

describe("setDiscordGuildChannelAllowlist", () => {
  it("ignores entries with missing guild keys instead of creating wildcard entries", () => {
    const next = setDiscordGuildChannelAllowlist({} as OpenClawConfig, "default", [
      { guildKey: "" },
      { guildKey: "   " },
    ]);

    expect(next.channels?.discord?.guilds).toEqual({});
  });
});

describe("createDiscordSetupWizardBase group allowlist apply", () => {
  it("maps resolved guildId/channelId entries to guildKey/channelKey entries", () => {
    const wizard = createDiscordSetupWizardBase({
      promptAllowFrom: async (cfg) => cfg,
      resolveAllowFromEntries: async () => [],
      resolveGroupAllowlist: async () => [],
    });

    const next = wizard.groupAccess?.applyAllowlist?.({
      cfg: {} as OpenClawConfig,
      accountId: "default",
      resolved: [{ input: "My Server/#general", resolved: true, guildId: "123", channelId: "456" }],
    });

    expect(next?.channels?.discord?.guilds).toEqual({
      "123": {
        channels: {
          "456": { allow: true },
        },
      },
    });
  });
});
