from manim import *
import numpy as np

class MatrixAnimation(Scene):
    def construct(self):
        input_values = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]).astype(int)
        matrix_size = input_values.shape[0]
        square_size = 1
        group = VGroup()
        for y in range(matrix_size):
            for x in range(matrix_size):
                square = Square(side_length=square_size, fill_opacity=0.5, color=BLUE).move_to(x*square_size*RIGHT + y*square_size*DOWN)
                text = Text(str(input_values[y,x]), color=WHITE).move_to(square.get_center())
                group.add(square,text)
                
        self.play(Create(group))
        self.wait(1)