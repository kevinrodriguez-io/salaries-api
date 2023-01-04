# Clipboard Health Test Submission

Built with ❤️ by Kevin Rodríguez.

## Overview

Built with next.js and typescript. Uses docker-compose to run the app locally.

### Api routes:

- `/api/v1/health` - Health check
- `/api/v1/auth` - POST: { username: string, password: string }
- `/api/v1/salary` - POST: ```{
    name: string;
    salary: number;
    currency: string;
    department: string;
    sub_department: string;
}```
- `/api/v1/[:name]` - DELETE
- `/api/v1/summary-statistics` - GET - Returns summary statistics
- `/api/v1/summary-statistics?onContract=true` - GET - Returns summary statistics for on contract
- `/api/v1/summary-statistics?allDepartments=true` - GET - Returns summary statistics grouped by department
- `/api/v1/summary-statistics?allDepartments=true&allSubdepartments=true` - GET - Returns summary statistics grouped by department and by subdepartment
- 
## Pre-requisites

- Docker and Docker Compose

## How to run

Run with docker compose:

```bash
$ docker compose up
```

Run locally:

```bash
$ yarn # Install deps
$ yarn dev # Run dev server
```

## Ruleset

- Use lint + prettier to format code, follow the formatting conventions.
- Tests should be running at ci/cd level.