package gobgp

import (
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
	"time"
)

type RuntimeConfig struct {
	Binary  string
	Timeout time.Duration
}

func DefaultRuntimeConfig() RuntimeConfig {
	return RuntimeConfig{Binary: "gobgp", Timeout: 5 * time.Second}
}

type RuntimeProbe struct {
	cfg RuntimeConfig
}

func NewRuntimeProbe(cfg RuntimeConfig) *RuntimeProbe {
	if cfg.Binary == "" { cfg.Binary = "gobgp" }
	if cfg.Timeout <= 0 { cfg.Timeout = 5 * time.Second }
	return &RuntimeProbe{cfg: cfg}
}

func (p *RuntimeProbe) command(ctx context.Context, args ...string) ([]byte, error) {
	if p == nil { return nil, fmt.Errorf("gobgp runtime probe is not configured") }
	ctx, cancel := context.WithTimeout(ctx, p.cfg.Timeout)
	defer cancel()
	cmd := exec.CommandContext(ctx, p.cfg.Binary, args...)
	out, err := cmd.Output()
	if err != nil {
		if ctx.Err() != nil { return nil, fmt.Errorf("gobgp command timeout: %w", ctx.Err()) }
		return nil, fmt.Errorf("gobgp command failed: %w", err)
	}
	return out, nil
}

func (p *RuntimeProbe) ReadGlobalRIB(ctx context.Context) (json.RawMessage, error) {
	out, err := p.command(ctx, "global", "rib", "-j")
	if err != nil { return nil, err }
	if !json.Valid(out) { return nil, fmt.Errorf("gobgp returned invalid JSON for global RIB") }
	return json.RawMessage(out), nil
}

func (p *RuntimeProbe) ReadNeighbors(ctx context.Context) (json.RawMessage, error) {
	out, err := p.command(ctx, "neighbor", "-j")
	if err != nil { return nil, err }
	if !json.Valid(out) { return nil, fmt.Errorf("gobgp returned invalid JSON for neighbors") }
	return json.RawMessage(out), nil
}

func (p *RuntimeProbe) Healthy(ctx context.Context) error {
	_, err := p.command(ctx, "global", "rib", "-j")
	return err
}

func EndpointArgs(endpoint string) []string {
	endpoint = strings.TrimSpace(endpoint)
	if endpoint == "" { return nil }
	return []string{"-u", endpoint}
}
