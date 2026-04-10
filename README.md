# GitScan — GitHub Profile Analyzer

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/yourusername/gitscan)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A sleek, dark-themed web application for analyzing GitHub user profiles. Enter any GitHub username to instantly visualize repositories, languages, stars, and activity metrics in an elegant dashboard interface.

![GitScan Demo](https://via.placeholder.com/800x400/0d1117/58a6ff?text=GitScan+Demo+Screenshot) *(Placeholder: Replace with actual screenshot)*

## ✨ Features

- **Profile Overview**: Display user avatar, name, bio, location, company, blog, and social links
- **Follower Statistics**: Real-time follower, following, and repository counts
- **Aggregate Metrics**: Total stars, forks, watchers, and repository size across all public repos
- **Language Breakdown**: Color-coded visualization of programming languages used, with percentage distribution
- **Top Repositories**: Showcase the most starred repositories with detailed metadata
- **Recent Activity**: List of the 5 most recently updated repositories
- **Error Handling**: Graceful handling of invalid usernames and API rate limits
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Theme**: GitHub-inspired dark UI for comfortable viewing

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for GitHub API access

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/gitscan.git
   cd gitscan
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - No build process or server required

That's it! The application runs entirely client-side.

## 📖 Usage

1. **Enter Username**: Type a GitHub username in the search box (e.g., `torvalds`, `gaearon`)
2. **Scan Profile**: Click the "Scan" button or press Enter
3. **Explore Data**: View comprehensive profile analytics and repository insights
4. **Navigate**: Use suggestion pills for quick access to popular profiles
5. **Back to Search**: Click "New Search" to analyze another user

### API Rate Limits

- Uses GitHub's public REST API (no authentication required)
- Rate limit: 60 requests per hour for unauthenticated users
- Includes real-time API status indicator in the header

## 🛠️ Technical Details

### Built With

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Custom CSS with CSS Variables for theming
- **Fonts**: Google Fonts (JetBrains Mono, Syne, DM Sans)
- **API**: GitHub REST API v3
- **Icons**: Inline SVG for crisp, scalable graphics

### Architecture

- **Single Page Application**: No routing or frameworks, pure vanilla JS
- **Modular Code**: Organized functions for data fetching, rendering, and UI management
- **Responsive Layout**: Flexbox and CSS Grid for adaptive design
- **Performance**: Efficient DOM manipulation and minimal dependencies

### File Structure

```
gitscan/
├── index.html      # Main HTML structure
├── style.css       # Dark theme styling and responsive design
├── app.js          # Core application logic and API integration
└── README.md       # Project documentation
```

## 🎨 Design Philosophy

GitScan embraces GitHub's design language with:
- **Dark Color Palette**: Easy on the eyes for extended coding sessions
- **Data-Driven Layout**: Prioritizes information hierarchy and readability
- **Minimalist UI**: Clean, uncluttered interface focusing on data visualization
- **Interactive Elements**: Hover effects and smooth animations enhance user experience

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Setup

- No build tools required - edit files directly
- Test in multiple browsers for compatibility
- Ensure API calls handle errors gracefully

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GitHub API**: For providing comprehensive user and repository data
- **Google Fonts**: For beautiful, open-source typography
- **Dušan**: Original developer and designer

---

**Made with ❤️ for the GitHub community**