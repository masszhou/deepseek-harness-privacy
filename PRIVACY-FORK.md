# Privacy fork

This fork of DeepSeek Harness never sends conversation content anywhere except the model provider request that the conversation itself requires. It differs from upstream only in bundle configuration: nine `disabled: true` lines in three `cordis.patch.yml` files, each marked `# privacy fork`. No package under `packages/` changes its source.

## What upstream sends

| # | Path | Trigger | Content | Destination | Upstream default |
|---|---|---|---|---|---|
| A | `session-log-deepseek` | Every request to the official DeepSeek API | The complete canonical Session log, incrementally, as the `dsh_session_log` request field | Official DeepSeek API | On; Web switch in Settings → General |
| B | `session-telemetry-otel` | Like, Dislike, the feedback dialog, or `/feedback` | The complete Session log up to the feedback event, with the anonymous user id, for every model provider | `dsh-otel-collector.deepseeksvc.com` | On (`FEEDBACK_ONLY`); `DSH_TELEMETRY_DISABLED` or `DSH_TELEMETRY_MODE=DISABLED` opts out |
| C | `plugin-package-inventory-deepseek` | Every request to the official DeepSeek API | Names and versions of active plugin packages, as `dsh_plugin_packages` | Official DeepSeek API | On; no switch |
| D | `product-analytics` with `desktop-product-telemetry` | Desktop UI clicks | Event names, Session ids, model names, OS and CPU facts, device and account ids; no message content | `dsh-otel-collector.deepseeksvc.com` | On in the Desktop profile; the row is disabled in every other profile, including Web |
| E | `llm-deepseek` identity headers | Requests through the DeepSeek providers `llm-deepseek-api-key` and `llm-deepseek-account`; other providers such as OpenAI and Anthropic send neither header | Random UUID from `$DSH_HOME/.anonymous-user-id` as `x-deepseek-harness-user-id`, and the Session id as `x-deepseek-harness-session-id` | The configured DeepSeek endpoint | On; no switch |

## What this fork changes

| Row | Bundle | Effect |
|---|---|---|
| `session-telemetry-otel` | base | B closed: the uploader never loads, so no feedback event can release a Session log, and `DSH_TELEMETRY_MODE` cannot turn it back on |
| `command-feedback` | base | The `/feedback` command and the `sessionFeedback` Remote are absent |
| `message-feedback` | web-app | The per-message rating service is absent |
| `ui-message-feedback` | web-app | Like and Dislike buttons and the feedback dialog are absent from the Web UI |
| `session-log-deepseek` | base, sdk-minimal | A closed: official DeepSeek API requests carry no `dsh_session_log` |
| `ui-settings-session-log` | web-app | The Settings → General upload switch is absent, so A cannot be re-enabled from the UI |
| `plugin-package-inventory-deepseek` | base, sdk-minimal | C closed: requests carry no `dsh_plugin_packages` |

D and E stay as upstream. D runs only in the Desktop profile. E carries no conversation content and lives inside the provider adapter, so removing it would change provider source code.

Re-enabling any path requires a deliberate patch that sets `disabled: false` on the row, in `$DSH_HOME` or through `--patch`. No Settings control does it.

## Verify

```sh
pnpm dsh web --dump-config | grep -B2 'disabled: true'
pnpm exec vitest run packages/bundle/base packages/bundle/sdk-minimal packages/bundle/web-app/tests/privacy-fork.spec.ts
```

The dump lists the seven Web rows above as disabled. The three bundle tests fail when a row loses its `disabled: true`.

## After merging upstream

1. Resolve conflicts in the three `cordis.patch.yml` files by keeping every `# privacy fork` line, then run the two commands above.
2. Search for new outbound paths: new `ctx.deepseekLlmApiExtensions.register(` callers, new `ctx.otel.create` callers, new rows in the bundle patches whose names contain `telemetry`, `analytics`, `feedback`, `upload`, or `share`, and new hardcoded hosts under `packages/**/src`.
3. Disable any new row that sends Session content, and add its id to this page and to the bundle test of its bundle.

## Releases

This fork runs from a source checkout only; it publishes no npm package, and `@deepseek-ai/dsh` on npm is the upstream build. A fork release is an annotated tag on `master` named `<upstream tag>-privacy.<n>`, for example `dsh-v0.2.3-alpha.2-privacy.1`. Upstream tags are never moved.

For a new upstream release, merge the upstream tag, not upstream `master`, into this fork's `master`, complete the steps under [After merging upstream](#after-merging-upstream), update the tag named in the README, and tag the result. Increase `<n>` for a later fork change on the same upstream release.

## Tests that cover upstream features

The recorded-session expected outputs under `snapshots/sdk/` and the Web suite under `apps/web/tests/` cover the upstream feedback and Session-log features. They re-enable the disabled rows for the test process only: `snapshots/sdk/recorded-uploads.patch.yml` and `recorded-feedback.patch.yml` for SDK replay, and the overlay list in `apps/web/tests/scaffold.ts` for the Web suite. These runs talk to a local replay provider or a local collector, never to a production endpoint. The three bundle tests under [Verify](#verify) are the checks of the shipped defaults.

Upstream package READMEs and `docs/` pages describe the upstream defaults and are unchanged; this page is the authority for what this fork loads.
