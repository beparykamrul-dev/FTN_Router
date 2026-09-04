export interface EcosystemTech {
  id: string;
  name: string;
  category: 
    | 'core-kernel'
    | 'overlay-sdn'
    | 'telemetry-monitoring'
    | 'dns-pki'
    | 'hosting-proxy-db'
    | 'remote-automation-ai'
    | 'web3-gaming-peering'
    | 'oly7-tunnels';
  categoryLabel: string;
  badge: string;
  layer: string;
  shortDesc: string;
  technicalDetails: string;
  repoOrDocUrl?: string;
  rfcOrSpec?: string;
  configSnippet?: string;
  commandSnippet?: string;
  status: 'ACTIVE' | 'RUNNING' | 'HARDENED' | 'MONITORED' | 'STANDBY';
  statusColor: string;
  tags: string[];
}

export const ECOSYSTEM_CATEGORIES = [
  { id: 'all', label: 'All Technologies', count: 0 },
  { id: 'core-kernel', label: 'Core Router & Low-Level Kernel', count: 0 },
  { id: 'overlay-sdn', label: 'Overlay, SDN & Security Hardening', count: 0 },
  { id: 'telemetry-monitoring', label: 'Telemetry, Analytics & Monitoring (SiLK/YAF)', count: 0 },
  { id: 'dns-pki', label: 'DNS, Domain & SSL/PKI Security', count: 0 },
  { id: 'hosting-proxy-db', label: 'Hosting, Proxy & Database Pooling', count: 0 },
  { id: 'remote-automation-ai', label: 'Remote Access, Automation & AI Vision', count: 0 },
  { id: 'web3-gaming-peering', label: 'Web3, Gaming & Peering', count: 0 },
  { id: 'oly7-tunnels', label: 'Oly-7 Multi-Protocol Tunnel Encryption', count: 0 }
];

