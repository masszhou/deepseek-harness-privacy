# DeepSeek Harness

[English](README.md) | 中文

DeepSeek Harness（`dsh`）是由 [DeepSeek AI](https://deepseek.com) 开发的开源 agent harness（智能体框架）。

它构建于**一切皆插件**的架构之上，由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512)。

文档：[https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## 隐私分支

本仓库是 DeepSeek Harness 的隐私分支。它与上游的差异仅在 bundle 配置：九行 `disabled: true`，`packages/` 下没有源码改动。完整清单、验证命令和合并上游后的检查步骤见 [PRIVACY-FORK.md](PRIVACY-FORK.md)。

- **反馈后不上传对话。** 上游在用户点击 Like、Dislike 或发送 `/feedback` 时，会把完整 Session log 上传到 DeepSeek 的收集端，且与模型 provider 无关。本分支不加载这个上传器。
- **没有反馈入口。** Web UI 中没有 Like 和 Dislike 按钮、反馈对话框以及 `/feedback` 命令。
- **官方 API 请求不携带 Session log。** 发往官方 DeepSeek API 的请求既不携带 Session log，也不携带 plugin 包清单；设置页中也没有可以打开上传的开关。
- **保持不变。** Desktop 产品埋点（不含消息内容）以及 DeepSeek provider 请求中的匿名 id 请求头与上游一致。

## 开发者预览

DeepSeek Harness 处于 _开发者预览_ 阶段，正在快速迭代。**未来将出现破坏兼容性的变更。**

运行本项目前，请阅读[安全说明](SAFETY.zh.md)。

<a id="run"></a>

## 运行

本分支只能从源码检出运行。npm 上的 `@deepseek-ai/dsh` 包是上游构建，不包含隐私改动，因此 `npx @deepseek-ai/dsh` 不是运行本分支的方式。

<a id="run-from-source"></a>

### 从源码运行

安装 24.x 系列中的 Node.js 24.22.3 或更高版本以及 `pnpm`，然后检出本分支的发布 tag。每个 tag 以其所基于的上游版本命名，并带有 `-privacy.<n>` 后缀：

```sh
git clone https://github.com/masszhou/deepseek-harness-privacy.git
cd deepseek-harness-privacy
git checkout dsh-v0.2.3-alpha.2-privacy.1
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 会准备仓库产物。`pnpm dsh web` 会直接使用这些已构建产物，不会重新构建。

该命令默认会在 `http://127.0.0.1:3080` 启动 Web UI，本机启动时还会用默认浏览器打开页面。通过 SSH 启动时只打印宿主机 URL，因为本地转发地址由 SSH 客户端或编辑器持有。传入 `--no-open` 可仅运行服务器而不打开浏览器。详见 [Web UI 指南](docs/user/guide/index.zh.md)。

## 社区与支持

- 通过 [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions) 提交反馈或 bug 报告。
- 为你的插件仓库添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题，便于被发现。
- 欢迎加入 DeepSeek Harness 企微群！扫描下方二维码填写入群问卷，小助手会定期发送入群邀请。

<table>
  <thead>
    <tr>
      <th align="center">入群问卷</th>
      <th align="center">微信公众号</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><a href="https://trtgsjkv6r.feishu.cn/share/base/form/shrcnIt5twSVdLGD52KJBckGCgg"><img src="https://cdn.deepseek.com/harness/readme/community-wecom-survey.png" alt="DeepSeek Harness 入群问卷二维码" width="180" height="180"></a></td>
      <td align="center"><img src="https://cdn.deepseek.com/harness/readme/community-wechat-official-account.png" alt="DeepSeek Harness 团队微信公众号二维码" width="180" height="180"></td>
    </tr>
  </tbody>
</table>

## 参与贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.zh.md)。

## 开发

请先阅读[开发指南](docs/development.zh.md)与[架构文档](docs/architecture.zh.md)。

`pnpm run dev:web` 会在一个终端里完成构建、启动，并在源码修改时重建 client bundle；`make help` 列出 Web 与 Desktop 对应的 Make target。完整表格见开发指南的「应用命令」一节。

面向 agent：请遵循 [AGENTS.md](AGENTS.md)。

## 引用

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## 许可证

[MIT](LICENSE)

第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
