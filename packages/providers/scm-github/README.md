# @dayone/scm-github

`ScmProvider` that fetches a problem repository as a tarball at a pinned ref via the GitHub API. Private repos use `GITHUB_TOKEN`. The orchestrator strips `.dayone/hidden` when extracting into the sandbox.
