---
kind: upgrade-guide
description: "出厂 profile 禁用反馈采集与 Session log 上传：`/feedback`、`sessionFeedback` 与 `messageFeedback` Remote、Like 和 Dislike 按钮，以及官方 API 的 `dsh_session_log` 和 `dsh_plugin_packages` 请求字段均不存在。"
---
# 出厂 profile 禁用反馈采集与 Session log 上传

[English](guide.md) | 中文

## 变更

`dsh-base`、`dsh-web-app` 和 `dsh-sdk-minimal` bundle 对下列行设置了 `disabled: true`。上一版本会加载全部这些行。[PRIVACY-FORK.md](../../../../PRIVACY-FORK.md) 列出了每一行发送的内容。

| 行 | Bundle | 不再存在的内容 |
|---|---|---|
| `session-telemetry-otel` | base | 反馈后的 Session log 上传；`DSH_TELEMETRY_MODE`、`DSH_TELEMETRY_OTLP_URL` 和 `DSH_TELEMETRY_DISABLED` 不起作用 |
| `command-feedback` | base | `/feedback` 命令和 `sessionFeedback` Remote |
| `message-feedback` | web-app | `messageFeedback` Remote |
| `ui-message-feedback` | web-app | Like 和 Dislike 按钮以及反馈对话框 |
| `session-log-deepseek` | base、sdk-minimal | `dsh_session_log` 请求字段和新的 `session-log-deepseek/delivery-accepted` 事件 |
| `ui-settings-session-log` | web-app | Settings → General 中的上传开关 |
| `plugin-package-inventory-deepseek` | base、sdk-minimal | `dsh_plugin_packages` 请求字段 |

此变更影响 Web 用户、调用这两个 Remote 的 SDK 与 JSON-RPC 客户端，以及读取已上传 Session log 的部署。已有的 Session log 保留其中记录的反馈事件和接受事件。

## 迁移

1. 从客户端移除对 `sessionFeedback.record` 和 `messageFeedback` 各方法的调用，或处理它们不存在的情况。
2. 对这些行设置 `config` 的 patch 或 overlay 仍然生效，但该行仍保持禁用。要重新加载某一行，请在 `$DSH_HOME` 中添加 patch 条目，或通过 `--patch` 传入：

   ```yaml
   - id: command-feedback
     disabled: false
   ```

3. 运行 `dsh web --dump-config`，确认每一行的 `disabled` 值符合预期。
