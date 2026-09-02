export interface RepoItem {
  id: string;
  name: string;
  repo: string;
  stars: number;
  forks: number;
  language: string;
  category: 'telemetry' | 'overlay' | 'kernel' | 'ai' | 'dns' | 'web3' | 'storage' | 'admin';
  categoryLabel: string;
  updated: string;
  description: string;
  tags: string[];
  features: string[];
  protocolOrEngine?: string;
  fullMeshSupport?: 'Yes (Native)' | 'No (Tree/Star)' | 'Tunnel Proxy' | 'P2P DHT' | 'N/A';
  useCase?: string;
  configSnippet?: string;
  commandDemo?: string;
  status: 'active' | 'synced' | 'monitored' | 'standby';
}

export interface ProtocolComparison {
  name: string;
  coreFeature: string;
  fullMesh: string;
  useCase: string;
  throughput: string;
  encryption: string;
  status: 'Production' | 'Experimental' | 'High-Speed';
}

export const PROTOCOL_COMPARISONS: ProtocolComparison[] = [
  {
    name: 'Sing-box',
    coreFeature: 'Universal proxy core, multi-protocol router & TUN routing',
    fullMesh: 'No (Star / Tree / Rule-based proxy)',
    useCase: 'Client-side bypass, DPI circumvention, granular proxy routing',
    throughput: '9.8 Gbps (Zero-copy)',
    encryption: 'TLS 1.3 / Reality / VLESS / Shadowsocks',
    status: 'Production'
  },
  {
    name: 'NetBird / Tailscale',
    coreFeature: 'Zero-Trust Overlay Network & WireGuard NAT Traversal',
    fullMesh: 'Yes (Native peer-to-peer full-mesh DERP fallback)',
    useCase: 'Secure remote access, VPC interconnect, edge nodes mesh',
    throughput: '7.4 Gbps',
    encryption: 'WireGuard (Noise Protocol / ChaCha20-Poly1305)',
    status: 'Production'
  },
  {
    name: 'Nebula',
    coreFeature: 'Global scale secure overlay network, lighthouse discovery',
    fullMesh: 'Yes (Native full-mesh with direct lighthouse peering)',
    useCase: 'Enterprise multi-cloud & low-latency server interconnect',
    throughput: '6.9 Gbps',
    encryption: 'Noise Protocol (AES-256-GCM / ChaCha20)',
    status: 'Production'
  },
  {
    name: 'Hysteria2 / TUIC',
    coreFeature: 'Custom QUIC-based congestion control (Brutal CC / BBR)',
    fullMesh: 'Proxy tunnel (Client-to-Server / Relay)',
    useCase: 'High-loss & high-jitter WAN links, ultra-fast video/stream',
    throughput: '12.4 Gbps (Brutal Mode)',
    encryption: 'TLS 1.3 / QUIC UDP',
    status: 'High-Speed'
  },
  {
    name: 'cjdns',
    coreFeature: 'Encrypted IPv6 public-key DHT routing network',
    fullMesh: 'P2P DHT Autonomous Mesh',
    useCase: 'Decentralized darknet, cryptographically allocated IPv6 (fc00::/8)',
    throughput: '4.2 Gbps',
    encryption: 'Curve25519 + Poly1305 / Salsa20',
    status: 'Experimental'
  },
  {
    name: 'AetherST / Aether Core',
    coreFeature: 'Multi-Protocol VPN (MASQUE, WireGuard, Gool, HEV SOCKS5)',
    fullMesh: 'Hybrid Zero-Trust Mesh',
    useCase: 'Android/Edge modern UI, anti-censorship, MASQUE HTTP/3 tunnels',
    throughput: '8.1 Gbps',
    encryption: 'MASQUE QUIC / WireGuard',
    status: 'Production'
  },
  {
    name: 'ZeroTier One',
    coreFeature: 'Virtual Ethernet switch for Earth, Layer-2 SDN overlay',
    fullMesh: 'Yes (Layer-2 global Ethernet mesh)',
    useCase: 'Microsegmentation, multi-cloud LAN bridge, IoT telemetry',
    throughput: '6.5 Gbps',
    encryption: 'Salsa20 / Curve25519',
    status: 'Production'
  }
];

