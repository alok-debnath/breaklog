# BreakLog

[![GitHub License](https://img.shields.io/github/license/alok-debnath/breaklog)](https://github.com/alok-debnath/breaklog/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/alok-debnath/breaklog)](https://github.com/alok-debnath/breaklog/issues)
[![GitHub Stars](https://img.shields.io/github/stars/alok-debnath/breaklog)](https://github.com/alok-debnath/breaklog/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/alok-debnath/breaklog)](https://github.com/alok-debnath/breaklog/network)

![BreakLog Dashboard](https://i.ibb.co/jZYR6S2/breaklog.png)

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
   pnpm install
   ```

4. Run the development server:

   ```bash
   pnpm run dev
   ```

5. Open http://localhost:3000 with your web browser to use BreakLog.

## Acknowledgments

I would like to thank the Next.js and Vercel communities for their amazing tools and resources that made this project possible. Additionally, I'm grateful to the following libraries that played a key role in this project:

- [DaisyUI](https://daisyui.com/)
- [Zustand](https://github.com/pmndrs/zustand)

These libraries have been instrumental in creating a seamless and efficient user experience.
