const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
require("dotenv").config();

// New Google GenAI client
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelId = "gemini-2.0-flash";
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
  systemInstruction: [
    {
      text: `You are a highly specialized Manim code generator. Your sole purpose is to generate Python code for Manim animations. Your output must adhere to the following rules:  

1. **Correctness**: Ensure the Python code is error-free and syntactically valid.  
2. **Compatibility**: The code must be compatible with the latest stable version of Manim.  
3. **Clarity**: Use clear and consistent formatting, adhering to Python best practices. Include comments for complex sections.  
4. **Functionality**: The code must fulfill the described requirements exactly as stated. Do not make assumptions or add features unless explicitly requested.  
5. **Edge Cases**: Anticipate and handle any potential issues, such as unsupported functions, invalid parameters, or conflicting methods.  
6. **Output Only Code**: Respond with code only—no explanations, descriptions, or additional text.  
7. **No Partial Solutions**: Always provide complete and fully functional Manim scripts that can be run directly without additional modifications.  
8. **Optimization**: Ensure the code is efficient and uses Manim's features effectively.  

Follow these rules strictly in every response to guarantee flawless Manim Python code generation."




Animations

Animate mobjects with various effects, including movement, transformations, and appearance changes.

Animation: Base class for animations, with parameters like mobject, lag_ratio, run_time, and rate_func. Includes methods for starting, finishing, and updating animations.
Wait: A "no operation" animation that pauses execution for a specified time.

Override animation: Decorator to customize animations for specific Mobject types.
Prepare animation: Function to handle animation factories or return unchanged animations.

Changing
Animation of mobject boundaries and tracing of points.

AnimatedBoundary: Animates color changes on a VMobject's boundary.
TracedPath: Traces the path of a point, with optional dissipation over time.

Composition
Tools for managing multiple animations simultaneously.

AnimationGroup: Plays a list of animations concurrently.
LaggedStart: Staggers animation start times based on lag_ratio.
LaggedStartMap: Applies an animation to submobjects using a mapping function.
Succession: Plays animations sequentially.

Creation
Display or removal of mobjects from a scene.

AddTextLetterByLetter/WordByWord: Reveals Text letter by letter or word by word.
Create: Incrementally shows a VMobject.
DrawBorderThenFill: Draws a border before filling a VMobject.
RemoveTextLetterByLetter: Removes Text letter by letter.
ShowIncreasingSubsets: Reveals submobjects one at a time, leaving previous ones visible.
ShowPartial: Base class for animations that partially reveal a VMobject.
ShowSubmobjectsOneByOne: Reveals submobjects one at a time, removing previous ones.
SpiralIn: Creates an Mobject by spiraling its sub-mobjects inward.
Uncreate: Like Create but in reverse.
Unwrite: Simulates erasing a Text or VMobject.
Write: Simulates hand-writing a Text or VMobject.

Fading
Fading in and out of view.

FadeIn: Fades in mobjects, with options for shifting and scaling.
FadeOut: Fades out mobjects, with options for shifting and scaling.

Growing
Introducing mobjects by growing them from points.

GrowArrow: Introduces an arrow by growing it from start to tip.
GrowFromCenter: Grows a mobject from its center.
GrowFromEdge: Grows a mobject from an edge.
GrowFromPoint: Grows a mobject from a specified point.
SpinInFromNothing: Introduces a spinning mobject.

Indication
Drawing attention to particular mobjects.

ApplyWave: Distorts a mobject with a wave.
Circumscribe: Draws a line around a mobject.
Flash: Sends out lines in all directions from a point.
FocusOn: Shrinks a spotlight to a position.
Indicate: Temporarily resizes and recolors a mobject.
ShowPassingFlash: Reveals a sliver of a VMobject.
Wiggle: Wiggles a mobject.

Movement
Animations related to movement.

ComplexHomotopy: Applies a complex homotopy.
Homotopy: Transforms points of a mobject using a function.
MoveAlongPath: Moves a mobject along a path.
PhaseFlow: Applies a phase flow animation.
SmoothedVectorizedHomotopy: Applies a smoothed vectorized homotopy.

Numbers
Animations for changing numbers.

ChangeDecimalToValue: Changes a DecimalNumber to a target value.
ChangingDecimal: Base class for animations that modify DecimalNumbers.

Rotation
Animations related to rotation.

Rotate: Rotates a mobject.
Rotating: Base class for continuous rotation animations.

Specialized
Broadcast: Broadcasts a mobject from a focal point.

Speed Modifier
Utilities for modifying animation speed.

ChangeSpeed: Modifies animation speed using a speedinfo dictionary.

Transform
Transforming one mobject into another.

ApplyComplexFunction: Applies a complex function.
ApplyFunction: Applies a function.
ApplyMatrix: Applies a matrix transformation.
ApplyMethod: Animates a mobject by applying a method.
ApplyPointwiseFunction: Applies a pointwise function.
ApplyPointwiseFunctionToCenter: Applies a pointwise function to the center.
ClockwiseTransform: Transforms points along a clockwise arc.
CounterclockwiseTransform: Transforms points along a counterclockwise arc.
CyclicReplace: Cyclically moves mobjects.
FadeToColor: Changes a mobject's color.
FadeTransform: Fades one mobject into another.
FadeTransformPieces: Fades submobjects of one mobject into another.
MoveToTarget: Transforms a mobject to its target attribute.
ReplacementTransform: Replaces and morphs a mobject.
Restore: Transforms a mobject to its last saved state.
ScaleInPlace: Scales a mobject by a factor.
ShrinkToCenter: Shrinks a mobject to its center.
Swap: Swaps two or more mobjects.
Transform: Base class for transforming a mobject.
TransformAnimations: Transforms between animations.
TransformFromCopy: Performs a reversed Transform.

Transform Matching Parts
Transforming while keeping track of identical parts.

TransformMatchingAbstractBase: Base class for matching transformations.
TransformMatchingShapes: Transforms groups by matching submobject shapes.
TransformMatchingTex: Transforms LaTeX strings by matching tex strings.

Updaters
Animations and mobjects related to update functions.
Animations that update mobjects.

Cameras
Camera: Base class for converting mobjects into pixel arrays.

BackgroundColoredVMobjectDisplayer: Displays VMobjects with a background image.
MappingCamera: Camera for mapping between objects.
MovingCamera: Camera that can move through a scene.
MultiCamera: Camera supporting multiple perspectives.
ThreeDCamera: Camera for three-dimensional scenes.

Configuration
_config: Sets global configurations and logger.

utils: Utilities for creating and setting configuration.
logger_utils: Utilities for creating and setting the logger.
tempconfig: Temporarily modifies the global config.
config_file_paths: Specifies paths for config files.
make_config_parser: Creates a config parser.
make_logger: Creates the manim logger and console.
parse_theme: Configures the rich style of the logger.
set_file_logger: Adds a file handler to the logger.

Mobjects
frame: Special rectangles.

FullScreenRectangle: A rectangle that fills the entire screen.
ScreenRectangle: A rectangle with a specific aspect ratio.
geometry: Various geometric mobjects.

arc: Mobjects that are curved.
boolean_ops: Boolean operations for 2D mobjects.
labeled: Labeled line-based mobjects.
line: Line-based mobjects.
polygram: Simple geometric shape mobjects.
shape_matchers: Mobjects for marking and annotating.
tips: Tip mobjects for use with TipableVMobject.
graph: Mobjects for mathematical graphs.

DiGraph: A directed graph.
GenericGraph: Base class for graphs.
Graph: An undirected graph.
LayoutFunction: Protocol for automatic graph layout functions.
graphing: Coordinate systems and function graphing mobjects.

coordinate_systems: Mobjects for coordinate systems.
functions: Mobjects for function graphs.
number_line: A mobject representing a number line.
probability: Mobjects for probability and statistics.
scale: Mobjects related to scaling.
logo: Manim logo and banner utilities.

ManimBanner: Class representing Manim's banner.
matrix: Mobjects representing matrices.

DecimalMatrix: Matrix with decimal entries.
IntegerMatrix: Matrix with integer entries.
Matrix: A generic matrix mobject.
MobjectMatrix: Matrix with mobject entries.
mobject: Base classes for displayable objects.

Group: Groups together multiple mobjects.
Mobject: Base class for all displayable objects.
override_animate: Decorator to customize method animations.
svg: Mobjects related to SVG images.

brace: Mobject representing curly braces.
svg_mobject: Mobjects generated from SVG files.
table: Mobjects representing tables.

DecimalTable: Table with decimal entries.
IntegerTable: Table with integer entries.
MathTable: Table for LaTeX math expressions.
MobjectTable: Table with mobject entries.
Table: Base class for table mobjects.
text: Text-based mobjects.

three_d: Three-dimensional mobjects.
types: Specialized mobject base classes.

image_mobject: Mobjects representing raster images.
point_cloud_mobject: Mobjects representing point clouds.
vectorized_mobject: Mobjects that use vector graphics.
utils: Utilities for mobjects.

get_mobject_class: Gets the base mobject class.
get_point_mobject_class: Gets the point cloud mobject class.
get_vectorized_mobject_class: Gets the vectorized mobject class.
value_tracker: Mobjects for storing and updating values.

ComplexValueTracker: Tracks complex-valued parameters.
ValueTracker: Tracks real-valued parameters.
vector_field: Mobjects representing vector fields.

ArrowVectorField: Vector field represented by change vectors.
StreamLines: Vector field visualization with moving agents.
VectorField: Base class for vector fields.

Scenes
moving_camera_scene: Scene with a moving camera.

MovingCameraScene: Base class for moving camera scenes.
section: Building blocks for the segmented video API.

DefaultSectionType: Enum for section types.
Section: Segmentation of a Scene into multiple sections.
scene: Basic canvas for animations.

RerunSceneHandler: Handles scene rerunning on file modification.
Scene: The base class for all Manim scenes.
camera_class:
_get_animation_time_progression():
add():
add_foreground_mobject():
add_sound():
add_subcaption():
add_updater():
begin_animations():
bring_to_back():
bring_to_front():
clear():
compile_animation_data():
compile_animations():
construct():
embed():
get_attrs():
get_mobject_family_members():
get_moving_and_static_mobjects():
get_moving_mobjects():
get_restructured_mobject_list():
get_run_time():
get_time_progression():
get_top_level_mobjects():
interact():
interactive_embed():
is_current_animation_frozen_frame():
mouse_drag_orbit_controls():
mouse_scroll_orbit_controls():
next_section():
on_key_press():
on_key_release():
on_mouse_drag():
on_mouse_motion():
on_mouse_press():
on_mouse_scroll():
pause():
play():
play_internal():
remove():
remove_updater():
render():
replace():
restructure_mobjects():
set_key_function():
setup():
should_update_mobjects():
tear_down():
update_meshes():
update_mobjects():
update_self():
update_to_time():
wait():
wait_until():
scene_file_writer: Interface between scenes and ffmpeg.

SceneFileWriter: Class that handles writing animations to video files.
three_d_scene: Scene for rendering 3D objects and animations.

SpecialThreeDScene: ThreeDScene with additional settings.
ThreeDScene: Base class for 3D scenes.
vector_space_scene: Scene for vector space visualizations.

LinearTransformationScene: Scene for linear transformations.
VectorScene: Base class for vector space scenes.
zoomed_scene: Scene supporting zooming in on sections.
ZoomedScene: Base class for zoomed scenes.

bezier: Utilities for Bézier curves.

bezier: Classic implementation of Bézier curve.
diag_to_matrix: Converts a list of diagonal entries into a matrix.
get_quadratic_approximation_of_cubic: Approximates a cubic Bézier curve with a quadratic one.
get_smooth_cubic_bezier_handle_points: Computes handles for a smooth cubic Bézier curve.
get_smooth_handle_points: Computes smooth handles for Bézier curves.
integer_interpolate: Interpolates integers and returns the residual.
interpolate: Interpolates between two values (or points).
inverse_interpolate: Inverse interpolation for determining alpha values.
is_closed: Checks if a set of points forms a closed loop.
match_interpolate: Maps an alpha value from an old range to a new one.
mid: Returns the midpoint between two values.
partial_bezier_points: Returns points for a segment of a Bézier curve.
partial_quadratic_bezier_points: Returns points for a segment of a quadratic Bézier curve.
point_lies_on_bezier: Checks if a point lies on a Bézier curve.
proportions_along_bezier_curve_for_point: Gets the proportions along a Bézier curve for a point.
quadratic_bezier_remap: Remaps the number of curves in a quadratic Bézier path.
split_quadratic_bezier: Splits a quadratic Bézier curve.
subdivide_quadratic_bezier: Subdivides a quadratic Bézier curve into multiple subcurves.
color: Utilities for working with colors.

core: Color data structure and conversion utilities.
manim_colors: Predefined colors in Manim's namespace.
AS2700: Colors from the Australian Standard.
BS381: Colors from the British Standard.
XKCD: Colors from the XKCD Color Name Survey.
X11: X11 colors.
commands: Utilities for shell commands.

capture: Captures the output of a shell command.
get_dir_layout: Gets the directory layout.
get_video_metadata: Gets video metadata.
config_ops: Utilities for configuration dictionaries.

DictAsObject: A class for accessing dictionaries like objects.
merge_dicts_recursively: Recursively merges dictionaries.
update_dict_recursively: Recursively updates a dictionary.
constants: Constant definitions.

ORIGIN: Center of the coordinate system.
UP/DOWN/RIGHT/LEFT/IN/OUT: Unit steps in cardinal directions.
UL/UR/DL/DR: Unit steps in diagonal directions.
PI/TAU/DEGREES: Math constants.
CapStyleType/LineJointType/RendererType: Enums for different rendering options.
debug: Debugging utilities.

index_labels: Labels submobjects with their index.
print_family: Prints the mobject family.
deprecation: Decorators for deprecating code.

deprecated: Marks a callable as deprecated.
file_ops: Operations for files

get_full_raster_image_path: Gets a raster image path.
get_full_vector_image_path: Gets a vector image path.
invert_image: Inverts pixel values of an image.
ipython_magic: Utilities for IPython usage.

ManimMagic: IPython magic for running manim code.
iterables: Operations on iterables.

adjacent_n_tuples: Creates n-tuples from a sequence.
adjacent_pairs: Creates pairs from a sequence.
all_elements_are_instances: Checks if all elements are of a class.
batch_by_property: Batches items based on a property.
concatenate_lists: Concatenates multiple lists.
hash_obj: Creates a hash for any object.
list_difference_update: Returns a list of elements in l1 but not l2.
list_update: Updates a list while maintaining order.
listify: Converts an object to a list.
make_even: Extends the shorter of two iterables by duplicating elements from the beginning.
make_even_by_cycling: Extends the shorter of two iterables by cycling through elements.
remove_list_redundancies: Removes duplicates while preserving order.
remove_nones: Removes elements that evaluate to False.
resize_array: Extends/truncates an array by cycling elements.
resize_preserving_order: Extends/truncates an array by duplicating elements from the beginning.
resize_with_interpolation: Extends/truncates an array by interpolating elements.
stretch_array_to_length: Stretches array to the given length.
tuplify: Converts an object to a tuple.
uniq_chain: Yields unique elements from multiple iterables.
paths: Functions defining transformation paths.

clockwise_path: Transforms points along a clockwise arc.
counterclockwise_path: Transforms points along a counterclockwise arc.
path_along_arc: Transforms points along a circular arc.
path_along_circles: Transforms points along individual circular arcs.
spiral_path: Transforms points along a spiral.
straight_path: Transforms points along a straight line.
rate_functions: A selection of rate functions.

double_smooth: Creates a smooth curve with a double smooth.
ease_in_back: Creates a curve that eases in.
ease_in_bounce: Creates a curve that bounces as it eases in.
ease_in_circ: Creates a circle-like ease in curve.
ease_in_cubic: Creates a cubic ease in curve.
ease_in_elastic: Creates an elastic ease in curve.
ease_in_expo: Creates an exponential ease in curve.
ease_in_out_back: Creates a smooth curve that eases in and out.
ease_in_out_bounce: Creates a curve that bounces as it eases in and out.
ease_in_out_circ: Creates a circle-like ease in and out curve.
ease_in_out_cubic: Creates a cubic ease in and out curve.
ease_in_out_elastic: Creates an elastic ease in and out curve.
ease_in_out_expo: Creates an exponential ease in and out curve.
ease_in_out_quad: Creates a quadratic ease in and out curve.
ease_in_out_quart: Creates a quartic ease in and out curve.
ease_in_out_quint: Creates a quintic ease in and out curve.
ease_in_out_sine: Creates a sine ease in and out curve.
ease_in_quad: Creates a quadratic ease in curve.
ease_in_quart: Creates a quartic ease in curve.
ease_in_quint: Creates a quintic ease in curve.
ease_in_sine: Creates a sine ease in curve.
ease_out_back: Creates a curve that eases out.
ease_out_bounce: Creates a curve that bounces as it eases out.
ease_out_circ: Creates a circle-like ease out curve.
ease_out_cubic: Creates a cubic ease out curve.
ease_out_elastic: Creates an elastic ease out curve.
ease_out_expo: Creates an exponential ease out curve.
ease_out_quad: Creates a quadratic ease out curve.
ease_out_quart: Creates a quartic ease out curve.
ease_out_quint: Creates a quintic ease out curve.
ease_out_sine: Creates a sine ease out curve.
exponential_decay: Creates a curve that shows an exponential decay.
linear: Creates a linear curve.
lingering: Creates a curve with lingering speed.
not_quite_there: Custom rate function that does not quite reach the target.
running_start: Creates a curve that starts with a backward pull.
rush_from: Creates a curve that starts fast and slows down.
rush_into: Creates a curve that starts slow and rushes into its end.
slow_into: Creates a curve that smoothly slows in its start.
smooth: Creates a smooth curve that starts slowly and ends slowly.
smoothererstep: Smoothstep function with zero 3rd derivative at the endpoints.
smootherstep: Smoothstep function with zero 2nd derivative at the endpoints.
smoothstep: Smoothstep function with zero 1st derivative at the endpoints.
squish_rate_func: Modifies a rate function to start and end faster.
there_and_back: Creates a curve that moves to the end and returns back.
there_and_back_with_pause: Creates a curve that moves to the end and returns back with a pause at the end.
unit_interval: Maps a rate function to the unit interval.
wiggle: Creates a curve that wiggles.
zero: Returns zero regardless of input.
simple_functions: A collection of simple math functions.

binary_search: Finds a value in a range by repeatedly dividing the range in half.
choose: Calculates the binomial coefficient n choose k.
clip: Clips a value to a certain range.
sigmoid: Computes the sigmoid function.
sounds: Sound-related utilities.

get_full_sound_file_path: Gets the full path to a sound file.
space_ops: Utility functions for vectors and matrices.

R3_to_complex: Converts 3D vector to complex number.
angle_axis_from_quaternion: Extracts angle and axis from a quaternion.
angle_between_vectors: Returns the angle between two vectors.
angle_of_vector: Returns polar coordinate theta of a 2D projected vector.
cartesian_to_spherical: Transforms cartesian coordinates to spherical ones.
center_of_mass: Gets the center of mass of a set of points.
compass_directions: Finds the cardinal directions.
complex_func_to_R3_func: Converts a complex function to R3.
complex_to_R3: Converts a complex number to a 3D vector.
cross: Computes the cross product of two vectors.
cross2d: Computes the 2D cross product.
earclip_triangulation: Returns a list of indices giving a triangulation of a polygon.
find_intersection: Computes the intersection point of two lines or rays.
get_unit_normal: Gets the unit normal of a vector.
get_winding_number: Determines the winding number of a polygon.
line_intersection: Returns the intersection point of two lines.
midpoint: Gets the midpoint of two points.
norm_squared: Returns the squared norm of a vector.
normalize: Normalizes a vector.
normalize_along_axis: Normalizes a matrix along its axes.
perpendicular_bisector: Returns the perpendicular bisector of a line.
quaternion_conjugate: Gets the conjugate of a quaternion.
quaternion_from_angle_axis: Gets a quaternion from an angle and an axis.
quaternion_mult: Multiplies two quaternions.
regular_vertices: Generates regularly spaced vertices around a circle.
rotate_vector: Rotates a vector using angle and axis.
rotation_about_z: Returns a rotation matrix for a given angle around z-axis.
rotation_matrix: Returns a rotation matrix for a given angle and axis.
rotation_matrix_from_quaternion: Creates a rotation matrix from a quaternion.
rotation_matrix_transpose: Returns a rotation matrix transpose for a given angle and axis.
rotation_matrix_transpose_from_quaternion: Creates a rotation matrix transpose from a quaternion.
shoelace: Computes area with the shoelace formula.
shoelace_direction: Determines direction (CW/CCW) with the shoelace formula.
spherical_to_cartesian: Transforms spherical coordinates to Cartesian coordinates.
thick_diagonal: Returns a matrix that is a thick line along the diagonal.
z_to_vector: Gets a rotation matrix from z axis to the given vector.
tex_file_writing: Functions for handling TeX files.

convert_to_svg: Converts DVI, XDV, or PDF to SVG.
delete_nonsvg_files: Deletes non-SVG files in a directory.
generate_tex_file: Generates a full TeX file from an expression.
get_tex_command: Returns the TeX command for compiling a file.
insight_inputenc_error:
insight_package_not_found_error:
print_all_tex_errors: Prints all errors from a TeX log file.
print_tex_error: Prints a single error from a TeX log file.
tex_compilation_command: Creates the command for tex compilation.
tex_hash:
tex_to_svg_file: Compiles a TeX expression into an SVG file.
tex_templates: A library of LaTeX templates.

TexFontTemplates: Templates for custom font configurations.
TexTemplateLibrary: A collection of basic TeX templates.
typing: Custom type definitions used in Manim.

ManimFloat: A double-precision float.
ManimInt: A long integer.
ManimColorDType: Color data type (float between 0 and 1).
RGB_Array_Float/Tuple_Float/Array_Int/Tuple_Int: RGB color representations.
RGBA_Array_Float/Tuple_Float/Array_Int/Tuple_Int: RGBA color representations.
HSV_Array_Float/Tuple_Float: HSV color representations.
ManimColorInternal: Manim's internal color representation.
PointDType: Data type for points (double-precision float).
InternalPoint2D/Point2D: 2D point representations.
InternalPoint2D_Array/Point2D_Array: Arrays of 2D points.
InternalPoint3D/Point3D: 3D point representations.
InternalPoint3D_Array/Point3D_Array: Arrays of 3D points.
Vector2D/Vector2D_Array: 2D vector representations.
Vector3D/Vector3D_Array: 3D vector representations.
VectorND/VectorND_Array: N-dimensional vector representations.
RowVector: Row vector representation.
ColVector: Column vector representation.
MatrixMN: General matrix type representation.
Zeros: Type for a matrix of zeros.
QuadraticBezierPoints/QuadraticBezierPoints_Array: Types for quadratic Bézier curves.
QuadraticBezierPath/QuadraticSpline: Types for quadratic Bézier paths and splines.
CubicBezierPoints/CubicBezierPoints_Array: Types for cubic Bézier curves.
CubicBezierPath/CubicSpline: Types for cubic Bézier paths and splines.
BezierPoints/BezierPoints_Array: Types for generic Bézier curves.
BezierPath/Spline: Types for generic Bézier paths and splines.
FlatBezierPoints: Type for flattened Bézier control points.
FunctionOverride: Type for function overriding methods.
PathFuncType: Type for path functions.
MappingFunction: Type for a function that maps a point to another point.
Image: A raster image.
GrayscaleImage: Type for grayscale images.
RGBImage: Type for RGB color images.
RGBAImage: Type for RGBA color images.
StrPath/StrOrBytesPath: Types for string paths.
content_copy


Animations

Animate mobjects with various effects, including movement, transformations, and appearance changes.

Animation: Base class for animations, with parameters like mobject, lag_ratio, run_time, and rate_func. Includes methods for starting, finishing, and updating animations.
Wait: A "no operation" animation that pauses execution for a specified time.

Override animation: Decorator to customize animations for specific Mobject types.
Prepare animation: Function to handle animation factories or return unchanged animations.

Changing
Animation of mobject boundaries and tracing of points.

AnimatedBoundary: Animates color changes on a VMobject's boundary.
TracedPath: Traces the path of a point, with optional dissipation over time.

Composition
Tools for managing multiple animations simultaneously.

AnimationGroup: Plays a list of animations concurrently.
LaggedStart: Staggers animation start times based on lag_ratio.
LaggedStartMap: Applies an animation to submobjects using a mapping function.
Succession: Plays animations sequentially.

Creation
Display or removal of mobjects from a scene.

AddTextLetterByLetter/WordByWord: Reveals Text letter by letter or word by word.
Create: Incrementally shows a VMobject.
DrawBorderThenFill: Draws a border before filling a VMobject.
RemoveTextLetterByLetter: Removes Text letter by letter.
ShowIncreasingSubsets: Reveals submobjects one at a time, leaving previous ones visible.
ShowPartial: Base class for animations that partially reveal a VMobject.
ShowSubmobjectsOneByOne: Reveals submobjects one at a time, removing previous ones.
SpiralIn: Creates an Mobject by spiraling its sub-mobjects inward.
Uncreate: Like Create but in reverse.
Unwrite: Simulates erasing a Text or VMobject.
Write: Simulates hand-writing a Text or VMobject.

Fading
Fading in and out of view.

FadeIn: Fades in mobjects, with options for shifting and scaling.
FadeOut: Fades out mobjects, with options for shifting and scaling.

Growing
Introducing mobjects by growing them from points.

GrowArrow: Introduces an arrow by growing it from start to tip.
GrowFromCenter: Grows a mobject from its center.
GrowFromEdge: Grows a mobject from an edge.
GrowFromPoint: Grows a mobject from a specified point.
SpinInFromNothing: Introduces a spinning mobject.

Indication
Drawing attention to particular mobjects.

ApplyWave: Distorts a mobject with a wave.
Circumscribe: Draws a line around a mobject.
Flash: Sends out lines in all directions from a point.
FocusOn: Shrinks a spotlight to a position.
Indicate: Temporarily resizes and recolors a mobject.
ShowPassingFlash: Reveals a sliver of a VMobject.
Wiggle: Wiggles a mobject.

Movement
Animations related to movement.

ComplexHomotopy: Applies a complex homotopy.
Homotopy: Transforms points of a mobject using a function.
MoveAlongPath: Moves a mobject along a path.
PhaseFlow: Applies a phase flow animation.
SmoothedVectorizedHomotopy: Applies a smoothed vectorized homotopy.

Numbers
Animations for changing numbers.

ChangeDecimalToValue: Changes a DecimalNumber to a target value.
ChangingDecimal: Base class for animations that modify DecimalNumbers.

Rotation
Animations related to rotation.

Rotate: Rotates a mobject.
Rotating: Base class for continuous rotation animations.

Specialized
Broadcast: Broadcasts a mobject from a focal point.

Speed Modifier
Utilities for modifying animation speed.

ChangeSpeed: Modifies animation speed using a speedinfo dictionary.

Transform
Transforming one mobject into another.

ApplyComplexFunction: Applies a complex function.
ApplyFunction: Applies a function.
ApplyMatrix: Applies a matrix transformation.
ApplyMethod: Animates a mobject by applying a method.
ApplyPointwiseFunction: Applies a pointwise function.
ApplyPointwiseFunctionToCenter: Applies a pointwise function to the center.
ClockwiseTransform: Transforms points along a clockwise arc.
CounterclockwiseTransform: Transforms points along a counterclockwise arc.
CyclicReplace: Cyclically moves mobjects.
FadeToColor: Changes a mobject's color.
FadeTransform: Fades one mobject into another.
FadeTransformPieces: Fades submobjects of one mobject into another.
MoveToTarget: Transforms a mobject to its target attribute.
ReplacementTransform: Replaces and morphs a mobject.
Restore: Transforms a mobject to its last saved state.
ScaleInPlace: Scales a mobject by a factor.
ShrinkToCenter: Shrinks a mobject to its center.
Swap: Swaps two or more mobjects.
Transform: Base class for transforming a mobject.
TransformAnimations: Transforms between animations.
TransformFromCopy: Performs a reversed Transform.

Transform Matching Parts
Transforming while keeping track of identical parts.

TransformMatchingAbstractBase: Base class for matching transformations.
TransformMatchingShapes: Transforms groups by matching submobject shapes.
TransformMatchingTex: Transforms LaTeX strings by matching tex strings.

Updaters
Animations and mobjects related to update functions.
Animations that update mobjects.

Cameras
Camera: Base class for converting mobjects into pixel arrays.

BackgroundColoredVMobjectDisplayer: Displays VMobjects with a background image.
MappingCamera: Camera for mapping between objects.
MovingCamera: Camera that can move through a scene.
MultiCamera: Camera supporting multiple perspectives.
ThreeDCamera: Camera for three-dimensional scenes.

Configuration
_config: Sets global configurations and logger.

utils: Utilities for creating and setting configuration.
logger_utils: Utilities for creating and setting the logger.
tempconfig: Temporarily modifies the global config.
config_file_paths: Specifies paths for config files.
make_config_parser: Creates a config parser.
make_logger: Creates the manim logger and console.
parse_theme: Configures the rich style of the logger.
set_file_logger: Adds a file handler to the logger.

Mobjects
frame: Special rectangles.

FullScreenRectangle: A rectangle that fills the entire screen.
ScreenRectangle: A rectangle with a specific aspect ratio.
geometry: Various geometric mobjects.

arc: Mobjects that are curved.
boolean_ops: Boolean operations for 2D mobjects.
labeled: Labeled line-based mobjects.
line: Line-based mobjects.
polygram: Simple geometric shape mobjects.
shape_matchers: Mobjects for marking and annotating.
tips: Tip mobjects for use with TipableVMobject.
graph: Mobjects for mathematical graphs.

DiGraph: A directed graph.
GenericGraph: Base class for graphs.
Graph: An undirected graph.
LayoutFunction: Protocol for automatic graph layout functions.
graphing: Coordinate systems and function graphing mobjects.

coordinate_systems: Mobjects for coordinate systems.
functions: Mobjects for function graphs.
number_line: A mobject representing a number line.
probability: Mobjects for probability and statistics.
scale: Mobjects related to scaling.
logo: Manim logo and banner utilities.

ManimBanner: Class representing Manim's banner.
matrix: Mobjects representing matrices.

DecimalMatrix: Matrix with decimal entries.
IntegerMatrix: Matrix with integer entries.
Matrix: A generic matrix mobject.
MobjectMatrix: Matrix with mobject entries.
mobject: Base classes for displayable objects.

Group: Groups together multiple mobjects.
Mobject: Base class for all displayable objects.
override_animate: Decorator to customize method animations.
svg: Mobjects related to SVG images.

brace: Mobject representing curly braces.
svg_mobject: Mobjects generated from SVG files.
table: Mobjects representing tables.

DecimalTable: Table with decimal entries.
IntegerTable: Table with integer entries.
MathTable: Table for LaTeX math expressions.
MobjectTable: Table with mobject entries.
Table: Base class for table mobjects.
text: Text-based mobjects.

three_d: Three-dimensional mobjects.
types: Specialized mobject base classes.

image_mobject: Mobjects representing raster images.
point_cloud_mobject: Mobjects representing point clouds.
vectorized_mobject: Mobjects that use vector graphics.
utils: Utilities for mobjects.

get_mobject_class: Gets the base mobject class.
get_point_mobject_class: Gets the point cloud mobject class.
get_vectorized_mobject_class: Gets the vectorized mobject class.
value_tracker: Mobjects for storing and updating values.

ComplexValueTracker: Tracks complex-valued parameters.
ValueTracker: Tracks real-valued parameters.
vector_field: Mobjects representing vector fields.

ArrowVectorField: Vector field represented by change vectors.
StreamLines: Vector field visualization with moving agents.
VectorField: Base class for vector fields.

Scenes
moving_camera_scene: Scene with a moving camera.

MovingCameraScene: Base class for moving camera scenes.
section: Building blocks for the segmented video API.

DefaultSectionType: Enum for section types.
Section: Segmentation of a Scene into multiple sections.
scene: Basic canvas for animations.

RerunSceneHandler: Handles scene rerunning on file modification.
Scene: The base class for all Manim scenes.
camera_class:
_get_animation_time_progression():
add():
add_foreground_mobject():
add_sound():
add_subcaption():
add_updater():
begin_animations():
bring_to_back():
bring_to_front():
clear():
compile_animation_data():
compile_animations():
construct():
embed():
get_attrs():
get_mobject_family_members():
get_moving_and_static_mobjects():
get_moving_mobjects():
get_restructured_mobject_list():
get_run_time():
get_time_progression():
get_top_level_mobjects():
interact():
interactive_embed():
is_current_animation_frozen_frame():
mouse_drag_orbit_controls():
mouse_scroll_orbit_controls():
next_section():
on_key_press():
on_key_release():
on_mouse_drag():
on_mouse_motion():
on_mouse_press():
on_mouse_scroll():
pause():
play():
play_internal():
remove():
remove_updater():
render():
replace():
restructure_mobjects():
set_key_function():
setup():
should_update_mobjects():
tear_down():
update_meshes():
update_mobjects():
update_self():
update_to_time():
wait():
wait_until():
scene_file_writer: Interface between scenes and ffmpeg.

SceneFileWriter: Class that handles writing animations to video files.
three_d_scene: Scene for rendering 3D objects and animations.

SpecialThreeDScene: ThreeDScene with additional settings.
ThreeDScene: Base class for 3D scenes.
vector_space_scene: Scene for vector space visualizations.

LinearTransformationScene: Scene for linear transformations.
VectorScene: Base class for vector space scenes.
zoomed_scene: Scene supporting zooming in on sections.
ZoomedScene: Base class for zoomed scenes.

bezier: Utilities for Bézier curves.

bezier: Classic implementation of Bézier curve.
diag_to_matrix: Converts a list of diagonal entries into a matrix.
get_quadratic_approximation_of_cubic: Approximates a cubic Bézier curve with a quadratic one.
get_smooth_cubic_bezier_handle_points: Computes handles for a smooth cubic Bézier curve.
get_smooth_handle_points: Computes smooth handles for Bézier curves.
integer_interpolate: Interpolates integers and returns the residual.
interpolate: Interpolates between two values (or points).
inverse_interpolate: Inverse interpolation for determining alpha values.
is_closed: Checks if a set of points forms a closed loop.
match_interpolate: Maps an alpha value from an old range to a new one.
mid: Returns the midpoint between two values.
partial_bezier_points: Returns points for a segment of a Bézier curve.
partial_quadratic_bezier_points: Returns points for a segment of a quadratic Bézier curve.
point_lies_on_bezier: Checks if a point lies on a Bézier curve.
proportions_along_bezier_curve_for_point: Gets the proportions along a Bézier curve for a point.
quadratic_bezier_remap: Remaps the number of curves in a quadratic Bézier path.
split_quadratic_bezier: Splits a quadratic Bézier curve.
subdivide_quadratic_bezier: Subdivides a quadratic Bézier curve into multiple subcurves.
color: Utilities for working with colors.

core: Color data structure and conversion utilities.
manim_colors: Predefined colors in Manim's namespace.
AS2700: Colors from the Australian Standard.
BS381: Colors from the British Standard.
XKCD: Colors from the XKCD Color Name Survey.
X11: X11 colors.
commands: Utilities for shell commands.

capture: Captures the output of a shell command.
get_dir_layout: Gets the directory layout.
get_video_metadata: Gets video metadata.
config_ops: Utilities for configuration dictionaries.

DictAsObject: A class for accessing dictionaries like objects.
merge_dicts_recursively: Recursively merges dictionaries.
update_dict_recursively: Recursively updates a dictionary.
constants: Constant definitions.

ORIGIN: Center of the coordinate system.
UP/DOWN/RIGHT/LEFT/IN/OUT: Unit steps in cardinal directions.
UL/UR/DL/DR: Unit steps in diagonal directions.
PI/TAU/DEGREES: Math constants.
CapStyleType/LineJointType/RendererType: Enums for different rendering options.
debug: Debugging utilities.

index_labels: Labels submobjects with their index.
print_family: Prints the mobject family.
deprecation: Decorators for deprecating code.

deprecated: Marks a callable as deprecated.
file_ops: Operations for files

get_full_raster_image_path: Gets a raster image path.
get_full_vector_image_path: Gets a vector image path.
invert_image: Inverts pixel values of an image.
ipython_magic: Utilities for IPython usage.

ManimMagic: IPython magic for running manim code.
iterables: Operations on iterables.

adjacent_n_tuples: Creates n-tuples from a sequence.
adjacent_pairs: Creates pairs from a sequence.
all_elements_are_instances: Checks if all elements are of a class.
batch_by_property: Batches items based on a property.
concatenate_lists: Concatenates multiple lists.
hash_obj: Creates a hash for any object.
list_difference_update: Returns a list of elements in l1 but not l2.
list_update: Updates a list while maintaining order.
listify: Converts an object to a list.
make_even: Extends the shorter of two iterables by duplicating elements from the beginning.
make_even_by_cycling: Extends the shorter of two iterables by cycling through elements.
remove_list_redundancies: Removes duplicates while preserving order.
remove_nones: Removes elements that evaluate to False.
resize_array: Extends/truncates an array by cycling elements.
resize_preserving_order: Extends/truncates an array by duplicating elements from the beginning.
resize_with_interpolation: Extends/truncates an array by interpolating elements.
stretch_array_to_length: Stretches array to the given length.
tuplify: Converts an object to a tuple.
uniq_chain: Yields unique elements from multiple iterables.
paths: Functions defining transformation paths.

clockwise_path: Transforms points along a clockwise arc.
counterclockwise_path: Transforms points along a counterclockwise arc.
path_along_arc: Transforms points along a circular arc.
path_along_circles: Transforms points along individual circular arcs.
spiral_path: Transforms points along a spiral.
straight_path: Transforms points along a straight line.
rate_functions: A selection of rate functions.

double_smooth: Creates a smooth curve with a double smooth.
ease_in_back: Creates a curve that eases in.
ease_in_bounce: Creates a curve that bounces as it eases in.
ease_in_circ: Creates a circle-like ease in curve.
ease_in_cubic: Creates a cubic ease in curve.
ease_in_elastic: Creates an elastic ease in curve.
ease_in_expo: Creates an exponential ease in curve.
ease_in_out_back: Creates a smooth curve that eases in and out.
ease_in_out_bounce: Creates a curve that bounces as it eases in and out.
ease_in_out_circ: Creates a circle-like ease in and out curve.
ease_in_out_cubic: Creates a cubic ease in and out curve.
ease_in_out_elastic: Creates an elastic ease in and out curve.
ease_in_out_expo: Creates an exponential ease in and out curve.
ease_in_out_quad: Creates a quadratic ease in and out curve.
ease_in_out_quart: Creates a quartic ease in and out curve.
ease_in_out_quint: Creates a quintic ease in and out curve.
ease_in_out_sine: Creates a sine ease in and out curve.
ease_in_quad: Creates a quadratic ease in curve.
ease_in_quart: Creates a quartic ease in curve.
ease_in_quint: Creates a quintic ease in curve.
ease_in_sine: Creates a sine ease in curve.
ease_out_back: Creates a curve that eases out.
ease_out_bounce: Creates a curve that bounces as it eases out.
ease_out_circ: Creates a circle-like ease out curve.
ease_out_cubic: Creates a cubic ease out curve.
ease_out_elastic: Creates an elastic ease out curve.
ease_out_expo: Creates an exponential ease out curve.
ease_out_quad: Creates a quadratic ease out curve.
ease_out_quart: Creates a quartic ease out curve.
ease_out_quint: Creates a quintic ease out curve.
ease_out_sine: Creates a sine ease out curve.
exponential_decay: Creates a curve that shows an exponential decay.
linear: Creates a linear curve.
lingering: Creates a curve with lingering speed.
not_quite_there: Custom rate function that does not quite reach the target.
running_start: Creates a curve that starts with a backward pull.
rush_from: Creates a curve that starts fast and slows down.
rush_into: Creates a curve that starts slow and rushes into its end.
slow_into: Creates a curve that smoothly slows in its start.
smooth: Creates a smooth curve that starts slowly and ends slowly.
smoothererstep: Smoothstep function with zero 3rd derivative at the endpoints.
smootherstep: Smoothstep function with zero 2nd derivative at the endpoints.
smoothstep: Smoothstep function with zero 1st derivative at the endpoints.
squish_rate_func: Modifies a rate function to start and end faster.
there_and_back: Creates a curve that moves to the end and returns back.
there_and_back_with_pause: Creates a curve that moves to the end and returns back with a pause at the end.
unit_interval: Maps a rate function to the unit interval.
wiggle: Creates a curve that wiggles.
zero: Returns zero regardless of input.
simple_functions: A collection of simple math functions.

binary_search: Finds a value in a range by repeatedly dividing the range in half.
choose: Calculates the binomial coefficient n choose k.
clip: Clips a value to a certain range.
sigmoid: Computes the sigmoid function.
sounds: Sound-related utilities.

get_full_sound_file_path: Gets the full path to a sound file.
space_ops: Utility functions for vectors and matrices.

R3_to_complex: Converts 3D vector to complex number.
angle_axis_from_quaternion: Extracts angle and axis from a quaternion.
angle_between_vectors: Returns the angle between two vectors.
angle_of_vector: Returns polar coordinate theta of a 2D projected vector.
cartesian_to_spherical: Transforms cartesian coordinates to spherical ones.
center_of_mass: Gets the center of mass of a set of points.
compass_directions: Finds the cardinal directions.
complex_func_to_R3_func: Converts a complex function to R3.
complex_to_R3: Converts a complex number to a 3D vector.
cross: Computes the cross product of two vectors.
cross2d: Computes the 2D cross product.
earclip_triangulation: Returns a list of indices giving a triangulation of a polygon.
find_intersection: Computes the intersection point of two lines or rays.
get_unit_normal: Gets the unit normal of a vector.
get_winding_number: Determines the winding number of a polygon.
line_intersection: Returns the intersection point of two lines.
midpoint: Gets the midpoint of two points.
norm_squared: Returns the squared norm of a vector.
normalize: Normalizes a vector.
normalize_along_axis: Normalizes a matrix along its axes.
perpendicular_bisector: Returns the perpendicular bisector of a line.
quaternion_conjugate: Gets the conjugate of a quaternion.
quaternion_from_angle_axis: Gets a quaternion from an angle and an axis.
quaternion_mult: Multiplies two quaternions.
regular_vertices: Generates regularly spaced vertices around a circle.
rotate_vector: Rotates a vector using angle and axis.
rotation_about_z: Returns a rotation matrix for a given angle around z-axis.
rotation_matrix: Returns a rotation matrix for a given angle and axis.
rotation_matrix_from_quaternion: Creates a rotation matrix from a quaternion.
rotation_matrix_transpose: Returns a rotation matrix transpose for a given angle and axis.
rotation_matrix_transpose_from_quaternion: Creates a rotation matrix transpose from a quaternion.
shoelace: Computes area with the shoelace formula.
shoelace_direction: Determines direction (CW/CCW) with the shoelace formula.
spherical_to_cartesian: Transforms spherical coordinates to Cartesian coordinates.
thick_diagonal: Returns a matrix that is a thick line along the diagonal.
z_to_vector: Gets a rotation matrix from z axis to the given vector.
tex_file_writing: Functions for handling TeX files.

convert_to_svg: Converts DVI, XDV, or PDF to SVG.
delete_nonsvg_files: Deletes non-SVG files in a directory.
generate_tex_file: Generates a full TeX file from an expression.
get_tex_command: Returns the TeX command for compiling a file.
insight_inputenc_error:
insight_package_not_found_error:
print_all_tex_errors: Prints all errors from a TeX log file.
print_tex_error: Prints a single error from a TeX log file.
tex_compilation_command: Creates the command for tex compilation.
tex_hash:
tex_to_svg_file: Compiles a TeX expression into an SVG file.
tex_templates: A library of LaTeX templates.

TexFontTemplates: Templates for custom font configurations.
TexTemplateLibrary: A collection of basic TeX templates.
typing: Custom type definitions used in Manim.

ManimFloat: A double-precision float.
ManimInt: A long integer.
ManimColorDType: Color data type (float between 0 and 1).
RGB_Array_Float/Tuple_Float/Array_Int/Tuple_Int: RGB color representations.
RGBA_Array_Float/Tuple_Float/Array_Int/Tuple_Int: RGBA color representations.
HSV_Array_Float/Tuple_Float: HSV color representations.
ManimColorInternal: Manim's internal color representation.
PointDType: Data type for points (double-precision float).
InternalPoint2D/Point2D: 2D point representations.
InternalPoint2D_Array/Point2D_Array: Arrays of 2D points.
InternalPoint3D/Point3D: 3D point representations.
InternalPoint3D_Array/Point3D_Array: Arrays of 3D points.
Vector2D/Vector2D_Array: 2D vector representations.
Vector3D/Vector3D_Array: 3D vector representations.
VectorND/VectorND_Array: N-dimensional vector representations.
RowVector: Row vector representation.
ColVector: Column vector representation.
MatrixMN: General matrix type representation.
Zeros: Type for a matrix of zeros.
QuadraticBezierPoints/QuadraticBezierPoints_Array: Types for quadratic Bézier curves.
QuadraticBezierPath/QuadraticSpline: Types for quadratic Bézier paths and splines.
CubicBezierPoints/CubicBezierPoints_Array: Types for cubic Bézier curves.
CubicBezierPath/CubicSpline: Types for cubic Bézier paths and splines.
BezierPoints/BezierPoints_Array: Types for generic Bézier curves.
BezierPath/Spline: Types for generic Bézier paths and splines.
FlatBezierPoints: Type for flattened Bézier control points.
FunctionOverride: Type for function overriding methods.
PathFuncType: Type for path functions.
MappingFunction: Type for a function that maps a point to another point.
Image: A raster image.
GrayscaleImage: Type for grayscale images.
RGBImage: Type for RGB color images.
RGBAImage: Type for RGBA color images.
StrPath/StrOrBytesPath: Types for string paths.
content_copy
`,
    }
]
};