export const STACK_REPOSITORIES: RepoItem[] = [
  // Telemetry & Flow
  {
    id: 'rustflow',
    name: 'meirdev / rustflow',
    repo: 'https://github.com/meirdev/rustflow',
    stars: 1,
    forks: 0,
    language: 'Rust',
    category: 'telemetry',
    categoryLabel: 'Telemetry & Flow',
    updated: '1 hour ago',
    description: 'High-performance, modern flow collector (NetFlow v5/v9, IPFIX, sFlow) written in pure async Rust with Tokio.',
    tags: ['NetFlow', 'IPFIX', 'sFlow', 'Rust', 'Tokio', 'Flow Collector'],
    features: ['Async zero-copy packet parsing', 'Multi-thread SIMD aggregation', 'Prometheus & Influx exporter', 'Kafka streaming output'],
    protocolOrEngine: 'NetFlow v5/v9 & IPFIX',
    commandDemo: 'rustflow --listen 0.0.0.0:2055 --export prometheus:9100 --workers 16',
    status: 'active'
  },
  {
    id: 'cert-netsa-yaf',
    name: 'britram / cert-netsa-yaf',
    repo: 'https://github.com/britram/cert-netsa-yaf',
    stars: 3,
    forks: 1,
    language: 'C',
    category: 'telemetry',
    categoryLabel: 'Telemetry & Flow',
    updated: 'Jan 28, 2019',
    description: 'Yet Another Flowmeter (YAF): CERT/NetSA high-precision bidirectional flow generator with DPI payload plugin (dpacketplugin).',
    tags: ['YAF', 'NetSA', 'CERT', 'DPI', 'IPFIX', 'BiFlow'],
    features: ['Bidirectional flow aggregation', 'dpacketplugin deep inspection', 'Entropy & SSL fingerprinting', 'SiLK rwflowpack compatibility'],
    protocolOrEngine: 'CERT NetSA YAF / SiLK',
    commandDemo: 'yaf --in eth0 --out /var/log/yaf/flows.yaf --plugin=/usr/lib/yaf/dpacketplugin.so',
    status: 'active'
  },
  {
    id: 'silk-analysis',
    name: 'cmusei / silk_analysis',
    repo: 'https://github.com/cmusei/silk_analysis',
    stars: 8,
    forks: 2,
    language: 'Python / Perl',
    category: 'telemetry',
    categoryLabel: 'Telemetry & Flow',
    updated: 'Recent',
    description: 'System for Internet-Level Knowledge (SiLK) analysis toolsuite: rwflowpack, rwfilter, rwstats for carrier-grade multi-terabyte flow analytics.',
    tags: ['SiLK', 'rwflowpack', 'rwfilter', 'Traffic Analysis', 'Carrier-Grade'],
    features: ['Historical multi-petabyte query', 'Top-N talkers by AS/Port', 'DDoS anomaly detection', 'BGP prefix correlation'],
    protocolOrEngine: 'SiLK Flow Engine',
    commandDemo: 'rwfilter --proto=6 --pass=stdout | rwstats --fields=dip,sport --top=10',
    status: 'active'
  },
  {
    id: 'goflow2-pmacct',
    name: 'netsa / GoFlow2 & pmacct Engine',
    repo: 'https://github.com/netsampler/goflow2',
    stars: 1850,
    forks: 320,
    language: 'Go',
    category: 'telemetry',
    categoryLabel: 'Telemetry & Flow',
    updated: 'Active',
    description: 'Scalable NetFlow v5/v9, IPFIX & sFlow pipeline with BGP/BMP route augmentation, ClickHouse & Elasticsearch sinks.',
    tags: ['GoFlow2', 'pmacct', 'ClickHouse', 'BGP BMP', 'Kafka'],
    features: ['10M flows/sec ingestion', 'Autonomous system tagging', 'MPLS / VXLAN inner header decoding', 'Real-time Grafana feeds'],
    protocolOrEngine: 'GoFlow2 / pmacct',
    commandDemo: 'goflow2 -listen netflow://:2055 -format json -transport file',
    status: 'active'
  },

  // Overlay & Zero-Trust SDN
  {
    id: 'cjdns',
    name: 'cjdelisle / cjdns',
    repo: 'https://github.com/cjdelisle/cjdns',
    stars: 5408,
    forks: 601,
    language: 'C',
    category: 'overlay',
    categoryLabel: 'Overlay & Zero-Trust SDN',
    updated: 'Jul 9',
    description: 'An encrypted IPv6 network using public-key cryptography for automatic address allocation and distributed hash table routing.',
    tags: ['cjdns', 'Mesh', 'IPv6', 'Crypto-Routing', 'P2P DHT'],
    features: ['Cryptographic IPv6 fc00::/8', 'Zero-config routing', 'Self-healing mesh topology', 'Source-routed switching'],
    protocolOrEngine: 'cjdns DHT Switch',
    fullMeshSupport: 'P2P DHT',
    useCase: 'Encrypted global overlay without central CA',
    commandDemo: 'cjdroute --genconf > /etc/cjdroute.conf && cjdroute < /etc/cjdroute.conf',
    status: 'active'
  },
  {
    id: 'aetherst',
    name: 'immaghzbad / AetherST',
    repo: 'https://github.com/immaghzbad/AetherST',
    stars: 319,
    forks: 36,
    language: 'Kotlin',
    category: 'overlay',
    categoryLabel: 'Overlay & Zero-Trust SDN',
    updated: 'Yesterday',
    description: 'Advanced Multi-Protocol VPN Client for Android & Edge (MASQUE, WireGuard, Gool, Zero Trust) powered by Aether Core and HEV SOCKS5 engine.',
    tags: ['MASQUE', 'WireGuard', 'Zero-Trust', 'HEV SOCKS5', 'DPI Bypass', 'Android'],
    features: ['HTTP/3 MASQUE tunneling', 'HEV SOCKS5 high-throughput proxy', 'Granular per-app routing', 'Anti-DPI TLS fingerprint masquerade'],
    protocolOrEngine: 'Aether Core / MASQUE',
    fullMeshSupport: 'Hybrid Zero-Trust Mesh',
    useCase: 'Next-gen mobile and edge zero-trust client',
    status: 'active'
  },
  {
    id: 'zerotier-one',
    name: 'zerotier / ZeroTierOne',
    repo: 'https://github.com/zerotier/ZeroTierOne',
    stars: 17057,
    forks: 1973,
    language: 'C++',
    category: 'overlay',
    categoryLabel: 'Overlay & Zero-Trust SDN',
    updated: 'Last month',
    description: 'A Smart Ethernet Switch for Earth. Creates secure Layer-2 virtual networks across WANs, clouds, and embedded hardware.',
    tags: ['ZeroTier', 'SDN', 'L2 Mesh', 'Zero-Trust', 'Virtual Switch'],
    features: ['End-to-end 256-bit encryption', 'Global moon routing nodes', 'Flow rule firewall rules engine', 'Bridging physical LAN to cloud'],
    protocolOrEngine: 'ZeroTier Layer-2 VNI',
    fullMeshSupport: 'Yes (Native)',
    useCase: 'Multi-datacenter L2 LAN stretch and secure interconnect',
    commandDemo: 'zerotier-cli join 8056c2e21c000001 && zerotier-cli listnetworks',
    status: 'active'
  },
  {
    id: 'singbox-hysteria',
    name: 'SagerNet / Sing-box & Hysteria2 Core',
    repo: 'https://github.com/SagerNet/sing-box',
    stars: 21400,
    forks: 2800,
    language: 'Go',
    category: 'overlay',
    categoryLabel: 'Overlay & Zero-Trust SDN',
    updated: 'Recent',
    description: 'Universal proxy platform with native TUN stack, supporting Hysteria2 (Brutal CC), TUIC, VLESS Reality, WireGuard, and Shadowsocks.',
    tags: ['Sing-box', 'Hysteria2', 'TUIC', 'VLESS', 'Brutal CC', 'Anti-Censorship'],
    features: ['WireGuard + AmneziaWG obfuscation', 'Brutal Congestion Control for 50%+ loss links', 'Direct gRPC/QUIC multiplexing', 'GeoIP & GeoSite DNS matching'],
    protocolOrEngine: 'Sing-box Universal Core',
    fullMeshSupport: 'No (Tree/Star)',
    useCase: 'High-speed encrypted border transit & carrier bypass',
    status: 'active'
  },

  // Kernel, Acceleration & Low-Level Network
  {
    id: 'ovs-l7-filter',
    name: 'mortrevere / ovs-l7-filter',
    repo: 'https://github.com/mortrevere/ovs-l7-filter',
    stars: 7,
    forks: 3,
    language: 'Python / C',
    category: 'kernel',
    categoryLabel: 'Kernel, Routing & Hardware Accel',
    updated: 'Jul 10, 2019',
    description: 'Layer 7 switch firewall based on Open vSwitch, Ryu SDN controller, and l7-filter pattern matchers for DPI packet tagging.',
    tags: ['Open vSwitch', 'Ryu', 'L7 Filter', 'SDN', 'DPI Firewall'],
    features: ['Hardware-assisted flow table rules', 'Application-level signature match', 'QoS DSCP prioritization', 'Low CPU kernel offload'],
    protocolOrEngine: 'Open vSwitch + Ryu',
    commandDemo: 'ovs-ofctl add-flow br0 priority=500,dl_type=0x0800,action=output:1',
    status: 'active'
  },
  {
    id: 'hw-encoder-x',
    name: 'MacRimi / HWEncoderX',
    repo: 'https://github.com/MacRimi/HWEncoderX',
    stars: 25,
    forks: 2,
    language: 'Shell',
    category: 'kernel',
    categoryLabel: 'Kernel, Routing & Hardware Accel',
    updated: 'Feb 2, 2025',
    description: 'High-performance video transcoding to H.265 using hardware acceleration (VAAPI, NVENC, and Intel QSV) for live camera & IPTV streams.',
    tags: ['VAAPI', 'NVENC', 'Intel QSV', 'H.265', 'IPTV', 'Hardware Transcode'],
    features: ['Zero-copy GPU pipeline', 'Ultra low latency 4K/60fps transcode', 'Multi-channel edge stream packager', 'CPU utilization < 5%'],
    protocolOrEngine: 'VAAPI / NVENC / QSV',
    commandDemo: 'hwencoderx -i /dev/video0 -c:v hevc_vaapi -b:v 4M -o udp://239.255.1.1:5000',
    status: 'active'
  },
  {
    id: 'android-tweaker',
    name: 'harusharu / AndroidTweaker',
    repo: 'https://github.com/harusharu/AndroidTweaker',
    stars: 70,
    forks: 23,
    language: 'Shell',
    category: 'kernel',
    categoryLabel: 'Kernel, Routing & Hardware Accel',
    updated: '3 weeks ago',
    description: 'Kernel and network performance enhancer: OOM Killer tuning, TCP BBR pacing, memory compaction, and CPU governor optimization.',
    tags: ['Kernel Tuning', 'OOM Killer', 'TCP BBR', 'Low Latency', 'Magisk'],
    features: ['OOM killer avoidance on high throughput', 'TCP BBR v3 bufferbloat reduction', 'Jumbo frames memory alignment', 'Interrupt affinity pinning'],
    protocolOrEngine: 'Linux Sysctl & Kernel Pacing',
    commandDemo: 'sysctl -w net.ipv4.tcp_congestion_control=bbr net.core.rmem_max=67108864',
    status: 'active'
  },
  {
    id: 'lowlevel-kernel-sock',
    name: 'ftn / Low-Level Kernel & CAN_RAW',
    repo: 'https://github.com/torvalds/linux',
    stars: 182000,
    forks: 54000,
    language: 'C',
    category: 'kernel',
    categoryLabel: 'Kernel, Routing & Hardware Accel',
    updated: 'Live',
    description: 'Low-level kernel primitives: SOCK_RAW, CAN_RAW / can_filter, Kube-OVN, BGP EVPN, FRR, FD.io VPP, and VXLAN hardware encapsulation.',
    tags: ['SOCK_RAW', 'CAN_RAW', 'FD.io VPP', 'BGP EVPN', 'VXLAN', 'FRR', 'IS-IS'],
    features: ['Zero-copy AF_XDP packet ingress', 'FD.io VPP multi-gigabit routing', 'Kernel panic prevention under DDoS', 'CAN bus industrial telemetry'],
    protocolOrEngine: 'Linux Kernel / VPP',
    status: 'active'
  },

  // AI & Voice / Vision
  {
    id: 'whisper-cpp',
    name: 'ggml-org / whisper.cpp',
    repo: 'https://github.com/ggml-org/whisper.cpp',
    stars: 53285,
    forks: 6110,
    language: 'C / C++',
    category: 'ai',
    categoryLabel: 'AI, Speech & Edge Vision',
    updated: '17 hours ago',
    description: 'Port of OpenAI Whisper speech recognition model in pure C/C++ without dependencies. Ultra-fast audio transcription on edge CPUs/GPUs.',
    tags: ['Whisper', 'C++', 'GGML', 'Speech-to-Text', 'Edge AI', 'Bengali/Multi'],
    features: ['AVX2 / NEON SIMD acceleration', 'Real-time audio streaming transcribe', 'Bengali & English voice command parser', 'Low memory footprint (120MB)'],
    protocolOrEngine: 'Whisper GGML Engine',
    commandDemo: './main -m models/ggml-base.bin -f voice_cmd.wav -l bn',
    status: 'active'
  },
  {
    id: 'jumbocontext-cli',
    name: 'jumbocontext / cli',
    repo: 'https://github.com/jumbocontext/cli',
    stars: 268,
    forks: 16,
    language: 'TypeScript',
    category: 'ai',
    categoryLabel: 'AI, Speech & Edge Vision',
    updated: '3 days ago',
    description: 'Memory and Context Orchestration for Coding Agents & Autonomous Network Remediation LLMs.',
    tags: ['Context Engine', 'Agent Memory', 'Orchestration', 'TypeScript', 'LLM'],
    features: ['Vector memory indexing', 'Multi-turn network state recall', 'Diff-aware workspace grounding', 'Fast JSON snapshot import/export'],
    protocolOrEngine: 'Jumbo Context Engine',
    commandDemo: 'jumbo context build --include /var/log/network.log --target ftn-ai',
    status: 'active'
  },
  {
    id: 'pytorch-image-models',
    name: 'DN6 / pytorch-image-models (timm)',
    repo: 'https://github.com/huggingface/pytorch-image-models',
    stars: 32000,
    forks: 4800,
    language: 'Python',
    category: 'ai',
    categoryLabel: 'AI, Speech & Edge Vision',
    updated: 'Feb 20, 2023',
    description: 'PyTorch image models, pretrained weights for vision: ResNet, EfficientNetV2, Vision Transformer, MobileNet-V3, RegNet, and CSPNet.',
    tags: ['PyTorch', 'timm', 'Computer Vision', 'ViT', 'MobileNet', 'Frigate AI'],
    features: ['Edge AI camera object detection', 'Fiber cut visual diagnostic models', 'High FPS low power inference', 'ONNX / TensorRT export'],
    protocolOrEngine: 'PyTorch / TensorRT',
    status: 'active'
  },
  {
    id: 'frigate-ai-doorbin',
    name: 'ftn / Frigate AI NVR & Doorbin X-Ray',
    repo: 'https://github.com/blakeblackshear/frigate',
    stars: 19500,
    forks: 1800,
    language: 'Python / C',
    category: 'ai',
    categoryLabel: 'AI, Speech & Edge Vision',
    updated: 'Recent',
    description: 'Real-time AI NVR, Object Detection, Optical Fiber Node Security, and Network X-Ray telemetry vision engine.',
    tags: ['Frigate NVR', 'Google Coral', 'Vision AI', 'Security Camera', 'Doorbin'],
    features: ['Google Coral TPU acceleration', 'Sub-millisecond motion detection', 'RTSP/WebRTC low latency feeds', 'Automatic license & intrusion logging'],
    protocolOrEngine: 'Frigate NVR + Coral TPU',
    status: 'active'
  },

  // DNS & PKI
  {
    id: 'hickory-dns',
    name: 'hickory-dns / hickory-dns',
    repo: 'https://github.com/hickory-dns/hickory-dns',
    stars: 5390,
    forks: 623,
    language: 'Rust',
    category: 'dns',
    categoryLabel: 'DNS, Anycast & PKI',
    updated: '14 hours ago',
    description: 'Safe, async, high-performance Rust DNS server, resolver, and client with native DoH, DoT, DoQ, and DNSSEC support.',
    tags: ['Hickory DNS', 'Rust', 'DoH', 'DoT', 'DNSSEC', 'Anycast Resolver'],
    features: ['DNS-over-HTTPS (DoH) & DNS-over-QUIC (DoQ)', 'Zero memory vulnerabilities (Rust)', 'Sub-millisecond cache latency', 'Dynamic zone transfer'],
    protocolOrEngine: 'Hickory DNS Core',
    commandDemo: 'hickory-dns --config /etc/hickory.toml --zone ftn.local:db.ftn',
    status: 'active'
  },
  {
    id: 'rawdns',
    name: 'tianon / rawdns',
    repo: 'https://github.com/tianon/rawdns',
    stars: 380,
    forks: 42,
    language: 'Go',
    category: 'dns',
    categoryLabel: 'DNS, Anycast & PKI',
    updated: 'Recent',
    description: 'Raw DNS interface and forwarding gateway for container microservices and hybrid cloud service resolution.',
    tags: ['RawDNS', 'Go', 'Docker DNS', 'Service Discovery', 'Reverse Proxy'],
    features: ['Direct /etc/resolv.conf intercept', 'JSON-configured static forwarders', 'Consul / etcd integration', 'Low overhead Go runtime'],
    protocolOrEngine: 'RawDNS Engine',
    status: 'active'
  },

  // Web3 & Blockchain
  {
    id: 'ethereum-go',
    name: 'ABCDELabs / Understanding-Ethereum-Go',
    repo: 'https://github.com/ABCDELabs/Understanding-Ethereum-Go-version',
    stars: 950,
    forks: 140,
    language: 'Go',
    category: 'web3',
    categoryLabel: 'Web3, Blockchain & DeFi',
    updated: 'Recent',
    description: 'In-depth Go-Ethereum execution client internals, EVM opcode execution pipeline, state trie synchronization, and P2P devp2p wire protocol.',
    tags: ['Geth', 'Go-Ethereum', 'EVM', 'State Trie', 'DevP2P'],
    features: ['EVM opcode tracing', 'Fast block verification', 'JSON-RPC websocket telemetry', 'Custom gas optimization heuristics'],
    protocolOrEngine: 'Go-Ethereum Geth Core',
    status: 'active'
  },
  {
    id: 'evmbench',
    name: 'paradigmxyz / evmbench',
    repo: 'https://github.com/paradigmxyz/evmbench',
    stars: 480,
    forks: 35,
    language: 'Rust / Python',
    category: 'web3',
    categoryLabel: 'Web3, Blockchain & DeFi',
    updated: 'Recent',
    description: 'Comprehensive benchmarking suite for EVM implementations (revm, geth, reth) measuring opcode throughput, state storage, and gas bottlenecks.',
    tags: ['Paradigm', 'EVMbench', 'Reth', 'Revm', 'Benchmark', 'DeFi'],
    features: ['Micro-benchmarking EVM opcodes', 'State cache miss profiling', 'RPC latency comparison', 'Zero-knowledge circuit compatibility'],
    protocolOrEngine: 'Paradigm Revm / Reth',
    commandDemo: 'cargo bench --bench evm_sload_sstore -- --save-baseline main',
    status: 'active'
  },
  {
    id: 'ultimate-defi',
    name: 'OffcierCia / ultimate-defi-research-base',
    repo: 'https://github.com/OffcierCia/ultimate-defi-research-base',
    stars: 3400,
    forks: 410,
    language: 'Markdown / Solidity',
    category: 'web3',
    categoryLabel: 'Web3, Blockchain & DeFi',
    updated: 'Recent',
    description: 'Master knowledgebase and security analysis of DeFi protocols, flashloans, DEX arbitrage, and on-chain risk telemetry.',
    tags: ['DeFi', 'Security', 'MEV', 'Flashloan', 'Arbitrage', 'Smart Contracts'],
    features: ['Mempool frontrunning detection', 'Smart contract vulnerability vectors', 'Oracle manipulation defense', 'Liquidity pool analytics'],
    protocolOrEngine: 'EVM DeFi Analytics',
    status: 'active'
  },

  // Storage, Microservices & Admin
  {
    id: 'proxmox-atlas',
    name: 'Losstarot85 / proxmox-atlas',
    repo: 'https://github.com/Losstarot85/proxmox-atlas',
    stars: 16,
    forks: 1,
    language: 'JavaScript',
    category: 'storage',
    categoryLabel: 'Storage, Infrastructure & Cloud',
    updated: 'Jul 29',
    description: 'Proxmox VE multi-cluster monitoring dashboard providing unified metrics, VM lifecycle, ZFS pool wear, and network interfaces.',
    tags: ['Proxmox VE', 'Cluster Monitoring', 'ZFS', 'LXC', 'Dashboard'],
    features: ['Multi-node CPU & RAM telemetry', 'ZFS storage pool wear indicators', 'Live VM migration tracking', 'Ceph cluster status'],
    protocolOrEngine: 'Proxmox VE REST API',
    status: 'active'
  },
  {
    id: 'polaris-mesh',
    name: 'polarismesh / polaris',
    repo: 'https://github.com/polarismesh/polaris',
    stars: 2559,
    forks: 403,
    language: 'Go',
    category: 'storage',
    categoryLabel: 'Storage, Infrastructure & Cloud',
    updated: 'Oct 14, 2025',
    description: 'Service Discovery and Governance Platform for Microservices and Distributed Architecture across heterogeneous clouds.',
    tags: ['Polaris', 'Service Discovery', 'Service Mesh', 'Rate Limiting', 'Circuit Breaker'],
    features: ['Dynamic traffic routing & Canary releases', 'Distributed rate limiting (Drip Policy)', 'Health checking & auto-isolation', 'gRPC & HTTP gateway'],
    protocolOrEngine: 'Polaris Service Governance',
    status: 'active'
  },
  {
    id: 'pgbouncer-edge',
    name: 'ftn / PgBouncer & Memory-to-Memory Edge Cache',
    repo: 'https://github.com/pgbouncer/pgbouncer',
    stars: 3100,
    forks: 620,
    language: 'C',
    category: 'storage',
    categoryLabel: 'Storage, Infrastructure & Cloud',
    updated: 'Active',
    description: 'High-speed PostgreSQL connection pooler delivering memory-to-memory edge caching, 60% backend traffic offload, and sub-millisecond query routing.',
    tags: ['PgBouncer', 'PostgreSQL', 'Edge Cache', '60% Offload', 'Drip Policy'],
    features: ['Transaction & session pooling', '60%+ backend DB offload', 'Drip rate limiting policy', 'Memory zero-copy socket dispatch'],
    protocolOrEngine: 'PgBouncer + Edge Redis',
    commandDemo: 'pgbouncer -d /etc/pgbouncer/pgbouncer.ini -u postgres',
    status: 'active'
  },
  {
    id: 'vue-element-admin',
    name: 'PanJiaChen / vue-element-admin',
    repo: 'https://github.com/PanJiaChen/vue-element-admin',
    stars: 90199,
    forks: 30334,
    language: 'Vue / JS',
    category: 'admin',
    categoryLabel: 'Admin, UI & Web Engines',
    updated: 'Oct 24, 2024',
    description: 'Production-ready front-end admin dashboard framework with rich components, RBAC authorization, and dynamic breadcrumbs.',
    tags: ['Vue', 'Element UI', 'Admin Template', 'RBAC', 'Enterprise UI'],
    features: ['Dynamic permission routing', 'Data export to Excel/ZIP', 'Customizable dark/light themes', 'Mock API gateway'],
    protocolOrEngine: 'Vue.js + Element UI',
    status: 'active'
  },
  {
    id: 'gohugoio-hugo',
    name: 'gohugoio / hugo',
    repo: 'https://github.com/gohugoio/hugo',
    stars: 89618,
    forks: 8354,
    language: 'Go',
    category: 'admin',
    categoryLabel: 'Admin, UI & Web Engines',
    updated: '2 hours ago',
    description: 'The world fastest framework for building websites and edge documentation portals with millisecond build times.',
    tags: ['Hugo', 'Go', 'Static Site', 'Edge CDN', 'Speed'],
    features: ['< 1ms per page build speed', 'Markdown & Shortcode rendering', 'Multilingual support', 'Built-in asset minification'],
    protocolOrEngine: 'Hugo Go Engine',
    commandDemo: 'hugo server --watch --bind 0.0.0.0 -p 1313',
    status: 'active'
  }
];

