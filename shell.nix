{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.nodePackages.npm
    pkgs.elixir
    pkgs.erlang
    pkgs.postgresql
    pkgs.inotify-tools
  ];

  shellHook = ''
    echo "Installing Node.js project dependencies..."
    (cd ui/sundropfrontier.io && npm install)

    echo "Setting up Elixir project dependencies..."
    (cd server/api.sundropfrontier.io/sundropfrontier && mix local.hex --force && mix local.rebar --force && mix deps.get)

    echo "Ready to develop!"
  '';
}

