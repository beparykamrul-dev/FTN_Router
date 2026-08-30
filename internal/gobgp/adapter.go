package gobgp

import (
	"context"
	"fmt"

	api "github.com/osrg/gobgp/v3/api"
	gobgp "github.com/osrg/gobgp/v3/pkg/server"
)

type Client interface {
	GetRIB(context.Context, *api.GetRibRequest) (*api.GetRibResponse, error)
	GetNeighbor(context.Context, *api.GetNeighborRequest) (*api.GetNeighborResponse, error)
}

type Adapter struct {
	client Client
}

func New(client Client) *Adapter { return &Adapter{client: client} }

func (a *Adapter) ReadRIB(ctx context.Context, family api.Family_Afi) (*api.GetRibResponse, error) {
	if a == nil || a.client == nil { return nil, fmt.Errorf("gobgp client is not configured") }
	return a.client.GetRIB(ctx, &api.GetRibRequest{Family: &api.Family{Afi: family}})
}

func (a *Adapter) ReadNeighbor(ctx context.Context, address string) (*api.GetNeighborResponse, error) {
	if a == nil || a.client == nil { return nil, fmt.Errorf("gobgp client is not configured") }
	return a.client.GetNeighbor(ctx, &api.GetNeighborRequest{Address: address})
}

// NewLocalServer provides a real GoBGP server client for integration environments.
// It intentionally does not start the server or mutate routing state.
func NewLocalServer() *gobgp.BgpServer { return gobgp.NewBgpServer() }