export const STACK_LISTS = [
  { id: 'all', name: 'All Repositories', count: 53, color: '#00f0ff' },
  { id: 'mystack', name: '🚀 My Stack', count: 53, color: '#00ff66' },
  { id: 'telemetry', name: 'Monitoring & Telemetry', count: 15, color: '#3b82f6' },
  { id: 'ai', name: 'AI & Speech/Vision', count: 11, color: '#a855f7' },
  { id: 'fibermap', name: 'Fiber Map & GIS', count: 8, color: '#10b981' },
  { id: 'tv', name: 'IPTV, Video & Transcoding', count: 8, color: '#f59e0b' },
  { id: 'overlay', name: 'Zero-Trust & Overlay Mesh', count: 12, color: '#ec4899' },
  { id: 'kernel', name: 'Kernel, VPP & Accel', count: 9, color: '#6366f1' },
  { id: 'dns', name: 'Anycast DNS & PKI', count: 7, color: '#14b8a6' },
  { id: 'web3', name: 'Web3 & DeFi Research', count: 6, color: '#eab308' },
  { id: 'wpk', name: 'WPK SC & Packages', count: 3, color: '#8b5cf6' },
  { id: 'mikrosoft', name: 'Core Microservices', count: 3, color: '#06b6d4' },
];
