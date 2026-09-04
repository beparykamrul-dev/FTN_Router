export type IpVersion = 'ipv4' | 'ipv6';

export type SubnetType = 
  | 'supernet' 
  | 'pppoe_pool' 
  | 'olt_pon' 
  | 'infra_mgmt' 
  | 'public_server' 
  | 'point_to_point' 
  | 'loopback' 
  | 'nat_cgnat';

export interface DeviceBinding {
  deviceType: 'OLT' | 'Core Router' | 'Edge BRAS' | 'DataCenter Switch' | 'Firewall';
  deviceName: string;
  managementIp: string;
  vendor: 'MikroTik' | 'Huawei' | 'ZTE' | 'BDCOM' | 'Cisco' | 'FTN-Engine';
  interfaceOrPonPort: string;
  vlanId: number;
}

export interface IpAllocation {
  id: string;
  ipAddress: string;
  ipVersion: IpVersion;
  macAddress?: string;
  hostname?: string;
  subscriberId?: string;
  onuSerial?: string;
  assignedTo: string;
  leaseType: 'static' | 'pppoe' | 'dhcp' | 'slaac';
  status: 'active' | 'reserved' | 'expired' | 'conflict';
  assignedAt: string;
  expiresAt?: string;
}

export interface IpSubnetPool {
  id: string;
  name: string;
  cidr: string;
  ipVersion: IpVersion;
  subnetType: SubnetType;
  gateway: string;
  networkAddress: string;
  broadcastAddress?: string;
  subnetMask: string;
  prefixLength: number;
  totalAddresses: number;
  usedAddresses: number;
  reservedAddresses: number;
  freeAddresses: number;
  utilizationPct: number;
  vlanId: number;
  binding: DeviceBinding;
  status: 'active' | 'exhausted' | 'warning' | 'deprecated';
  dnsServers: string[];
  dhcpEnabled: boolean;
  pppoeProfile?: string;
  allocations: IpAllocation[];
  notes?: string;
}

export interface IpamStats {
  totalIpv4Pools: number;
  totalIpv6Pools: number;
  totalAssignedIps: number;
  ipv4UtilizationPct: number;
  ipv6UtilizationPct: number;
  activeOltBindings: number;
  activeRouterBindings: number;
  detectedConflicts: number;
}