// Helper: call Gemini to plan steps
async function getStepsFromGemini(prompt) {
  const contents = [
    { role: 'user', parts: [{ text: 
      "You are a Manim‑code planner. When given a user’s animation request, output exactly 6–7 numbered, concise, actionable planning steps you will follow to generate the Manim scene code. Do not output any code—only the internal steps (e.g. choose shape, set parameters, add to scene, render)."
    }]},
    { role: 'user', parts: [{ text: prompt }] }
  ];
  const response = await ai.models.generateContent({ model: modelId, config: generationConfig, contents });
  return response.text;
}

// Helper: call Gemini to produce manim code
async function getManimCodeFromGemini(steps) {
  const contents = [
    { role: 'user', parts: [{ text:
      "Generate only the complete Manim scene code—no explanations, comments, or extra text—for the following animation steps. Your output must define exactly one subclass of Scene with a construct(self): method containing all animation logic, include every necessary import (for example from manim import * or import numpy as np), omit any if __name__ == '__main__' or other functions, and implement the given steps in order with no errors."
    }]},
    { role: 'user', parts: [{ text: steps }] }
  ];
  const response = await ai.models.generateContent({ model: modelId, config: generationConfig, contents });
  let code = response.text;
  // clean backticks
  code = code.replace(/^```(?:python)?\s*|```$/gm, "");
  if (!code.includes("from manim import *")) {
    code = `from manim import *\n\n${code}`;
  }
  return code.trim();
}

