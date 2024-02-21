module.exports = function(eleventyConfig) {
    // Return your Object options:
    eleventyConfig.addPassthroughCopy('./src/style.css')
    eleventyConfig.addPassthroughCopy('./src/assets')
    eleventyConfig.addPassthroughCopy('./tina')


    return {
      dir: {
        input: "src",
        output: "public"
      }
    }
  };