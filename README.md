## How to install and run
1. Set node version 20
2. Install dependencies with pnpm install
3. Start server with pnpm run dev
4. Check server on port 3000


## The Architecture

Este diagrama ilustra la arquitectura del sistema Task Manager, mostrando los componentes clave y cómo se comunican entre sí.

```mermaid
flowchart TB
    subgraph Client
        AC[Angular Client]
    end

    subgraph Express Application
        subgraph Routes
            AR[Auth Routes]
            TR[Task Routes]
        end

        subgraph Middleware
            AM[Auth Middleware]
        end

        subgraph Controllers
            AC1[Auth Controller]
            TC[Task Controller]
        end

        subgraph Repositories
            UR[User Repository]
            TaskR[Task Repository]
        end

        subgraph Database
            DB[(SQLite)]
        end
    end

    AC -->|HTTP Request| AR & TR
    TR -->|Validate Token| AM
    AM -->|If Valid| TC
    AR -->|Login Request| AC1
    AC1 -->|Query User| UR
    TC -->|CRUD Operations| TaskR
    UR & TaskR -->|Query| DB

    classDef client fill:#f9f,stroke:#333,stroke-width:2px, color:#000;
    classDef routes fill:#bbf,stroke:#333,stroke-width:2px, color:#000;
    classDef middleware fill:#ddf,stroke:#333,stroke-width:2px, color:#000;
    classDef controllers fill:#dfd,stroke:#333,stroke-width:2px, color:#000;
    classDef repositories fill:#ffd,stroke:#333,stroke-width:2px, color:#000;
    classDef database fill:#fdd,stroke:#333,stroke-width:2px, color:#000;

    class AC client
    class AR,TR routes
    class AM middleware
    class AC1,TC controllers
    class UR,TaskR repositories
    class DB database
