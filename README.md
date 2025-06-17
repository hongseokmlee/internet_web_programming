# Busan Hospital Discovery

### Final Project Report — Introduction to Internet and Web
**Author**: Hongseok Lee  
**Date**: June 17, 2025

---

## Project Overview Project Overview

This project is a **static web application** that helps users discover hospitals and clinics across Busan. The application allows users to:

- Filter hospitals by category (General, Dental, Orthopedic, Emergency)
- View hospital details (address, phone, website)
- Leave a star rating using local storage
- Switch between **English** and **Korean** language UI
- View an embedded **Google Map** location for each hospital

The app is designed to work fully in the browser without any backend service.

---

## Tools and Technologies Used Tools and Technologies Used

| Tool/Tech | Purpose |
|-----------|---------|
| **HTML5** | Structure of the webpage |
| **CSS3**  | Styling, layout, responsiveness |
| **JavaScript (Vanilla)** | Dynamic rendering, filtering, language toggle, ratings |
| **Font Awesome** | Star icons for rating system |
| **Google Fonts** | UI font styling |
| **Google Maps Embed API (iframe)** | Map display in each hospital card |
| **localStorage API** | To store user ratings per hospital |
| **GitHub Pages** | For project deployment |

---

## Features Implemented Features Implemented

- Responsive card-based layout
- Filtering by hospital type
- Bilingual interface (ENG/KOR toggle)
- Interactive star-rating system (saved in localStorage)
- Embedded Google Maps in each card
- Expand/collapse card behavior
- Works on both desktop and mobile browsers

---

## Challenges Faced and Solutions Challenges Faced & Solutions

### 1. **Interactive Star Rating**
- **Challenge**: Getting hover/click behavior right while syncing with localStorage  
- **Solution**: Used `<i>` tags with Font Awesome classes and custom JS event handling

### 2. **Bilingual UI Handling**
- **Challenge**: Dynamic UI switching without reloading the page  
- **Solution**: Stored all translatable strings in a `translations` object, and updated DOM nodes with `[data-i18n]` attributes

### 3. **Embedding Maps**
- **Challenge**: Showing a map for each hospital without requiring an API key  
- **Solution**: Used Google Maps `iframe` with search query-based embed URLs

---

## Limitations Limitations / What Didn’t Work

- **No backend**: Ratings are only saved in localStorage and not synced across devices or sessions.
- **Map embed performance**: Embedding Google Maps for every card increases page weight and load time, especially on mobile.
- **Korean address encoding**: Google Maps sometimes fails to correctly locate hospitals when using Korean addresses in English-encoded search queries. This occasionally results in inaccurate or empty map previews.
- **Responsive layout**: While basic responsiveness is applied, the mobile UI could be improved further, such as using collapsible filter menus or better spacing.

---

## Future Improvements Future Improvements

- Add a backend (e.g. Firebase or Express + MongoDB) to store ratings persistently
- Add a search bar to filter by hospital name or location
- Improve performance by lazy-loading map iframes only when needed
- Add user login to store personalized ratings and preferences

---

## Links

- **GitHub Repository**: [https://github.com/hongseokmlee/internet_web_programming](https://github.com/hongseokmlee/internet_web_programming)  
- **Live Demo**: [https://hongseokmlee.github.io/internet_web_programming](https://hongseokmlee.github.io/internet_web_programming)  
