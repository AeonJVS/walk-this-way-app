# walk-this-way-app
Final project for Haaga-Helia course Mobiiliohjelmointi.

This is a mobile application built for Android. It consists of two pages: Addresses and the Map. The former allows the user to either enter a viable address input, 
which is then saved for later access, or the current real-time location via a button. The Map screen is the following page, on which the user may draw a planned 
walk route onto a map. The page features a screenshot button, which creates a shareable .jpg image into the user's phone gallery. This image of the walk route can then
be shared with those who need the information.

The project utilizes multiple technologies.
  - The address names and coordinates are saved and retrieved from SQLite database. 
  - React Navigation is used for page layout and transitioning.
  - React Native Elements were chosen for listing and other visual purposes.
  - Expo Location is used in real-time location acquiring.
  - The application's aesthetic visuals were created with vector artwork for the logo and Expo LinearGradient for background coloring.
  - The fading information and instructions text seen briefly on the Addresses-page were created with React Native Animated. Relevant file: 'FadeOut.js'
  - The interactive map was created with React Native Maps, and the screenshot-functionality with React Native View Shot for capturing and Expo Media Library
    for saving to Gallery.
  -
