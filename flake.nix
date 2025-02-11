{
  description = "Bakanda flake";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs";

  outputs = { self, nixpkgs }: {
    devShell = {
      x86_64-linux = let
        pkgs = import nixpkgs {
          system = "x86_64-linux";
        };
      in pkgs.mkShell {
        buildInputs = [
          pkgs.bun
        ];
      };

      aarch64-darwin = let
        pkgs = import nixpkgs {
          system = "aarch64-darwin";
        };
      in pkgs.mkShell {
        buildInputs = [
          pkgs.bun
        ];
      };
    };
  };
}