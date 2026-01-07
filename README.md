<h1 align="center" id="title">frogstar</h1>
<div align="center">

![FROGSTAR](https://img.shields.io/badge/FROGSTAR-Workout%20Management-blue?style=for-the-badge)
[![Buy Me A Coffee](https://img.shields.io/badge/Support-Buy%20Me%20A%20Coffee-orange?style=for-the-badge)](https://buymeacoffee.com/joemaddalone)

</div>

> **Note**
> Frogstar is a self-hosted mobile-friendly app for scheduling, tracking, and logging of weightlifting sessions. This app is a variation on an app I have been running locally for years and I find the minimalistic functionality to be optimally sufficient. This application is currently in development.

## Features

- Schedule workouts
- Log sets
- Plate calculator
- Warmup suggestions

TODO

- Track progress
- Backup/Export/Import data

## Deployment Guide

### Docker Deployment

docker-compose.yml example

```yaml
services:
  frogstar:
    image: ghcr.io/joemaddalone/frogstar:latest
    container_name: frogstar
    restart: unless-stopped
    ports:
      - "3033:3000"
    volumes:
      - ./my-data:/app/data
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Support the Project

Your support helps maintain and improve this project! Please consider:

- [Buy me a coffee](https://www.buymeacoffee.com/joemaddalone)
