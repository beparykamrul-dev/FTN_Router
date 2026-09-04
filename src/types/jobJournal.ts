export type JobStatus = 
  | 'pending' 
  | 'scheduled' 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'retrying' 
  | 'blocked' 
  | 'paused';

export type JobCategory = 
  | 'bgp-routing' 
  | 'dns-cache' 
  | 'backup-vault' 
  | 'olt-firmware' 
  | 'ai-anomaly' 
  | 'billing-recon' 
  | 'pki-rekey' 
  | 'wireguard-mesh' 
  | 'ipam-sync';

export type JobPriority = 'critical' | 'high' | 'medium' | 'low';

export interface JobStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  logSummary?: string;
}

export interface JobArtifact {
  name: string;
  sizeBytes: number;
  mimeType: string;
  sha256: string;
  downloadUrl?: string;
}

export interface JobExecutionRecord {
  id: string;
  name: string;
  description: string;
  category: JobCategory;
  triggerType: 'autonomous' | 'manual' | 'cron' | 'webhook' | 'event_bus';
  priority: JobPriority;
  status: JobStatus;
  progressPct: number;
  currentStepIndex: number;
  steps: JobStep[];
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  scheduledNext?: string;
  retryCount: number;
  maxRetries: number;
  executorNode: string;
  targetContainers: string[];
  exitCode?: number;
  outputSummary?: string;
  errorDetails?: string;
  cpuUsagePct: number;
  memoryUsageMb: number;
  logs: string[];
  artifacts?: JobArtifact[];
  telemetryDiff?: {
    metric: string;
    before: number | string;
    after: number | string;
    unit: string;
  }[];
}

export interface JobMetricsSummary {
  totalJobs: number;
  runningCount: number;
  completedCount: number;
  failedCount: number;
  successRatePct: number;
  avgDurationSec: number;
  totalAutonomousRuns24h: number;
}
