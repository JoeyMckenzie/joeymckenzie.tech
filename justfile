default: clippy

# install dependencies for React and Laravel
clippy:
    cargo watch -x clippy