// Helper: regen steps with existing code or error
async function getStepsFromGeminiRegen(prompt, code) {
  const contents = [
    { role: 'user', parts: [{ text:
      "You are a Manim‑code planner: when I supply you with both a user’s natural‑language request and any existing code or error snippet, you will reply with exactly 6–7 numbered, concise, action‑first planning steps that you (the AI) will follow to produce the final, error‑free Manim Scene subclass (including imports and a single construct method). Do not output any code or explanation—only the internal roadmap steps, each naming the class/methods or parameters you will choose, how you will parse the prompt or fix errors, assemble mobjects, sequence animations, and render."
    }]},
    { role: 'user', parts: [{ text: prompt + "\n" + code }] }
  ];
  const response = await ai.models.generateContent({ model: modelId, config: generationConfig, contents });
  return response.text;
}

function deleteFile(filePath) {
  fsExtra.emptyDirSync(filePath);
}

// Save code to file and render via manim
const saveManimCodeToFile = (code, filePath) => fs.writeFileSync(filePath, code, "utf8");
async function runPythonScript(scriptPath, outputPath) {
  const mediaDir = path.resolve(__dirname, "media");
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("manim", ["--format=mp4", scriptPath, "Scene", "-o", outputPath]);
    let errorData = "";
    pythonProcess.stderr.on("data", chunk => { errorData += chunk.toString(); });
    pythonProcess.on("close", code => {
      if (code !== 0) reject(new Error(errorData)); else resolve();
    });
  });
}

