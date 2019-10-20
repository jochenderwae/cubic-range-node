# Cubic Range
This is a Node Red wrapper around [cubic-spline](https://www.npmjs.com/package/cubic-spline).
This will do a mapping (like the range node) of input values to a given set of output values.
If there is no x-value defined for the input, the node will do a cubic spline interpolation to get the output value.
## Usage
You can specify the property within the message that needs to be mapped, the rest of the message will pass through unchanged.
One exception, if the input topic is "newtable", the mapping will be updated but the the message will not be passed along.
When entering or passing new x and y values, make sure the two arrays are of equal length.