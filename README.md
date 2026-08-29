# Khawrizm Sovereign

A repository containing static HTML frontends, a small Express backend, and several Git submodules.

## Verified runtime

The directly runnable backend is `2_Backend/server.js`.

It exposes:

- `GET /health`
- `GET /api`
- `POST /api/ai/generate`
- `GET /api/config`

The backend sends generation requests to the configured Ollama HTTP endpoint. It validates the request body, limits JSON request size, applies a 120-second provider timeout, rejects unsupported streaming, validates the provider response, and returns provider errors as gateway errors.

## Repository layout

`1_Frontend/` contains standalone HTML documents, including archived copies under `1_Frontend/Old_Versions/`.

`2_Backend/` contains the Express backend, its package manifest and lockfile, and the backend Dockerfile.

`src/` contains TypeScript engine-oriented code and tests, but the current repository tree does not contain a root `package.json`, root `tsconfig.json`, or root build configuration connecting this TypeScript code to a runnable application.

The repository also contains three Git submodules:

- `casper-core`
- `k-forge`
- `niyah-core`

Their contents are external to this repository tree and are not treated as verified local implementation here.

## Backend configuration

The backend reads:

```text
NODE_ENV
PORT
AI_MODEL
OLLAMA_URL
MAX_BODY_BYTES
```

A template is provided in `.env.example`.

The backend does not currently use the MariaDB schema for request handling.

## Containers

`docker-compose.yml` currently defines MariaDB, the backend, and Ollama. Host bindings are restricted to loopback. Database credentials are required through environment variables rather than committed defaults.

## Security boundary

The current repository does not provide source-level evidence for the security guarantees previously described in older documentation, including Ed25519 authentication, Argon2id password hashing, TLS termination, QEMU isolation on the application runtime path, or tamper-evident AI audit logging.

The TypeScript `SovereignBridge` source contains child-process and QEMU-management code, but no active caller was established in the repository audit. Its existence alone is not treated as proof that the backend or frontend runtime uses it as a security boundary.

The TypeScript session cleaner contains AES-GCM encryption for in-memory session export, but no active runtime integration was established in the repository audit.

## Testing and verification

The GitHub repository currently exposes no CI check runs for the audited final commit. Local execution of tests, type checking, and builds is not represented as successful unless actually run in an execution environment.

## License

See `LICENSE` for the repository's governing license text.
