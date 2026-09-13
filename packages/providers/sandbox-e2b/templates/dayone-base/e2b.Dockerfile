# Base template for Dayone sandboxes: Node 22, git, OpenVSCode Server, Dayone runtime + extension.
# Build with: e2b template build --name dayone-base
FROM e2bdev/code-interpreter:latest

ARG OPENVSCODE_VERSION=1.95.0
RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs
RUN curl -fsSL -o /tmp/ovs.tar.gz https://github.com/gitpod-io/openvscode-server/releases/download/openvscode-server-v${OPENVSCODE_VERSION}/openvscode-server-v${OPENVSCODE_VERSION}-linux-x64.tar.gz \
 && mkdir -p /opt/openvscode && tar -xzf /tmp/ovs.tar.gz -C /opt/openvscode --strip-components=1 && rm /tmp/ovs.tar.gz

# Dayone runtime and trace extension are copied in at build time (CI packs them from this repo).
COPY runtime /opt/dayone/runtime
COPY dayone-trace.vsix /opt/dayone/dayone-trace.vsix
RUN mkdir -p /workspace && chmod -R a+rX /opt/dayone
