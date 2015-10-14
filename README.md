# Instructions:
1. Select or upload an image. Smaller images work best, since larger images take longer to generate the model.
2. Click on two or more colors in your image that you want the PixelPrinter to keep. PixelPrinter will convert any non-selected colors in the image to the colors you select. The first selected color will be the tallest in the final model. The last selected color will be the shortest. 
3. Simplify the colors and review the simplified image. 
4. Generate the model. 
5. Play with the parameters on the left to customize your model. Click Update to regenerate the model with the new parameters. Click and drag to rotate the model. Shift+click and drag to pan. 
6. Generate and download your STL.
7. 3D print your model.
8. Profit.

# Parameters
* `Model` -- Preconfigured models you can select to see how the tool works. This will be overwritten by `New Bitmap Array`.
* `Additional Thickness (mm)` -- Adds a backing of the specified size. This is useful if you want your model to stand upright, instead of lay flat after you've 3D printed it. Unit: millimeters
* `Multiplier` -- This controls the ratio of pixel heights (in the Z axis) among the different pixels. For instance, if `Ones` = 1, `Twos` = 2, and `Multiplier` = 1, then the Ones pixels will be 1 unit tall and the Twos pixels will be 2 units tall. If we change `Multiplier` to 2, the Ones pixels will be 2 units tall (1\*2), and the Twos pixels will be 4 units tall (2\*2).
* `Ones`, `Twos`, `Threes`, etc. -- The height of the pixels that were created by each color. Ones are the lightest color, Twos are the second-lightest color, etc. Units: millimeters
* `New Bitmap Array` -- An array of arrays representing the image-generated model before the other parameters are applied. Each sub-array represents a row of pixels in the image. Each value in the sub-arrays represents the height of that pixel in the model before the other parameters are applied. 
* `Update` -- Updates the model with the selected parameters. 
* `Instant Update` -- Updates the model as soon as a changed-parameter looses focus. This is useufl for small models, but models larger than 30px square may take too long to render to make this useful. 

# Credits
Thanks to [joostn's OpenJSCad](https://github.com/joostn/OpenJsCad) and [SpiritDude's OpenJSCad.org](https://github.com/Spiritdude/OpenJSCAD.org)

# TODO
* ~Change all the links that currently point to OpenJSCAD.org's github repo and webapp to point to this repo and this webapp.~
* Write instructions for folks who go straight to the tool wihtout reading this README file
* ~Make the original and simplified images larger, so it's easier to mouse over them while selecting colors.~
* ~Remove the Zeros parameter.~

# License
Copyright (c) 2015 Cory Chapman (@cmchap), under the MIT license.
