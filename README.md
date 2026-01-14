<h1 align="center" id="title">frogstar</h1>
<div align="center">

![FROGSTAR](https://img.shields.io/badge/FROGSTAR-Workout%20Management-blue?style=for-the-badge)
[![Buy Me A Coffee](https://img.shields.io/badge/Support-Buy%20Me%20A%20Coffee-orange?style=for-the-badge)](https://buymeacoffee.com/joemaddalone)

</div>

> **Note**
> Frogstar is a self-hosted mobile-friendly app for scheduling, tracking, and logging of weightlifting sessions.

<img width="433" height="873" alt="Image" src="https://github.com/user-attachments/assets/2f7cc4a4-36fe-41d9-912e-d85f9621a9fb" />

## Features

- Backup/Export/Import data
- Log sets
- Plate calculator
- Schedule workouts
- Track progress
- Warmup suggestions

## Deployment Guide

### Docker Deployment

docker-compose.yml example

```yaml
services:
  frogstar:
    image: ghcr.io/joemaddalone/frogstar:latest
    # add platform as needed for your system
    # platform: linux/amd64
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
