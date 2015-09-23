# Instructions:
1. Select or upload an image. Icon-sized images (50px x 50px or less) work best, since larger images take longer to generate the model.
2. Click on the colors in your image that you want the PixelPrinter to keep. It will convert any the other colors in the image to the colors you select. Scroll up/down while your mosue is over the original image to zoom in/out.
3. Generate the model. 
4. Play with the parameters on the left to customize your model. Click Update to regenerate the model with the new parameters. Click and drag to rotate the model. Shift+click and drag to pan. 
5. Generate and download your STL.
6. 3D Print your model.
7. Profit.

# Parameters
* `Model` -- Preconfigured models you can select to see how the tool works. This will be overwritten by `New Bitmap Array`.
* `Additional Thickness (mm)` -- Adds a backing of the specified size. This is useful if you want your model to stand upright, instead of lay flat after you've 3D printed it. Unit: millimeters
* `Pixel size (mm)` -- The X and Y dimension of the cube used to represent each pixel in the image. Unit: millimeters
* `Invert Heights` -- By default, the dark pixels are tallest, and the light pixels are shortest. This setting inverts those heights. 
* `Multiplier` -- This controls the ratio of pixel heights (in the Z axis) among the different pixels. For instance, if `Ones` = 1, `Twos` = 2, and `Multiplier` = 1, then the Ones pixels will be 1 unit tall and the Twos pixels will be 2 units tall. If we change `Multiplier` to 2, the Ones pixels will be 2 units tall (1\*2), and the Twos pixels will be 4 units tall (2\*2).
* `Zeros` -- For development testing only. Hopefully, this doesn't do anything for you.
* `Ones`, `Twos`, `Threes`, etc. -- The height of the pixels that were created by each color. Ones are the lightest color, Twos are the second-lightest color, etc. Units: millimeters
* `New Bitmap Array` -- An array of arrays representing the image-generated model before the other parameters are applied. Each sub-array represents a row of pixels in the image. Each value in the sub-arrays represents the height of that pixel in the model before the other parameters are applied. 
* `Update` -- Updates the model with the selected parameters. 
* `Instant Update` -- Updates the model as soon as a changed-parameter looses focus. This is useufl for small models, but models larger than 30px square may take too long to render to make this useful. 

# Credits
Thanks to [joostn's OpenJSCad](https://github.com/joostn/OpenJsCad) and [SpiritDude's OpenJSCad.org](https://github.com/Spiritdude/OpenJSCAD.org)

# TODO
* Change all the links that currently point to OpenJSCAD.org's github repo and webapp to point to this repo and this webapp.
* Write instructions for folks who go straight to the tool wihtout reading this README file
* Re-enable zooming on the simplified image
* Make the original and simplified images larger, so it's easier to mouse over them while selecting colors.
* Remove the Zeros parameter. 

# License
Copyright (c) 2015 Cory Chapman (@cmchap), under the MIT license.