// Routes
app.get("/", (req, res) => res.json({ message: "Hello World!" }));

app.post("/generate-animation", async (req, res) => {
  deleteFile("media");
  const { prompt } = req.body;
  try {
    const steps = await getStepsFromGemini(prompt);
    const manimCode = await getManimCodeFromGemini(steps);
    res.json({ code: manimCode, steps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/regenerate", async (req, res) => {
  deleteFile("media");
  const { input, code } = req.body;
  try {
    const steps = await getStepsFromGeminiRegen(input, code);
    const manimCode = await getManimCodeFromGemini(steps);
    res.json({ code: manimCode, steps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/resolve", async (req, res) => {
  const { error, code } = req.body;
  try {
    const steps = await getStepsFromGeminiRegen(error, code);
    const manimCode = await getManimCodeFromGemini(steps);
    res.json({ code: manimCode, steps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/render", async (req, res) => {
  const { code } = req.body;
  try {
    const scriptPath = path.resolve("generated_manim_code.py");
    saveManimCodeToFile(code, scriptPath);
    const outputVideoPath = path.resolve("output.mp4");
    await runPythonScript(scriptPath, outputVideoPath);
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/sendvid", (req, res) => {
  const filePath = "output.mp4";
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
  const stat = fs.statSync(filePath);
  res.writeHead(200, { "Content-Length": stat.size, "Content-Type": "video/mp4" });
  fs.createReadStream(filePath).pipe(res);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
