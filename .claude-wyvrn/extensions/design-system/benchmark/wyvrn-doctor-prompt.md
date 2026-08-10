# Benchmark prompt: Wyvrn Doctor

A/B protocol to measure what `/wyvrn-apply-design synapse` changes, using one functional prompt with ZERO visual instructions. Run A (control): fresh Vite project, no harness, paste the prompt. Run B: fresh project, `claude-wyvrn setup`, `/wyvrn-apply-design synapse`, then `/flow` + the exact same prompt. Compare screenshots, run `/wyvrn-design-audit --full` on both (Run A's violation count is the metric), keep model and iteration count identical, and never mention Razer or design in Run A follow-ups.

## The prompt

```text
Build "Wyvrn Doctor", a small single-page web app that shows the health of my local Wyvrn dev stack at a glance.

Stack: Vite + React + TypeScript + Tailwind CSS v4. No backend: the browser probes everything itself.

Services to monitor (the registry, hardcoded as a typed constant):
- Razer Experience Service: WebSocket, ports 8070-8100 (first responding port wins)
- Chroma MessageHub: WebSocket, port 9270
- Biosensing platform: WebSocket, port 8071
- Biosensing demos: WebSocket, ports 8072-8076
- Wyvrn blog backend: HTTP GET, port 3001
- Vite dev apps (rcrgb / poppin): HTTP GET, ports 5173 and 5174

Probe logic:
- WebSocket probes connect to ws://localhost:<port>/ and request the "wyvrn.v1" subprotocol. A connection only counts as UP if the server echoes the subprotocol back; when it does, send a GetVersion message and show the reported version if one comes back within 2 seconds.
- HTTP probes count as UP on any response.
- Each service ends up in one of three states: up (responding with valid handshake), degraded (port open but wrong/no handshake), down (no response). Timeout: 3 seconds.

Features:
- A table listing every service: name, port(s), state, version when known, and last-checked time.
- Clicking a row selects it and shows a detail panel: which ports were tried, what each returned, and the failure reason when down.
- A "Probe again" button that re-runs all probes; it is disabled while a probe cycle is running.
- A "Copy report" button that puts a plain-text summary of all states on the clipboard.
- A search field to filter services by name or port.
- A dropdown to filter by state (all / up / degraded / down).
- An auto-refresh toggle that re-probes every 15 seconds while on.
- A header with the app name and a one-line subtitle, plus an overall count (e.g. 4/6 services up).

Keep the code small and readable: one page, a few components, a useProbes hook owning the probe state machine. Write a couple of tests for the probe state logic (mock the WebSocket).
```
