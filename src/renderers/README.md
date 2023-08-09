# Renderers

This is a slight revamp of the architecture, to make it easier to change how the "Now Playing" event is rendered.

Each renderer has a `start` method, which is responsible for keeping a (presumably external) service in-sync with the cached application state.

However, it's not currently used.