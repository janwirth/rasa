module.exports = {
  name: 'ideal-img/[name].[hash:hex:7].[width].[ext]', // Filename template for output files. |
  sizes: undefined, // Specify all widths you want to use. If a specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up). |
  size: undefined, // Specify one width you want to use; if the specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up) |
  min: undefined, // As an alternative to manually specifying `sizes`, you can specify `min`, `max` and `steps`, and the sizes will be generated for you. |
  max: undefined, // See `min` above |
  steps: 4, // Configure the number of images generated between `min` and `max` (inclusive) |
  quality: 70, // JPEG compression quality |
};
