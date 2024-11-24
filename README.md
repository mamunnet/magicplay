# MagicPlay Agent Management

A modern web application built with React, TypeScript, and Vite for managing AI agents and their configurations.

## 🚀 Features

- Agent listing and management
- Modern and responsive UI with Tailwind CSS
- Real-time updates and notifications
- Form handling with React Hook Form
- State management using Zustand
- Database integration with LibSQL

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Router:** React Router DOM
- **State Management:** Zustand
- **Database:** LibSQL
- **Icons:** Lucide React & React Icons
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd magicplay.info
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables in the `.env` file.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📁 Project Structure

```
magicplay.info/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── constants/     # Constants and configurations
│   ├── App.tsx        # Main application component
│   └── ...
├── public/           # Static assets
├── .env.example      # Example environment variables
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.ts    # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Team
- Vite Team
- All other open-source contributors
