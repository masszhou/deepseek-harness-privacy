---
kind: upgrade-guide
description: "The shipped profiles disable feedback capture and Session-log upload: `/feedback`, the `sessionFeedback` and `messageFeedback` Remotes, the Like and Dislike buttons, and the official-API `dsh_session_log` and `dsh_plugin_packages` request fields are absent."
---
# Shipped profiles disable feedback capture and Session-log upload

English | [中文](guide.zh.md)

## Change

The `dsh-base`, `dsh-web-app`, and `dsh-sdk-minimal` bundles set `disabled: true` on the rows below. The previous release loaded all of them. [PRIVACY-FORK.md](../../../../PRIVACY-FORK.md) lists what each row sent.

| Row | Bundle | What is absent |
|---|---|---|
| `session-telemetry-otel` | base | Session-log upload after feedback; `DSH_TELEMETRY_MODE`, `DSH_TELEMETRY_OTLP_URL`, and `DSH_TELEMETRY_DISABLED` have no effect |
| `command-feedback` | base | The `/feedback` command and the `sessionFeedback` Remote |
| `message-feedback` | web-app | The `messageFeedback` Remote |
| `ui-message-feedback` | web-app | Like and Dislike buttons and the feedback dialog |
| `session-log-deepseek` | base, sdk-minimal | The `dsh_session_log` request field and new `session-log-deepseek/delivery-accepted` events |
| `ui-settings-session-log` | web-app | The Settings → General upload switch |
| `plugin-package-inventory-deepseek` | base, sdk-minimal | The `dsh_plugin_packages` request field |

This affects Web users, SDK and JSON-RPC clients that call the two Remotes, and deployments that read uploaded Session logs. Existing Session logs keep their recorded feedback and acceptance events.

## Migration

1. Remove calls to `sessionFeedback.record` and the `messageFeedback` methods from clients, or handle their absence.
2. A patch or overlay that sets `config` on one of these rows still applies and still leaves the row disabled. To load a row again, add a patch entry to `$DSH_HOME` or pass it with `--patch`:

   ```yaml
   - id: command-feedback
     disabled: false
   ```

3. Run `dsh web --dump-config` and confirm each row shows the `disabled` value you intend.
