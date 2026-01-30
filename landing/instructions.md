Here is a comprehensive and detailed prompt you can use to generate this UI. I have broken it down into logical sections and specified Chakra UI (v2) components and styling requirements to ensure the result matches the image.

***

**Prompt:**

Act as an expert Frontend Developer. Build a pixel-perfect, responsive landing page using **React** and **Chakra UI Version 2**. Use `lucide-react` or `react-icons` for icons.

**Global Design System & Colors:**
*   **Primary Blue:** `#00B5D8` (Cyan/Light Blue - used for buttons and highlights).
*   **Dark Blue:** `#102A43` (Used for the Navy Blue backgrounds).
*   **Orange:** `#F6AD55` (Used for the "Masters" button and Newsletter button).
*   **Font:** Use a clean sans-serif font (e.g., Inter or Roboto).
*   **Spacing:** Ensure generous whitespace between sections (`py={20}`).

Please build the following sections in order:

### 1. Top Navigation Bar
*   **Top Strip:** A full-width strip with background color `#3182ce` (Blue) containing the text "Admission for the January 2026 academic session is ongoing. **Apply Now!**" centered in white text.
*   **Main Navbar:**
    *   **Left:** A Logo (Placeholders: University of Port Harcourt logo).
    *   **Center:** Navigation links: Home, About, Research, Collaborations, Admissions, Updates.
    *   **Right:** A Search icon and a solid Cyan Button (`#00B5D8`) labeled "Training Courses".

### 2. Hero Section
*   **Background:** Use a full-width background image of a university building with a dark overlay to make text readable.
*   **Content:** Centered text.
    *   Heading: "Building the Next Generation" (White box background for "Building..." and "Experts") and "of Technology Experts" (Blue text on White).
    *   Subtext: White text describing the institution.
    *   **Carousel Indicators:** Small dots at the bottom center.
*   **Floating Stats Cards:**
    *   Positioned overlapping the bottom of the hero image (using negative margin or absolute positioning).
    *   4 White cards in a Grid.
    *   Content: "5,000+ Research Publications", "100+ Academic Programs", "30,000 Alumni Worldwide", "200+ Active Research Projects". Add faint shadow.

### 3. About Us Section
*   **Layout:** Two-column grid (`SimpleGrid columns={{base: 1, md: 2}}`).
*   **Left:** A large image of the university administrative building.
*   **Right:**
    *   Small blue label: "ABOUT US".
    *   Heading: "Uniport At A Glance".
    *   Body text describing the history (Founded 1975...).
    *   Button: "Read More" (Cyan background).

### 4. CTA Section ("Secure Your Future")
*   **Background:** Dark Navy Blue (`#102A43`).
*   **Layout:** Two columns.
*   **Left:**
    *   Heading: "Secure Your Future in Tech Now!!!" (White).
    *   List: 4 bullet points with icons (e.g., CheckCircle). Items: "Up to 100% Discount", "Tutor-Led Training", "6-12 Months Access", "Global Certifications".
    *   Button: Full-width Cyan button "Get Started Now".
*   **Right:** An image of a female student working on robotics/electronics inside a white frame or rounded container.

### 5. Programmes Section
*   **Header:** "FACULTY" (Blue), "Our Programmes" (Large Heading).
*   **Controls:** A row containing Filter Pills (Bachelor, Masters [Active/Orange], PHD, Sandwich) on the left, and a Search Input on the right.
*   **Carousel Area:**
    *   Background: Orange (`#ED8936`).
    *   Cards: Display 3 white cards in a row.
    *   **Card Content:** Title (e.g., "MSc in Computer Science"), Pill ("15 Courses"), and an Arrow icon.
    *   **Navigation:** Square buttons for Left (<) and Right (>) arrows at the bottom right.

### 6. News & Features Section
*   **Header:** "Latest News and Features".
*   **Layout:** Grid of 4 cards (responsive).
*   **Card Style:**
    *   Image at the top.
    *   Date (small text).
    *   Title (Blue text, e.g., "University of Port Harcourt set to model...").
    *   Excerpt text.
    *   Button: "Read More" (Dark Blue background).
*   **Bottom Action:** A centered Cyan button: "Read More News".

### 7. Library Section
*   **Layout:** Split screen (50/50).
*   **Left (Dark Blue Background):**
    *   Label: "LIBRARY".
    *   Heading: "Explore One of Nigeria's Premier Academic Libraries".
    *   List: 3 items with Orange bullet points.
*   **Right:** A high-quality image of the library building exterior.

### 8. Resources Section
*   **Heading:** "Access Our Resources" (Centered).
*   **Grid:** 3 Cards.
*   **Card Style:**
    *   Top half: Image (Handbook, Laptop/E-book, Tablet).
    *   Bottom half: White background with Blue Border.
    *   Title: "Department Handbook", "E-books", "E-courses".
    *   Button: "See More" with an arrow icon.

### 9. Newsletter Section
*   **Background:** Very Light Blue (`#EBF8FF`).
*   **Layout:** Flex row (Space between).
*   **Left:** Heading "Join Our Newsletter" and subtext.
*   **Right:** Input field with placeholder "Your Email Address" and an Orange "SUBSCRIBE" button attached.

### 10. Footer
*   **Background:** Dark Navy Blue (`#102A43`).
*   **Text Color:** White/Gray.
*   **Columns:** 4 Column Grid.
    *   **Col 1:** University Logo, Address, Hotline, Email.
    *   **Col 2 (Quick Links):** Admissions, Recent News, Academic Calendar, etc.
    *   **Col 3 (Navigation):** Home, About, Research, etc.
    *   **Social Icons:** Circle icons for Facebook, Twitter, Instagram, LinkedIn.
*   **Bottom:** Copyright text "Copyright © 2026 Department of Computer Science...".

***

**Code Structure Guidelines:**
*   Use `Box`, `Flex`, `Text`, `Heading`, `Button`, `SimpleGrid`, `Image`, `Input`, `Container`, `Stack`, `VStack`, `HStack`.
*   Make the design responsive (stack columns on mobile).
*   Ensure the orange section in "Programmes" spans full width but keeps content contained.