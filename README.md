# BreakLog

<div align="center">
    <img src="https://i.ibb.co/jZYR6S2/breaklog.png" alt="BreakLog Dashboard">
    <br/>
    <i>Dashboard of BreakLog</i>
    <br/><br/>
    <a href="https://github.com/alok-debnath/breaklog/blob/main/LICENSE" target="_blank">
        <img alt="GitHub License" src="https://img.shields.io/github/license/alok-debnath/breaklog?style=flat-square" />
    </a>
    <a href="https://github.com/alok-debnath/breaklog/issues" target="_blank">
        <img alt="GitHub Issues" src="https://img.shields.io/github/issues/alok-debnath/breaklog?style=flat-square" />
    </a>
    <a href="https://github.com/alok-debnath/breaklog/stargazers" target="_blank">
        <img alt="GitHub Stars" src="https://img.shields.io/github/stars/alok-debnath/breaklog?style=flat-square" />
    </a>
    <a href="https://github.com/alok-debnath/breaklog/network" target="_blank">
        <img alt="GitHub Forks" src="https://img.shields.io/github/forks/alok-debnath/breaklog?style=flat-square" />
    </a>
    <a href="https://www.codefactor.io/repository/github/alok-debnath/breaklog"><img src="https://www.codefactor.io/repository/github/alok-debnath/breaklog/badge" alt="CodeFactor" /></a>
</div>

<!-- [![Vercel Production Status](https://vercel-status-badge.vercel.app/alok-debnath/breaklog)](https://vercel.com/alokdebnath/breaklog) -->

## Introduction

BreakLog is a self-hosted time and attendance system built with Next.js. It allows you to log your workday by recording the start and end times of your work, as well as any breaks you take. It calculates the total break time and work done for that particular day, providing insights into your daily productivity. Additionally, it allows you to retrieve monthly logged data with useful insights. If you only need to track break times, BreakLog can handle that too, without requiring you to log your day start and day end logs.

## Features

- Log your daily work activities:
  - Day start
  - Exit
  - Enter
  - Day end
- Calculate and display:
  - Total break time
  - Work done for the day
- Retrieve monthly work data with insights
- Track break times independently

## Getting Started

To start using BreakLog, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/alok-debnath/breaklog.git
   ```

2. Navigate to the project directory:

   ```bash
   cd breaklog
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Run the development server:

   ```bash
   bun run dev
   ```

5. Open http://localhost:3000 with your web browser to use BreakLog.

## Acknowledgments

I would like to thank the Next.js and Vercel communities for their amazing tools and resources that made this project possible. Additionally, I'm grateful to the following libraries that played a key role in this project:

- [Shadcn](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)

These libraries have been instrumental in creating a seamless and efficient user experience.
