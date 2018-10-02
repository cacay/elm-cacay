// Copy notes HTML file to the output
import 'reveal.js/plugin/notes/notes.html'

// Better colors
import 'colors.css/css/colors.css'

// Initialize `reveal.js`
Reveal.initialize({
    // Set aspect ration to 16:9
    width: 1280,
    height: 720,
    // center: false,

    // Display the page number of the current slide
	slideNumber: true,

	// Update the URL as we move through the slides
	history: true,

    dependencies: [
        // Cross-browser shim that fully implements classList - https://github.com/eligrey/classList.js/
        {
            src: require('reveal.js/lib/js/classList.js'),
            condition: function() { return !document.body.classList; }
        },

        // Interpret Markdown in <section> elements
        {
            src: require('reveal.js/plugin/markdown/marked.js'),
            condition: function() { return !!document.querySelector( '[data-markdown]' ); }
        },
        {
            src: require('reveal.js/plugin/markdown/markdown.js'),
            condition: function() { return !!document.querySelector( '[data-markdown]' ); }
        },

        // Syntax highlight for <code> elements
        {
            src: require('reveal.js/plugin/highlight/highlight.js'),
            async: true,
            callback: function() { hljs.initHighlightingOnLoad(); }
        },

        // MathJax
        {
            src: require('reveal.js/plugin/math/math.js'),
            async: true
        },

        // Zoom in and out with Alt+click
        {
            src: require('reveal.js/plugin/zoom-js/zoom.js'),
            async: true
        },

        // Search slides with Ctrl+Shift+F
        {
            src: require('reveal.js/plugin/search/search.js'),
            async: true
        },

        // Speaker notes with F
        {
            src: require('reveal.js/plugin/notes/notes.js'),
            async: true
        },
    ]
});

