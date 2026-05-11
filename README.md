# Engine-E2E-Specter-Bench

> **Work in Progress** / **Em Construção**
> This project is currently under active development. Some features may be incomplete or unstable. / Ainda estou desenvolvendo o projeto. Algumas funcionalidades podem estar incompletas ou instáveis.

🇺🇸 [English](#english) | 🇧🇷 [Português](#português)

---

<a name="english"></a>

## 🇺🇸 English

### Objective

**Engine-E2E-Specter-Bench** is a high-performance benchmarking engine designed to evaluate, compare, and stress-test modern End-to-End (E2E) testing frameworks (such as Playwright, Cypress, and Selenium).
Rather than just testing for functional correctness, this engine measures execution speed, resource consumption, and most importantly, **AppSec (Application Security)** capabilities against the notoriously vulnerable [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/).

### Architecture

The core of the engine is an **Orchestrator written in Go**. It acts as a Hypervisor that:

1. Controls the Docker lifecycle (spinning up the Juice Shop environment).
2. Manages health checks to ensure the target is ready.
3. Exposes a unified REST API (`/metrics`) to collect telemetry and test results via IPC (Inter-Process Communication).
4. Dispatches E2E framework runners in isolated processes.

### Features

- **AppSec-Driven E2E**: Tests are designed to not only click buttons but to actively intercept APIs looking for Sensitive Data Exposure (e.g., `deletedAt`, `password` leaks) and trap Reflected XSS executions using native browser event listeners.
- **Go Hypervisor API**: Centralized telemetry collection using a standardized `TestResult` DTO.
- **Automated Workflow**: A robust `Makefile` that handles dependency resolution, Go compilation, and environment teardown.
- **Framework Agnostic Telemetry**: Built to compare Playwright, Cypress, and Selenium head-to-head.

### Getting Started

1. **Setup Environment:** Installs Node dependencies and Go modules.
   ```bash
   make setup
   ```
2. **Run Engine:** Compiles the Go orchestrator, spins up the Docker environment, and starts listening for test metrics.
   ```bash
   make run
   ```
3. **Clean Up:** Kills the Docker environment and cleans artifacts.
   ```bash
   make clean
   ```

---

<h4 align="center">Made By Otavszin א♥</h4>
<p align="center">
  <a href="https://github.com/DaviOts">github.com/DaviOts</a>
</p>

<a name="português"></a>

## 🇧🇷 Português

### Objetivo

A **Engine-E2E-Specter-Bench** é um motor de benchmarking de alta performance criado para avaliar, comparar e estressar frameworks modernos de E2E (como Playwright, Cypress e Selenium).
Em vez de testar apenas fluxos funcionais (se um botão funciona), esta engine mede a velocidade de execução, consumo de recursos e, o mais importante, capacidades de **AppSec (Segurança de Aplicações)** utilizando a aplicação intencionalmente vulnerável [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/).

### Arquitetura

O coração da engine é um **Orquestrador escrito em Go**. Ele atua como um "Hypervisor" que:

1. Controla o ciclo de vida do Docker (subindo o ambiente do Juice Shop).
2. Gerencia o Healthcheck para garantir que o alvo está pronto para receber requisições.
3. Expõe uma API REST unificada (`/metrics`) para coletar telemetria e resultados dos testes via IPC (Comunicação Inter-Processos).
4. Dispara os runners dos frameworks E2E em processos isolados.

### Funcionalidades

- **E2E Focado em AppSec**: Os testes são projetados para ativamente interceptar requisições de API em busca de Vazamento de Dados Sensíveis (ex: `deletedAt`, tokens) e capturar execuções de XSS Refletido utilizando listeners nativos dos navegadores.
- **Go Hypervisor API**: Coleta centralizada de telemetria usando um DTO padronizado (`TestResult`).
- **Workflow Automatizado**: Um `Makefile` robusto que lida com a instalação de dependências, compilação do Go e destruição do ambiente.
- **Telemetria Agnóstica**: Construída para comparar Playwright, Cypress e Selenium frente a frente.

### Como Executar

1. **Configurar Ambiente:** Instala as dependências do Node e os módulos do Go.
   ```bash
   make setup
   ```
2. **Rodar a Engine:** Compila o orquestrador em Go, sobe o ambiente Docker e começa a escutar as métricas dos testes.
   ```bash
   make run
   ```
3. **Limpar Ambiente:** Derruba os containers Docker e limpa os artefatos.
   ```bash
   make clean
   ```

<h4 align="center">Made By Otavszin א♥</h4>
<p align="center">
  <a href="https://github.com/DaviOts">github.com/DaviOts</a>
</p>