export const ECOSYSTEM_TECHNOLOGIES: EcosystemTech[] = [
  // 1. Core Router & Low-Level Kernel
  {
    id: 'linux-kernel-modules',
    name: 'Linux Kernel Modules (LKM)',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'LKM / KERNEL',
    layer: 'Ring 0 Kernel',
    shortDesc: 'Dynamic in-kernel network driver extensions and fast packet hook modules.',
    technicalDetails: 'Loadable modules compiled against linux-headers for dynamic packet filtering, hardware acceleration drivers, and real-time network stack hooking.',
    rfcOrSpec: 'Linux kmod / insmod API',
    configSnippet: `# /etc/modules-load.d/ftn-networking.conf
bonding
8021q
vxlan
ip_gre
fou
sch_fq
tcp_bbr`,
    commandSnippet: `modprobe -v vxlan && lsmod | grep -E 'vxlan|ip_gre|fou'`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Kernel', 'LKM', 'Driver', 'Fast Path']
  },
  {
    id: 'sock-raw',
    name: 'SOCK_RAW Socket Access',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'SOCK_RAW',
    layer: 'L2 / L3 Raw Socket',
    shortDesc: 'Direct packet header injection and protocol crafting bypassing OS TCP/IP stack.',
    technicalDetails: 'Utilized by FTN low-level diagnostics and custom packet synthesizers. Grants user-space software root capability to emit raw IP/Ethernet frames.',
    rfcOrSpec: 'POSIX.1g / socket(AF_INET, SOCK_RAW, IPPROTO_RAW)',
    configSnippet: `// C/Go raw socket instantiation
fd, err := syscall.Socket(syscall.AF_INET, syscall.SOCK_RAW, syscall.IPPROTO_RAW)
if err != nil { log.Fatalf("Failed to bind raw socket: %v", err) }
syscall.SetsockoptInt(fd, syscall.IPPROTO_IP, syscall.IP_HDRINCL, 1)`,
    commandSnippet: `setcap cap_net_raw,cap_net_admin+ep /usr/local/bin/ftn-raw-probe`,
    status: 'RUNNING',
    statusColor: 'emerald',
    tags: ['Raw Socket', 'Packet Crafting', 'Low-Level', 'Kernel Bypass']
  },
  {
    id: 'can-raw',
    name: 'CAN_RAW & can_filter',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'SocketCAN',
    layer: 'Controller Area Network',
    shortDesc: 'Linux SocketCAN kernel bus subsystem and mask-based frame filtering.',
    technicalDetails: 'Facilitates integration with out-of-band IoT chassis sensors, datacenter power distribution units (PDUs), and telemetry buses using struct can_filter.',
    rfcOrSpec: 'SocketCAN / Linux drivers/net/can',
    configSnippet: `struct can_filter rfilter[2];
rfilter[0].can_id   = 0x123;
rfilter[0].can_mask = CAN_SFF_MASK;
rfilter[1].can_id   = 0x200;
rfilter[1].can_mask = 0x700;
setsockopt(s, SOL_CAN_RAW, CAN_RAW_FILTER, &rfilter, sizeof(rfilter));`,
    commandSnippet: `ip link set can0 type can bitrate 500000 && ip link set up can0`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['CAN_RAW', 'SocketCAN', 'Telemetry Bus', 'Hardware']
  },
  {
    id: 'dmbs335-the-map',
    name: 'dmbs335/the-map (WAF Bypass & Discrepancies)',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'SECURITY RESEARCH',
    layer: 'L7 / Protocol Parser',
    shortDesc: 'Protocol-level WAF bypass research and parser discrepancy defense engine.',
    technicalDetails: 'Audits and harmonizes parsing differential discrepancies between edge proxy (Nginx/HAProxy) and upstream backends (Node/Python/Go) to prevent HTTP desync, smuggling, and filter evasion.',
    repoOrDocUrl: 'https://github.com/dmbs335/the-map',
    rfcOrSpec: 'HTTP/1.1 RFC 7230 / RFC 9112 Desync Hardening',
    configSnippet: `# Reverse Proxy Strict Parser Directives
proxy_http_version 1.1;
proxy_set_header Connection "";
chunked_transfer_encoding off;
ignore_invalid_headers on;
underscores_in_headers off;`,
    commandSnippet: `ftn-sec-audit --target-upstream 127.0.0.1:8080 --scan-parser-discrepancies`,
    status: 'HARDENED',
    statusColor: 'cyan',
    tags: ['WAF Bypass', 'HTTP Smuggling', 'Parser Audit', 'Security']
  },
  {
    id: 'kulikov0-whitelist-bypass',
    name: 'kulikov0/whitelist-bypass',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'DEFENSIVE FILTER',
    layer: 'L3 / L4 / L7 ACL',
    shortDesc: 'Techniques and test cases for validating perimeter IP/domain whitelist resilience.',
    technicalDetails: 'Defensive validation toolkit ensuring FTN perimeter whitelist policies cannot be circumvened via SNI spoofing, DNS rebinding, forwarder manipulation, or header smuggling.',
    repoOrDocUrl: 'https://github.com/kulikov0/whitelist-bypass',
    rfcOrSpec: 'Zero-Trust Verification',
    configSnippet: `# nftables strict forward drop with reverse-path validation
table inet ftn_guard {
  chain prerouting {
    type filter hook prerouting priority -300; policy accept;
    fib saddr . mark . iif oif missing drop;
  }
}`,
    commandSnippet: `nft -f /etc/nftables/whitelist_strict.nft && nft list ruleset`,
    status: 'HARDENED',
    statusColor: 'cyan',
    tags: ['ACL', 'Whitelist Bypass', 'nftables', 'Zero Trust']
  },
  {
    id: 'oom-killer-tuning',
    name: 'OOM Killer Tuning & Kernel Panic Prevention',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'SYSCTL TUNING',
    layer: 'Kernel Memory Subsystem',
    shortDesc: 'sysctl kernel memory tuning preventing router freeze and core process OOM panics.',
    technicalDetails: 'Configures vm.panic_on_oom=0, overcommit_memory=2, low-memory reserve ratios, and sets oom_score_adj=-1000 for critical BGP/eBPF routing daemons.',
    rfcOrSpec: 'Linux Kernel Documentation: vm/overcommit-accounting',
    configSnippet: `# /etc/sysctl.d/99-ftn-router-oom.conf
vm.panic_on_oom = 0
vm.oom_kill_allocating_task = 0
vm.overcommit_memory = 2
vm.overcommit_ratio = 80
vm.min_free_kbytes = 1048576
kernel.panic = 10`,
    commandSnippet: `echo -1000 > /proc/$(pgrep frr-bgpd)/oom_score_adj`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['OOM Killer', 'Kernel Panics', 'Sysctl', 'Stability']
  },
  {
    id: 'wrapper-kernel',
    name: 'Wrapper Kernel & Microkernel Sandboxes',
    category: 'core-kernel',
    categoryLabel: 'Core Router & Low-Level Kernel',
    badge: 'MICRO-VM',
    layer: 'KVM / Firecracker / gVisor',
    shortDesc: 'Lightweight kernel sandbox isolation for untrusted packet routing scripts.',
    technicalDetails: 'Runs untrusted tenant routing engines, custom Lua filters, or external plugins inside 5ms microVMs or syscall-intercepted gVisor sandboxes.',
    rfcOrSpec: 'gVisor runsc / Firecracker KVM microVM',
    configSnippet: `{
  "runtime": "runsc",
  "platform": "kvm",
  "network": "host",
  "isolate-syscalls": true
}`,
    commandSnippet: `runsc --platform=kvm run ftn-isolated-proxy-sandbox`,
    status: 'RUNNING',
    statusColor: 'emerald',
    tags: ['Sandbox', 'gVisor', 'Microkernel', 'Isolation']
  },

  // 2. Overlay, SDN & Security Hardening
  {
    id: 'vxlan-overlay',
    name: 'VXLAN (Virtual Extensible LAN)',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'RFC 7348',
    layer: 'L2 over L3 Overlay',
    shortDesc: '24-bit VNI packet encapsulation over standard UDP port 4789.',
    technicalDetails: 'Extends L2 broadcast domains across global L3 IP networks with up to 16 million logical segments, hardware offloaded via Intel 82599 and Mellanox ConnectX NICs.',
    rfcOrSpec: 'RFC 7348 / UDP 4789',
    configSnippet: `ip link add vxlan100 type vxlan \\
  id 100 \\
  dstport 4789 \\
  local 192.168.10.1 \\
  group 239.1.1.1 \\
  dev eth0
ip link set up dev vxlan100`,
    commandSnippet: `bridge fdb show dev vxlan100`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['VXLAN', 'VNI', 'SDN', 'Overlay']
  },
  {
    id: 'ipsec-tunnel',
    name: 'IPsec Tunnel & Full Mesh IKEv2',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'IKEv2 / ESP',
    layer: 'L3 Cryptographic Overlay',
    shortDesc: 'Hardware-accelerated AES-256-GCM / ChaCha20 IPsec tunnels with Perfect Forward Secrecy.',
    technicalDetails: 'Employs StrongSwan / XFRM kernel state offloading for high-speed multi-gigabit encrypted site-to-site tunnels with automatic DPD and re-keying.',
    rfcOrSpec: 'RFC 7296 (IKEv2) / RFC 4303 (ESP)',
    configSnippet: `# strongSwan swanctl.conf
connections {
  ftn-mesh {
    local_addrs = 103.145.10.2
    remote_addrs = 103.145.20.2
    local { auth = psk }
    remote { auth = psk }
    children {
      net-mesh {
        local_ts = 10.240.0.0/16
        remote_ts = 10.241.0.0/16
        esp_proposals = chacha20poly1305-prfsha256-ecp256
        mode = tunnel
      }
    }
  }
}`,
    commandSnippet: `swanctl --load-all && swanctl --list-sas`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['IPsec', 'IKEv2', 'ESP', 'Encryption', 'Full Mesh']
  },
  {
    id: 'kube-ovn',
    name: 'Kube-OVN & OVS Subsystem',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'KUBE-OVN',
    layer: 'SDN Controller & OVS',
    shortDesc: 'Enterprise Kubernetes SDN fabric integrating Open vSwitch and OVN for telco workloads.',
    technicalDetails: 'Delivers multi-VPC isolation, distributed subnets, EIP/NAT gateways, QoS bandwidth limiting, and hardware offload integration for high-density container workloads.',
    repoOrDocUrl: 'https://github.com/kubeovn/kube-ovn',
    rfcOrSpec: 'Open vSwitch & Open Virtual Network',
    configSnippet: `apiVersion: kubeovn.io/v1
kind: Subnet
metadata:
  name: ftn-telco-subnet
spec:
  cidrBlock: 10.180.0.0/16
  gateway: 10.180.0.1
  excludeIps: ["10.180.0.1..10.180.0.10"]
  vlan: "vlan-100"
  enableLb: true`,
    commandSnippet: `kubectl get subnets.kubeovn.io -o wide`,
    status: 'RUNNING',
    statusColor: 'emerald',
    tags: ['Kube-OVN', 'SDN', 'Open vSwitch', 'Kubernetes']
  },
  {
    id: 'frr-bgp-evpn',
    name: 'FRR (Free Range Routing) & BGP EVPN',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'FRR / EVPN',
    layer: 'Control Plane Routing',
    shortDesc: 'Industry-standard BGP EVPN Type-2 (MAC/IP) and Type-5 (Prefix) route reflector fabric.',
    technicalDetails: 'FRRouting suite operating BGP, OSPF, and IS-IS for multi-tenant datacenter overlay orchestration, dynamically programming Linux kernel FIB and VXLAN bridge FDB tables.',
    rfcOrSpec: 'RFC 7432 (BGP EVPN) / RFC 8365',
    configSnippet: `router bgp 65001
 bgp router-id 10.0.0.1
 neighbor 10.0.0.2 remote-as 65001
 neighbor 10.0.0.2 update-source lo
 address-family l2vpn evpn
  neighbor 10.0.0.2 activate
  advertise-all-vni
 exit-address-family`,
    commandSnippet: `vtysh -c "show bgp l2vpn evpn summary"`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['FRR', 'BGP EVPN', 'Type-2', 'Type-5', 'Routing']
  },
  {
    id: 'fdio-vpp',
    name: 'FD.io / VPP (Vector Packet Processing)',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'VPP / FD.IO',
    layer: 'User-Space Dataplane',
    shortDesc: 'Terabit-class vector packet processing engine processing packet vectors in CPU L1/L2 cache.',
    technicalDetails: 'Bypasses standard kernel networking using DPDK and PCIe memory rings. Processes vectors of up to 256 packets simultaneously, yielding line-rate 100G forwarding with low jitter.',
    repoOrDocUrl: 'https://fd.io',
    rfcOrSpec: 'DPDK / Linux Foundation FD.io',
    configSnippet: `dpdk {
  dev 0000:01:00.0 { num-rx-queues 4 num-tx-queues 4 }
  num-mbufs 131072
}
plugins {
  plugin dpdk_plugin.so { enable }
  plugin nat_plugin.so { enable }
}`,
    commandSnippet: `vppctl show hardware-interfaces && vppctl show run`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['FD.io', 'VPP', 'DPDK', 'Vector Processing', '100Gbps']
  },
  {
    id: 'opnsense-openbsd',
    name: 'OPNsense, OpenBSD pf & FreeBSD',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'PF FIREWALL',
    layer: 'Stateful Packet Filter',
    shortDesc: 'Hardened stateful packet filtering, CARP redundancy, and cryptographic routing.',
    technicalDetails: 'Deploys OpenBSD pf and OPNsense as perimeter bastions for strict syn-proxying, stateful inspection, and anti-spoofing Unicast Reverse Path Forwarding (uRPF).',
    rfcOrSpec: 'OpenBSD pf / CARP RFC 5798',
    configSnippet: `# /etc/pf.conf (OpenBSD / OPNsense)
set block-policy drop
set skip on lo
match in all scrub (no-df random-id max-mss 1440)
antispoof quick for egress
pass out quick on egress keep state`,
    commandSnippet: `pfctl -sr && pfctl -si`,
    status: 'HARDENED',
    statusColor: 'cyan',
    tags: ['OPNsense', 'OpenBSD', 'pf', 'CARP', 'Firewall']
  },
  {
    id: 'openrc-turnkey',
    name: 'OpenRC & TurnKey Linux Appliances',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'SYS INIT',
    layer: 'System Initialization',
    shortDesc: 'Lightweight dependency-based init system and pre-configured hardened appliances.',
    technicalDetails: 'Employed across FTN Alpine-based edge micro-routers and TurnKey utility VMs for sub-second system boot and zero-dependency service daemon supervision.',
    rfcOrSpec: 'OpenRC / Gentoo-Alpine Init standard',
    configSnippet: `#!/sbin/openrc-run
description="FTN BGP Tunnel Supervisor"
command="/usr/local/bin/ftn-tunnel-daemon"
command_background=true
pidfile="/run/ftn-tunnel.pid"
depend() {
  need net
  after firewall
}`,
    commandSnippet: `rc-status -s && rc-service ftn-tunnel status`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['OpenRC', 'TurnKey Linux', 'Alpine', 'Init']
  },
  {
    id: 'jumbo-frames-9000',
    name: 'Jumbo Frames (9000 MTU) & vBNG',
    category: 'overlay-sdn',
    categoryLabel: 'Overlay, SDN & Security Hardening',
    badge: 'MTU 9000',
    layer: 'L2 MTU / L3 MSS',
    shortDesc: 'End-to-end 9000-byte MTU payload transit and virtual Broadband Network Gateway.',
    technicalDetails: 'Reduces CPU interrupt load by over 60% during high-throughput datacenter replication and inter-PoP trunking, accompanied by vBNG subscriber session termination.',
    rfcOrSpec: 'IEEE 802.3ad / vBNG TR-101',
    configSnippet: `ip link set dev eth0 mtu 9000
iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu`,
    commandSnippet: `ip link show eth0 | grep -i mtu`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Jumbo Frames', 'MTU 9000', 'vBNG', 'MSS Clamp']
  },

  // 3. Telemetry, Analytics & Monitoring
  {
    id: 'yaf-flowmeter',
    name: 'NetSA YAF (Yet Another Flowmeter)',
    category: 'telemetry-monitoring',
    categoryLabel: 'Telemetry, Analytics & Monitoring',
    badge: 'CERT / NETSA',
    layer: 'L4 - L7 Flow Generator',
    shortDesc: 'Carrier-grade bidirectional IPFIX/NetFlow generator by Carnegie Mellon CERT.',
    technicalDetails: 'Analyzes live pcap streams from promiscuous interfaces and outputs IPFIX bidirectional flows (biflows), tracking entropy, TCP flag sequencing, and payload fingerprints.',
    repoOrDocUrl: 'https://tools.netsa.cert.org/yaf/install.html',
    rfcOrSpec: 'RFC 7011 (IPFIX) / RFC 5103 (Biflows)',
    configSnippet: `yaf --in eth0 \\
  --live pcap \\
  --out 127.0.0.1:18001 \\
  --ipfix tcp \\
  --plugin-name=/usr/local/lib/yaf/dpacketplugin.la \\
  --applabel --max-payload=2048 --entropy`,
    commandSnippet: `yaf --version && pgrep -l yaf`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['YAF', 'IPFIX', 'CERT NetSA', 'Flowmeter', 'Biflow']
  },
  {
    id: 'silk-rwflowpack',
    name: 'SiLK Analysis & rwflowpack',
    category: 'telemetry-monitoring',
    categoryLabel: 'Telemetry, Analytics & Monitoring',
    badge: 'SiLK / rwflowpack',
    layer: 'Flow Analysis Storage',
    shortDesc: 'High-performance network flow repository and query engine (cmusei/silk_analysis).',
    technicalDetails: 'SiLK (System for Internet-Level Knowledge) captures millions of flows per minute via rwflowpack daemon and enables sub-second forensic queries via rwfilter, rwcut, and rwstats.',
    repoOrDocUrl: 'https://github.com/cmusei/silk_analysis',
    rfcOrSpec: 'CERT NetSA SiLK Suite',
    configSnippet: `# silk.conf sample site layout
probe p1 ipfix
  listen-on-port 18001
  protocol tcp
  accept-from-host 127.0.0.1
end probe

sensor s1
  ipfix-probes p1
  internal-ipblocks 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16
end sensor`,
    commandSnippet: `rwfilter --sensor=s1 --start-date=2026/09/04:00 --proto=6 --pass=stdout | rwstats --fields=dip --count=10`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['SiLK', 'rwflowpack', 'cmusei', 'Forensics', 'NetFlow']
  },
  {
    id: 'yaf-dpacketplugin',
    name: 'netsa/lib/yaf/dpacketplugin',
    category: 'telemetry-monitoring',
    categoryLabel: 'Telemetry, Analytics & Monitoring',
    badge: 'DPI PAYLOAD',
    layer: 'L7 Deep Packet Plugin',
    shortDesc: 'Deep packet inspection plugin extracting TLS SNI, HTTP headers, and DNS queries.',
    technicalDetails: 'Extends standard YAF IPFIX records with application-level payloads, recording full TLS Server Name Indication strings, HTTP user agents, and DNS query response codes for forensics.',
    repoOrDocUrl: 'https://tools.netsa.cert.org/yaf/dpacketplugin.html',
    rfcOrSpec: 'IPFIX Enterprise Information Elements (PEN 6871)',
    configSnippet: `# YAF dpacketplugin config
plugin {
  name = "dpacketplugin"
  library = "/usr/local/lib/yaf/dpacketplugin.la"
  conf = "max-payload=1024;capture-dns=true;capture-tls=true"
}`,
    commandSnippet: `yafscii --in /var/log/silk/flows.ipfix | grep -i "tlsServerName"`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['dpacketplugin', 'DPI', 'SNI Inspection', 'CERT']
  },
  {
    id: 'goflow2-pmacct',
    name: 'GoFlow2 & pmacct',
    category: 'telemetry-monitoring',
    categoryLabel: 'Telemetry, Analytics & Monitoring',
    badge: 'GOFLOW2',
    layer: 'Cloud-Native Telemetry',
    shortDesc: 'Scalable sFlow / NetFlow v5/v9 / IPFIX pipeline streaming to Kafka and OpenSearch.',
    technicalDetails: 'Cloudflare GoFlow2 and promiscuous IP accounting daemon pmacct ingest multi-gigabit flow telemetry from border routers and produce JSON/protobuf messages with ASN enrichment.',
    repoOrDocUrl: 'https://github.com/netsampler/goflow2',
    rfcOrSpec: 'NetFlow v9 RFC 3954 / IPFIX RFC 7011',
    configSnippet: `format: json
transport: file
workers: 8
listen: "netflow://:2055"
enrichment:
  asn: true
  geoip: true`,
    commandSnippet: `goflow2 -listen "netflow://:2055" -format json | head -n 5`,
    status: 'RUNNING',
    statusColor: 'emerald',
    tags: ['GoFlow2', 'pmacct', 'Kafka', 'NetFlow v9', 'OpenSearch']
  },
  {
    id: 'wazuh-siem',
    name: 'Wazuh Open-Source SIEM & XDR',
    category: 'telemetry-monitoring',
    categoryLabel: 'Telemetry, Analytics & Monitoring',
    badge: 'WAZUH SIEM',
    layer: 'Security Monitoring & XDR',
    shortDesc: 'Endpoint security, file integrity monitoring, rootkit detection, and compliance auditing.',
    technicalDetails: 'Unified platform correlating syscheck events, authentication attempts, rootkit checks, and network intrusions with MITRE ATT&CK tactical mapping and automated active responses.',
    repoOrDocUrl: 'https://wazuh.com',
    rfcOrSpec: 'MITRE ATT&CK Matrix for Enterprise',
    configSnippet: `<!-- /var/ossec/etc/ossec.conf -->
<syscheck>
  <directories check_all="yes" realtime="yes">/etc,/usr/local/bin,/etc/nftables</directories>
  <ignore>/etc/mtab</ignore>
</syscheck>
<active-response>
  <command>firewall-drop</command>
  <location>local</location>
  <rules_id>5710, 5712</rules_id>
</active-response>`,
    commandSnippet: `/var/ossec/bin/wazuh-control status`,
    status: 'HARDENED',
    statusColor: 'cyan',
    tags: ['Wazuh', 'SIEM', 'XDR', 'Integrity', 'MITRE']
  },
  {
    id: 'jaeger-opentelemetry',
    name: 'Jaeger & OpenTelemetry (OTel)',
    category: 'telemetry-monitoring',
    categoryLabel: 'Telemetry, Analytics & Monitoring',
    badge: 'OTEL / TRACING',
    layer: 'Application Observability',
    shortDesc: 'Distributed trace visualization and latency bottleneck analysis across microservices.',
    technicalDetails: 'Captures end-to-end transaction spans across FTN API Gateway, Auth services, and BGP controllers with W3C TraceContext propagation.',
    rfcOrSpec: 'W3C Trace Context / OpenTelemetry Protocol (OTLP)',
    configSnippet: `receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
exporters:
  jaeger:
    endpoint: jaeger-collector:14250
    tls: { insecure: true }`,
    commandSnippet: `curl http://localhost:16686/api/services`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Jaeger', 'OpenTelemetry', 'Tracing', 'Latency']
  },

  // 4. DNS, Domain & SSL/PKI Security
  {
    id: 'numa-dns-anycast',
    name: 'Numa DNS & Anycast DNS Mesh',
    category: 'dns-pki',
    categoryLabel: 'DNS, Domain & SSL/PKI Security',
    badge: 'NUMA DNS',
    layer: 'L7 / Memory Locality',
    shortDesc: 'NUMA node-pinned high-QPS DNS resolver with BGP Anycast multi-region dispersion.',
    technicalDetails: 'Pins DNS worker threads and cache structures to dedicated CPU sockets using numactl --cpunodebind and memory interleaving, achieving over 1.2M queries per second with sub-millisecond response.',
    rfcOrSpec: 'RFC 1035 / BGP Anycast RFC 4786',
    configSnippet: `# Systemd service override for NUMA Pinning
[Service]
CPUAffinity=0-7
ExecStart=
ExecStart=/usr/bin/numactl --cpunodebind=0 --membind=0 /usr/sbin/named -f -u bind`,
    commandSnippet: `numastat -c named`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Numa DNS', 'Anycast', 'DNS QPS', 'Hardware Locality']
  },
  {
    id: 'go-cryptographic-acme',
    name: 'Go Cryptographic & ACME Engine',
    category: 'dns-pki',
    categoryLabel: 'DNS, Domain & SSL/PKI Security',
    badge: 'CRYPTO/TLS',
    layer: 'Cryptographic Engine',
    shortDesc: 'Native Go crypto/tls, crypto/x509, and RFC 8555 ACME automated certificate issuance.',
    technicalDetails: 'Built using Go standard library cryptographic packages implementing ECDSA P-384, Ed25519, and automated ACME HTTP-01 and DNS-01 challenge solvers with zero external C library dependencies.',
    repoOrDocUrl: 'https://golang.org/pkg/crypto/tls/',
    rfcOrSpec: 'RFC 8555 (ACME) / RFC 8446 (TLS 1.3)',
    configSnippet: `// Go ACME Manager Implementation
certManager := autocert.Manager{
  Prompt:     autocert.AcceptTOS,
  HostPolicy: autocert.HostWhitelist("ftndns.com", "edge.ftndns.com"),
  Cache:      autocert.DirCache("/var/certs/acme"),
}
server := &http.Server{
  TLSConfig: certManager.TLSConfig(),
}`,
    commandSnippet: `openssl s_client -connect edge.ftndns.com:443 -tls1_3`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Go Cryptographic', 'ACME', 'TLS 1.3', 'crypto/tls', 'Certificates']
  },
  {
    id: 'akamai-cert-dns',
    name: 'Akamai Certificate & Edge DNS',
    category: 'dns-pki',
    categoryLabel: 'DNS, Domain & SSL/PKI Security',
    badge: 'AKAMAI EDGE',
    layer: 'Global Edge TLS / DNS',
    shortDesc: 'Carrier-grade Edge TLS certificate automation and Fast DNS Anycast integration.',
    technicalDetails: 'Interfaces with Akamai CPS (Certificate Provisioning System) and Edge DNS APIs to synchronize SAN certificates, manage DNSSEC keys, and offload DDoS query floods.',
    rfcOrSpec: 'DNSSEC RFC 4033 / Akamai CPS API v2',
    configSnippet: `{
  "enrollmentId": 48291,
  "certificateType": "third-party",
  "sanNames": ["global.ftndns.com", "transit.ftndns.com"],
  "validationType": "dns",
  "autoRenewal": true
}`,
    commandSnippet: `dig +dnssec @a1-67.akam.net global.ftndns.com`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Akamai', 'Edge DNS', 'Certificates', 'DNSSEC']
  },
  {
    id: 'ddns-porkbun-dnspod',
    name: 'Tencent DNSPod, Porkbun & DuckDNS',
    category: 'dns-pki',
    categoryLabel: 'DNS, Domain & SSL/PKI Security',
    badge: 'MULTI-DDNS',
    layer: 'Dynamic DNS Services',
    shortDesc: 'Multi-provider automated Dynamic DNS clients (GoDNS, Caddy DNS plugins).',
    technicalDetails: 'Continuously updates A/AAAA records across domestic and international registrants upon WAN IP change, utilizing token-based REST APIs with exponential backoff.',
    rfcOrSpec: 'Dynamic Updates in the DNS (RFC 2136)',
    configSnippet: `// godns configuration
{
  "provider": "Porkbun",
  "api_key": "pk1_...",
  "secret_api_key": "sk1_...",
  "domains": [
    { "domain_name": "ftndns.com", "sub_domains": ["residential-gw", "vault"] }
  ],
  "ip_type": "IPv4,IPv6",
  "interval": 120
}`,
    commandSnippet: `godns -c /etc/godns.json`,
    status: 'RUNNING',
    statusColor: 'emerald',
    tags: ['Porkbun', 'DNSPod', 'DuckDNS', 'GoDNS', 'DDNS']
  },

  // 5. Hosting, Proxy & Database Pooling
  {
    id: 'pgbouncer-pooler',
    name: 'PgBouncer & 60% Traffic Offload',
    category: 'hosting-proxy-db',
    categoryLabel: 'Hosting, Proxy & Database Pooling',
    badge: 'PGBOUNCER',
    layer: 'L7 Database Connection Pooler',
    shortDesc: 'Lightweight connection pooling with session and transaction multiplexing.',
    technicalDetails: 'Reduces database connection overhead from 5,000 backend threads to 50 pooled connections. Works alongside in-memory edge caching to absorb 60%+ query traffic.',
    rfcOrSpec: 'PostgreSQL Wire Protocol 3.0',
    configSnippet: `[databases]
ftn_prod = host=127.0.0.1 port=5432 dbname=ftn_prod pool_size=50

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = scram-sha-256
pool_mode = transaction
max_client_conn = 10000
default_pool_size = 60`,
    commandSnippet: `psql -p 6432 -U pgbouncer -d pgbouncer -c "SHOW POOLS;"`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['PgBouncer', 'Database Pooling', 'Offload', 'Postgres']
  },
  {
    id: 'cockroachdb-resilient',
    name: 'CockroachDB Distributed SQL',
    category: 'hosting-proxy-db',
    categoryLabel: 'Hosting, Proxy & Database Pooling',
    badge: 'RAFT SQL',
    layer: 'Distributed Storage Layer',
    shortDesc: 'Globally distributed, ACID-compliant SQL database with multi-region survivability.',
    technicalDetails: 'Utilizes Raft consensus for data partitioning and replication across Dhaka, Singapore, and Frankfurt clusters, guaranteeing zero data loss (RPO=0) even if an entire DC fails.',
    repoOrDocUrl: 'https://www.cockroachlabs.com',
    rfcOrSpec: 'Raft Distributed Consensus / ANSI SQL',
    configSnippet: `cockroach start \\
  --certs-dir=/certs \\
  --locality=region=ap-south-1,zone=dhk-01 \\
  --store=path=/mnt/nvme0n1/cockroach \\
  --listen-addr=0.0.0.0:26257 \\
  --http-addr=0.0.0.0:8080 \\
  --join=10.240.0.10:26257,10.241.0.10:26257`,
    commandSnippet: `cockroach node status --certs-dir=/certs`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['CockroachDB', 'Distributed SQL', 'Raft', 'Multi-Region']
  },
  {
    id: 'polarismesh-service',
    name: 'PolarisMesh (Tencent Service Mesh)',
    category: 'hosting-proxy-db',
    categoryLabel: 'Hosting, Proxy & Database Pooling',
    badge: 'SERVICE MESH',
    layer: 'Service Discovery & Mesh',
    shortDesc: 'Production service discovery, governance, circuit breaking, and rate limiting.',
    technicalDetails: 'Provides unified service registry, dynamic traffic shaping, canary routing, and health checks across microservices without sidecar performance penalties.',
    repoOrDocUrl: 'https://github.com/polarismesh/polaris',
    rfcOrSpec: 'Polaris Service Governance Spec',
    configSnippet: `global:
  system:
    discover:
      address: "127.0.0.1:8091"
consumer:
  serviceRouter:
    chain:
      - ruleBasedRouter
      - nearbyRouter`,
    commandSnippet: `curl http://127.0.0.1:8090/naming/v1/instances`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['PolarisMesh', 'Service Mesh', 'Discovery', 'Governance']
  },
  {
    id: 'drip-traffic-shaping',
    name: 'Drip Policy & Memory-to-Memory Edge Cache',
    category: 'hosting-proxy-db',
    categoryLabel: 'Hosting, Proxy & Database Pooling',
    badge: 'RATE LIMITING',
    layer: 'L7 Reverse Proxy & Cache',
    shortDesc: 'Token-bucket traffic shaping (Drip Policy) and direct shared memory edge caching.',
    technicalDetails: 'Ensures bandwidth fairness during sudden subscriber demand spikes while caching static media and API payloads directly in RAM for microsecond response times.',
    rfcOrSpec: 'Leaky / Token Bucket Algorithm',
    configSnippet: `# Nginx Drip Policy Rate Limiting
limit_req_zone $binary_remote_addr zone=api_drip:20m rate=50r/s;
limit_conn_zone $binary_remote_addr zone=addr_drip:20m;

location /api/ {
  limit_req zone=api_drip burst=100 nodelay;
  proxy_cache shared_ram_cache;
  proxy_cache_valid 200 302 10m;
}`,
    commandSnippet: `nginx -t && nginx -s reload`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Drip Policy', 'Rate Limiting', 'RAM Cache', 'Traffic Shaping']
  },

  // 6. Remote Access, Automation & AI Vision
  {
    id: 'ansible-canary-deployment',
    name: 'Ansible / AWX & Canary Deployments',
    category: 'remote-automation-ai',
    categoryLabel: 'Remote Access, Automation & AI Vision',
    badge: 'ANSIBLE / AWX',
    layer: 'Infrastructure as Code',
    shortDesc: 'Automated router playbook execution with progressive canary rollouts and instant rollback.',
    technicalDetails: 'Deploys configuration changes sequentially (10% -> 25% -> 50% -> 100%) across fleet nodes with automated health check validations and autonomous rollback triggers.',
    rfcOrSpec: 'Ansible Core 2.16+ / AWX Workflow Automation',
    configSnippet: `- name: Canary Deploy BGP Policy
  hosts: edge_routers
  serial: "25%"
  tasks:
    - name: Push Candidate Configuration
      ansible.builtin.template:
        src: frr.conf.j2
        dest: /etc/frr/frr.conf
      notify: Reload FRR
    - name: Verify BGP Convergence SLA
      ansible.builtin.command: vtysh -c "show bgp summary"
      register: bgp_check
      failed_when: "'Established' not in bgp_check.stdout"`,
    commandSnippet: `ansible-playbook -i inventory/prod canary_deploy.yml --check`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Ansible', 'AWX', 'Canary Deployment', 'Automation', 'IaC']
  },
  {
    id: 'apache-guacamole-mremoteng',
    name: 'Apache Guacamole & mRemoteNG',
    category: 'remote-automation-ai',
    categoryLabel: 'Remote Access, Automation & AI Vision',
    badge: 'HTML5 BASTION',
    layer: 'Remote Access Gateway',
    shortDesc: 'Clientless HTML5 remote desktop and SSH/VNC bastion gateway with audit recording.',
    technicalDetails: 'Provides browser-based zero-install access to core router consoles, network management systems, and virtual machines without exposing internal ports to the internet.',
    rfcOrSpec: 'Guacamole Protocol / RDP / SSH / VNC',
    configSnippet: `<connection name="FTN-Core-Router-Console">
  <protocol>ssh</protocol>
  <param name="hostname">10.0.1.1</param>
  <param name="port">22</param>
  <param name="username">ftnadmin</param>
  <param name="recording-path">/var/audit/sessions</param>
</connection>`,
    commandSnippet: `guacd -b 127.0.0.1 -l 4822`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Guacamole', 'mRemoteNG', 'SSH', 'RDP', 'Bastion']
  },
  {
    id: 'netbox-nautobot',
    name: 'NetBox & Nautobot (Network Source of Truth)',
    category: 'remote-automation-ai',
    categoryLabel: 'Remote Access, Automation & AI Vision',
    badge: 'NETBOX DCIM',
    layer: 'DCIM & IPAM Source of Truth',
    shortDesc: 'Authoritative infrastructure database driving programmatic configuration generation.',
    technicalDetails: 'Maintains canonical state of physical racks, devices, cables, IP addresses, VLANs, and BGP sessions, serving as the single source of truth for all automation pipelines.',
    repoOrDocUrl: 'https://netboxlabs.com',
    rfcOrSpec: 'NetBox REST / GraphQL API v3',
    configSnippet: `# Python netbox client snippet
from pynetbox import api
nb = api('https://netbox.local.ftndns.com', token='0123456789abcdef...')
devices = nb.dcim.devices.filter(role='core-router', status='active')
for dev in devices:
    print(f"{dev.name} -> {dev.primary_ip}")`,
    commandSnippet: `curl -H "Authorization: Token $NB_TOKEN" https://netbox.local.ftndns.com/api/ipam/ip-addresses/`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['NetBox', 'Nautobot', 'DCIM', 'Source of Truth', 'IPAM']
  },
  {
    id: 'frigate-ai-nvr-doorbin',
    name: 'Frigate AI NVR & AI Doorbin (Network X-Ray)',
    category: 'remote-automation-ai',
    categoryLabel: 'Remote Access, Automation & AI Vision',
    badge: 'EDGE AI VISION',
    layer: 'Edge Vision & AI NVR',
    shortDesc: 'Real-time object detection with Google Coral TPU and physical datacenter optical monitoring.',
    technicalDetails: 'Monitors physical POP racks and optical fiber cabinets using low-latency RTSP and YOLO/TensorRT models. Integrates with Network X-Ray to correlate physical access with telemetry spikes.',
    repoOrDocUrl: 'https://frigate.video',
    rfcOrSpec: 'RTSP H.264/H.265 / Coral EdgeTPU API',
    configSnippet: `mqtt:
  host: 10.0.1.50
cameras:
  noc_rack_01:
    ffmpeg:
      inputs:
        - path: rtsp://10.0.5.10:554/live/ch0
          roles: [detect, record]
    detect:
      width: 1920
      height: 1080
      fps: 5
detectors:
  coral:
    type: edgetpu
    device: usb`,
    commandSnippet: `docker logs -f frigate | grep -i "detection"`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Frigate AI', 'AI Doorbin', 'Coral TPU', 'Vision', 'Security']
  },

  // 7. Web3, Gaming & Peering
  {
    id: 'evmbench-go-ethereum',
    name: 'ABCDELabs Go-Ethereum & Paradigm EVMbench',
    category: 'web3-gaming-peering',
    categoryLabel: 'Web3, Gaming & Peering',
    badge: 'WEB3 / EVM',
    layer: 'Blockchain Execution Layer',
    shortDesc: 'Geth full-node optimization and EVMbench execution profiling for low-latency RPC.',
    technicalDetails: 'Profiles state transition speeds and JSON-RPC latency across local FTN NVMe nodes, routing DeFi and consensus traffic through prioritized BGP paths.',
    repoOrDocUrl: 'https://github.com/paradigmxyz/evmbench',
    rfcOrSpec: 'Ethereum Execution Client Specs / EIP-1559',
    configSnippet: `geth --cache 8192 \\
  --maxpeers 100 \\
  --http --http.addr 0.0.0.0 \\
  --http.vhosts "*" \\
  --http.api eth,net,web3,txpool \\
  --syncmode snap \\
  --txlookuplimit 0`,
    commandSnippet: `evmbench run --workload uniswap-v3-swap --iterations 1000`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Go-Ethereum', 'EVMbench', 'Paradigm', 'Web3', 'DeFi']
  },
  {
    id: 'dscp-qos-gaming',
    name: 'DSCP QoS & Gaming Acceleration',
    category: 'web3-gaming-peering',
    categoryLabel: 'Web3, Gaming & Peering',
    badge: 'DSCP QOS',
    layer: 'L3 Differentiated Services',
    shortDesc: 'Hardware queue prioritization (CS6 for BGP, EF for VoIP, AF41 for low-jitter gaming).',
    technicalDetails: 'Employs Linux CAKE / FQ-CoDel queue disciplines to eliminate bufferbloat, keeping gaming and interactive telemetry latency under 4ms during 10G saturation.',
    rfcOrSpec: 'RFC 2474 (DiffServ) / RFC 8290 (FQ-CoDel)',
    configSnippet: `# DSCP classification with iptables / nftables
nft add rule inet filter forward ip dscp set cs6 ip protocol tcp tcp dport 179
nft add rule inet filter forward ip dscp set ef udp dport 5060
nft add rule inet filter forward ip dscp set af41 udp dport { 27015-27050, 3074 }
tc qdisc add dev eth0 root cake diffserv4`,
    commandSnippet: `tc -s qdisc show dev eth0`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['DSCP', 'QoS', 'Gaming', 'CAKE', 'Bufferbloat']
  },
  {
    id: 'provider-bgp-peering',
    name: 'Provider-Specific BGP Peering & Routing',
    category: 'web3-gaming-peering',
    categoryLabel: 'Web3, Gaming & Peering',
    badge: 'BGP PEERING',
    layer: 'Inter-Domain Routing',
    shortDesc: 'Direct BGP peering agreements with Tier 1 upstreams and local Internet Exchange Points.',
    technicalDetails: 'Implements selective route manipulation using BGP MED, AS-Path Prepending, and BGP Communities for optimal outbound transit cost and inbound traffic balancing.',
    rfcOrSpec: 'RFC 4271 (BGP-4) / RFC 1997 (Communities)',
    configSnippet: `route-map PEER-IXP-OUT permit 10
 set community 65000:100
 set metric 20
route-map PEER-TRANSIT-OUT permit 10
 set as-path prepend 65001 65001`,
    commandSnippet: `vtysh -c "show ip bgp neighbors 103.145.10.1 routes"`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['BGP Peering', 'Communities', 'IXP', 'Transit', 'Routing']
  },

  // 8. Oly-7 & Multi-Protocol Tunnel Encryption
  {
    id: 'wireguard-amneziawg',
    name: 'WireGuard & AmneziaWG (DPI Bypass)',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'AMNEZIA-WG',
    layer: 'Encrypted L3 Kernel Overlay',
    shortDesc: 'Kernel-space ChaCha20-Poly1305 with junk packet headers to defeat Deep Packet Inspection.',
    technicalDetails: 'AmneziaWG extends standard WireGuard with configurable header obfuscation (Jc, Jmin, Jmax, H1-H4 parameters), preventing censorship firewalls from recognizing the WireGuard handshake.',
    repoOrDocUrl: 'https://github.com/amnezia-vpn/amnezia-wg',
    rfcOrSpec: 'Noise Protocol Framework / AmneziaWG v1.0',
    configSnippet: `[Interface]
PrivateKey = aAAA...
Address = 10.7.0.2/24
DNS = 10.7.0.1
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = bBBB...
Endpoint = 103.145.10.1:51820
AllowedIPs = 0.0.0.0/0`,
    commandSnippet: `awg show awg0`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['WireGuard', 'AmneziaWG', 'DPI Bypass', 'ChaCha20', 'Noise']
  },
  {
    id: 'hysteria2-shadowsocks',
    name: 'Hysteria2 & Shadowsocks 2022',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'HYSTERIA2',
    layer: 'Custom QUIC Congestion',
    shortDesc: 'Brutal UDP congestion control protocol designed for hostile, lossy internet connections.',
    technicalDetails: 'Hysteria2 uses modified QUIC protocol with custom BBR congestion control and port hopping, maintaining multi-megabit throughput even on links experiencing 30%+ packet loss.',
    repoOrDocUrl: 'https://v2.hysteria.network',
    rfcOrSpec: 'RFC 9000 (QUIC) / Hysteria2 Protocol',
    configSnippet: `# Hysteria 2 Server Config
listen: :443
tls:
  cert: /etc/certs/server.crt
  key: /etc/certs/server.key
auth:
  type: password
  password: ftn-secure-token-2026
bandwidth:
  up: 500 mbps
  down: 1000 mbps
masquerade:
  type: proxy
  proxy:
    url: https://cloudflare.com`,
    commandSnippet: `hysteria server -c /etc/hysteria/config.yaml`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Hysteria2', 'Shadowsocks', 'QUIC', 'Loss Resilience', 'UDP']
  },
  {
    id: 'aether-core-mesh',
    name: 'Aether-Core Mesh Architecture',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'AETHER-CORE',
    layer: 'Distributed P2P Mesh',
    shortDesc: 'Decentralized cryptographic multi-hop mesh with dynamic shortest-path routing.',
    technicalDetails: 'Constructs automated full-mesh peer topologies across multi-datacenter server nodes with zero central coordinator dependency, using Ed25519 node identities.',
    rfcOrSpec: 'Aether Cryptographic Overlay Standard',
    configSnippet: `node:
  identity: "aether://ed25519:7F9A..."
  listen: "0.0.0.0:4242"
  peers:
    - "103.145.10.10:4242"
    - "103.145.20.10:4242"
  routing:
    algorithm: "dijkstra_latency_aware"`,
    commandSnippet: `aetherctl status --peers`,
    status: 'RUNNING',
    statusColor: 'emerald',
    tags: ['Aether-Core', 'P2P Mesh', 'Ed25519', 'Overlay']
  },
  {
    id: 'sslh-port-multiplexer',
    name: 'SSLH (Port 443 Multiplexer)',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'SSLH / 443',
    layer: 'L4 Demultiplexing',
    shortDesc: 'Transparently demultiplexes HTTPS, SSH, OpenVPN, and WireGuard on a single port 443.',
    technicalDetails: 'Inspects the first incoming bytes of every connection to determine protocol signatures, transparently routing HTTPS traffic to Nginx, OpenVPN packets to OpenVPN daemon, and SSH packets to sshd.',
    rfcOrSpec: 'SSLH Protocol Signature Detection',
    configSnippet: `# /etc/default/sslh
DAEMON_OPTS="--user sslh --listen 0.0.0.0:443 \\
  --ssh 127.0.0.1:22 \\
  --ssl 127.0.0.1:8443 \\
  --openvpn 127.0.0.1:1194 \\
  --wireguard 127.0.0.1:51820 \\
  --timeout 2"`,
    commandSnippet: `systemctl status sslh`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['SSLH', 'Multiplexer', 'Port 443', 'Bypass']
  },
  {
    id: 'multi-db-encryption',
    name: 'Multi-Database Traffic Encryption (mTLS)',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'mTLS DB WIRE',
    layer: 'L7 Transport Encryption',
    shortDesc: 'Mutual TLS wire encryption for inter-server PostgreSQL, Redis, and CockroachDB traffic.',
    technicalDetails: 'Mandates strict mTLS verification with per-node certificate authority chains, preventing plaintext packet snooping across cloud provider transit links.',
    rfcOrSpec: 'TLS 1.3 RFC 8446 / mTLS RFC 8705',
    configSnippet: `# PostgreSQL pg_hba.conf mTLS rule
hostssl all all 10.240.0.0/16 cert clientcert=verify-full
# Redis TLS config
tls-port 6379
tls-cert-file /etc/redis/tls/redis.crt
tls-key-file /etc/redis/tls/redis.key
tls-ca-cert-file /etc/redis/tls/ca.crt
tls-auth-clients yes`,
    commandSnippet: `openssl s_client -connect 10.240.0.15:5432 -starttls postgres -CAfile /certs/ca.crt`,
    status: 'HARDENED',
    statusColor: 'cyan',
    tags: ['mTLS', 'Postgres', 'Redis', 'Database Encryption', 'Security']
  },
  {
    id: 'palo-alto-fortinet-vpn',
    name: 'Palo Alto GlobalProtect & FortiSSL VPN',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'ENTERPRISE VPN',
    layer: 'Enterprise VPN Gateways',
    shortDesc: 'Compatibility gateways for corporate Palo Alto GlobalProtect and Fortinet FortiSSL clients.',
    technicalDetails: 'Provides interoperability adapters allowing corporate roaming workstations to connect securely to FTN core management planes using enterprise MFA credentials.',
    rfcOrSpec: 'GlobalProtect SSL/ESP Spec / FortiGate SSL VPN',
    configSnippet: `# OpenConnect / GlobalProtect compatibility
openconnect --protocol=gp vpn.corporate.ftndns.com \\
  --user=admin \\
  --csd-wrapper=/usr/libexec/openconnect/csd-wrapper.sh`,
    commandSnippet: `openconnect --version`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['GlobalProtect', 'FortiSSL', 'Enterprise VPN', 'OpenConnect']
  },
  {
    id: 'resilio-magic-wormhole',
    name: 'Resilio Sync & Magic Wormhole',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'P2P DATA SYNC',
    layer: 'Encrypted P2P Data Pipeline',
    shortDesc: 'BitTorrent-based multi-terabyte block sync and SPA human-readable encrypted file transfer.',
    technicalDetails: 'Transfers multi-gigabyte disk snapshots, backup blobs, and router images securely between global edge nodes with differential block updates and zero central server storage.',
    repoOrDocUrl: 'https://github.com/magic-wormhole/magic-wormhole',
    rfcOrSpec: 'PAKE (Password-Authenticated Key Exchange)',
    configSnippet: `# Resilio Sync daemon config snippet
{
  "device_name": "FTN-Core-Vault-DHK",
  "listening_port": 55444,
  "storage_path": "/var/resilio/.sync",
  "use_upnp": false,
  "download_limit": 0,
  "upload_limit": 0
}`,
    commandSnippet: `wormhole send /var/backups/ftn-core-config.tar.gz`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Resilio Sync', 'Magic Wormhole', 'P2P Sync', 'PAKE']
  },
  {
    id: 'thunderbolt-networking',
    name: 'Thunderbolt 20-40 Gbps PCIe Interconnect',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'THUNDERBOLT',
    layer: 'Physical PCIe DMA Interconnect',
    shortDesc: 'Direct point-to-point PCIe DMA network bridging between co-located rack hypervisors.',
    technicalDetails: 'Employs Linux thunderbolt-net driver to achieve 20-40 Gbps line rates with sub-microsecond latency between physical nodes without requiring expensive 40G QSFP switch ports.',
    rfcOrSpec: 'Thunderbolt 3/4 Networking Specification',
    configSnippet: `# /etc/network/interfaces (Thunderbolt link)
auto thunderbolt0
iface thunderbolt0 inet static
  address 10.99.99.1
  netmask 255.255.255.252
  mtu 65520`,
    commandSnippet: `boltctl list && ip link show thunderbolt0`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['Thunderbolt', '40Gbps', 'PCIe DMA', 'Low Latency', 'Interconnect']
  },
  {
    id: 'synology-truenas-stun',
    name: 'Synology QuickConnect, TrueNAS & STUN',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'STUN / NAS',
    layer: 'L4 NAT Traversal / Storage',
    shortDesc: 'RFC 5389 STUN NAT traversal for remote NAS administration across carrier CGNAT.',
    technicalDetails: 'Enables outbound STUN hole-punching and TURN relay fallback, allowing remote administrative access to TrueNAS SCALE and Synology storage appliances behind residential CGNAT.',
    rfcOrSpec: 'RFC 5389 (STUN) / RFC 8656 (TURN)',
    configSnippet: `# coturn STUN/TURN server configuration
listening-port=3478
tls-listening-port=5349
fingerprint
lt-cred-mech
realm=ftndns.com
cert=/etc/certs/turn.crt
pkey=/etc/certs/turn.key`,
    commandSnippet: `stun-client 103.145.10.1 3478`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['STUN', 'TrueNAS', 'Synology', 'CGNAT', 'NAT Traversal']
  },
  {
    id: 'rutorrent-qsv-vaapi',
    name: 'ruTorrent with QSV / VAAPI Acceleration',
    category: 'oly7-tunnels',
    categoryLabel: 'Oly-7 Multi-Protocol Tunnel Encryption',
    badge: 'QSV / VAAPI',
    layer: 'Hardware Transcoding',
    shortDesc: 'High-speed media distribution with Intel QuickSync (QSV) and VAAPI hardware video encoding.',
    technicalDetails: 'Utilizes Intel /dev/dri/renderD128 hardware accelerators to transcode training media, CCTV recordings, and archival streams at zero CPU utilization.',
    rfcOrSpec: 'Intel Media SDK / VA-API 1.18+',
    configSnippet: `# docker-compose snippet with hardware device passthrough
devices:
  - /dev/dri/renderD128:/dev/dri/renderD128
environment:
  - LIBVA_DRIVER_NAME=iHD
  - PUID=1000
  - PGID=1000`,
    commandSnippet: `vainfo --display drm --device /dev/dri/renderD128`,
    status: 'ACTIVE',
    statusColor: 'emerald',
    tags: ['ruTorrent', 'QSV', 'VAAPI', 'Intel QuickSync', 'Hardware Accel']
  }
];

// Calculate category counts
ECOSYSTEM_CATEGORIES.forEach(cat => {
  if (cat.id === 'all') {
    cat.count = ECOSYSTEM_TECHNOLOGIES.length;
  } else {
    cat.count = ECOSYSTEM_TECHNOLOGIES.filter(t => t.category === cat.id).length;
  }
});
