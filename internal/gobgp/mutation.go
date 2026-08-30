package gobgp

import (
	"context"
	"fmt"
	"net/netip"
	"os/exec"
	"strings"
	"time"
)

type Mutation struct {
	Operation string
	Prefix    string
	Family    string
}

type Mutator struct {
	binary  string
	timeout time.Duration
}

func NewMutator(binary string, timeout time.Duration) *Mutator {
	if binary == "" { binary = "gobgp" }
	if timeout <= 0 { timeout = 10 * time.Second }
	return &Mutator{binary: binary, timeout: timeout}
}

func (m *Mutator) Apply(ctx context.Context, mutation Mutation) error {
	if m == nil { return fmt.Errorf("gobgp mutator is not configured") }
	prefix := strings.TrimSpace(mutation.Prefix)
	if _, err := netip.ParsePrefix(prefix); err != nil { return fmt.Errorf("invalid route prefix: %w", err) }
	family := strings.TrimSpace(mutation.Family)
	if family == "" { family = "ipv4" }
	if family != "ipv4" && family != "ipv6" { return fmt.Errorf("unsupported address family: %s", family) }

	var action string
	switch mutation.Operation {
	case "ADD": action = "add"
	case "REMOVE": action = "del"
	default: return fmt.Errorf("unsupported mutation operation: %s", mutation.Operation)
	}

	ctx, cancel := context.WithTimeout(ctx, m.timeout)
	defer cancel()
	cmd := exec.CommandContext(ctx, m.binary, "global", "rib", "-a", family, action, prefix)
	if out, err := cmd.CombinedOutput(); err != nil {
		return fmt.Errorf("gobgp route %s failed: %w: %s", action, err, strings.TrimSpace(string(out)))
	}
	return nil
}
