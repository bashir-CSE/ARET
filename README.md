# ARET Website - Bootstrap Redesign

This project has been redesigned using Bootstrap 5 and Font Awesome icons to create a modern, responsive, and accessible user interface.

## What's New

### 1. Bootstrap 5 Integration
- Modern, responsive grid system
- Pre-built components (cards, navigation, alerts, etc.)
- Mobile-first approach
- Consistent styling across all devices

### 2. Font Awesome Icons
- Enhanced visual communication
- Scalable vector icons
- Easy to customize and maintain

### 3. Responsive Design
- Mobile-friendly navigation with hamburger menu
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

### 4. Improved User Experience
- Smooth scrolling
- Fade-in animations for cards
- Auto-dismissing alerts
- Interactive hover effects

### 5. Modern JavaScript
- Bootstrap component initialization
- Intersection Observer for animations
- Local storage for preferences
- Form validation utilities

## File Structure

```
.
├── index.html              # Main HTML file with Bootstrap structure
├── css/
│   ├── bootstrap-style.css  # Custom styles for Bootstrap components
│   ├── style.css            # Original CSS (kept for reference)
│   ├── topnav.css           # Original navigation styles (kept for reference)
│   └── style_button.css     # Original button styles (kept for reference)
├── images/                 # Image assets
├── js/
│   └── script.js            # Enhanced JavaScript with Bootstrap functionality
└── README.md               # This documentation file
```

## Key Features

### Navigation
- Sticky header with logo and navigation links
- Social media icons in the header
- Mobile-responsive collapsible menu
- Active state indicators for current page

### Sections
1. **Top Bar**: Contact information and WhatsApp link
2. **Header**: Logo, navigation, and social media links
3. **Certificate Verification**: Alert with dismiss functionality
4. **Why Choose ARET**: Feature cards with icons
5. **Skills Quote**: Highlighted mission statement
6. **Skill Development Programme**: Course cards with pricing
7. **Footer**: Copyright information

### Interactive Elements
- Hover effects on cards and buttons
- Smooth scrolling to sections
- Auto-dismissing certificate alert
- Mobile menu toggle

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

## Customization

### Colors and Styling
Custom CSS variables are defined in `css/bootstrap-style.css`:
```css
:root {
   --main-color: #8e44ad;
   --red: #e74c3c;
   --orange: #f39c12;
   --light-color: #888;
   --light-bg: #eee;
   --black: #2c3e50;
   --white: #fff;
   --border: .1rem solid rgba(0,0,0,.2);
}
```

### Adding New Courses
To add a new course card:
1. Copy the existing course card structure
2. Update the image source, title, description, and link
3. Ensure it follows the Bootstrap grid system (e.g., `col-lg-4 col-md-6`)

### Modifying Navigation
To add or remove navigation items:
1. Edit the `navbar-nav` list in `index.html`
2. Update the link text and icons as needed
3. Ensure proper Font Awesome icon classes are used

## Performance Considerations

- Bootstrap and Font Awesome are loaded from CDN for faster loading
- Images are optimized for web use
- JavaScript is deferred for better page load performance
- Lazy loading for images can be implemented if needed

## Accessibility

- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast colors for readability
- Responsive design for all devices

## Future Enhancements

Potential improvements for future iterations:
- Dark mode toggle
- Shopping cart functionality
- Course search and filtering
- Student testimonials carousel
- Blog section with pagination
- Contact form with validation

## Migration Notes

The original design has been preserved while modernizing the interface:
- All original content has been maintained
- Color scheme and branding kept consistent
- Original functionality preserved
- Enhanced with modern UI/UX patterns

## Credits

- Bootstrap 5: https://getbootstrap.com/
- Font Awesome: https://fontawesome.com/
- Google Fonts: https://fonts.google.com/
"# ARET" 
"# ARET" 
